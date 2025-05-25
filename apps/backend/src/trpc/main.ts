
import { authRouter } from './routes/auth.route';
import { userRouter } from './routes/user.route';
import { healthRouter } from './routes/health.route';
import { router } from './trpc';

/**
 * Main router that combines all route files for QuickCart
 */
export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  user: userRouter,
 
});

export type AppRouter = typeof appRouter;