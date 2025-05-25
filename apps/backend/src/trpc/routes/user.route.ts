import { z } from 'zod';
import { router, authProcedure, adminProcedure } from '../trpc';
import { prisma } from '../../../lib/database';


export const userRouter = router({
  getProfile: authProcedure
    .query(async ({ ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          
        },
      });

      return user;
    }),

  updateProfile: authProcedure
    .input(z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return updatedUser;
    }),

  getAllUsers: adminProcedure
    .query(async () => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return users;
    }),
});