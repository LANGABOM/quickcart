// trpc/context.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../utils/env';
import { prisma } from '../../lib/database';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
}

export interface Context {
    req: Request;
    res: Response;
    user: User | null;
}

export const createContext = async ({ req, res }: { req: Request; res: Response }): Promise<Context> => {
    let user: User | null = null;

    // Try to get token from Authorization header or cookies
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

            // Fetch user from database

            const foundUser = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                }
            });

            if (foundUser) {
                user = foundUser as any;
            }
        } catch (error) {
            // Token is invalid, user remains null
            console.warn('Invalid token:', error);
        }
    }

    return {
        req,
        res,
        user,
    };
};
