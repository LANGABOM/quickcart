import { number, string, z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, authProcedure } from '../trpc';
import { env } from '../../../utils/env';
import { prisma } from '../../../lib/database';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Helper function to generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    env.JWT_SECRET as any,
    {
      expiresIn: env.JWT_EXPIRES_IN as any
    }
  );
};

// Helper function to set auth cookie
const setAuthCookie = (res: any, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, name } = input;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      // Generate JWT token
      const token = generateToken(user.id);

      // Set cookie
      setAuthCookie(ctx.res, token);

      return {
        user,
        token,
        message: 'Registration successful',
      };
    }),

  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Set cookie
      setAuthCookie(ctx.res, token);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
        message: 'Login successful',
      };
    }),

  logout: authProcedure
    .mutation(async ({ ctx }) => {
      ctx.res.clearCookie('token');
      return { message: 'Logout successful' };
    }),

  me: authProcedure
    .query(async ({ ctx }) => {
      return ctx.user;
    }),

  refreshToken: authProcedure
    .mutation(async ({ ctx }) => {
      const token = generateToken(ctx.user.id);

      setAuthCookie(ctx.res, token);

      return { token, message: 'Token refreshed successfully' };
    }),

  // Additional useful auth routes
  changePassword: authProcedure
    .input(z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const { currentPassword, newPassword } = input;

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: ctx.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Current password is incorrect',
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);

      // Update password
      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { password: hashedNewPassword },
      });

      return { message: 'Password changed successfully' };
    }),

  // Forgot password (basic implementation)
  forgotPassword: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const { email } = input;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if user exists or not for security
        return { message: 'If an account with that email exists, we sent a password reset link.' };
      }

      // TODO: Implement actual email sending logic here
      // For now, just return success message
      console.log(`Password reset requested for: ${email}`);

      return { message: 'If an account with that email exists, we sent a password reset link.' };
    }),
});
