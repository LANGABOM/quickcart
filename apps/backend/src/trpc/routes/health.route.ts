import { router, publicProcedure } from '../trpc';

export const healthRouter = router({
  check: publicProcedure
    .query(() => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'QuickCart API',
      };
    }),
});
