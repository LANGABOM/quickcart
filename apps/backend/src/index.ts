import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { createContext } from './trpc/context';
import { appRouter } from './trpc/main';
import * as trpcExpress from '@trpc/server/adapters/express';
import { env } from '../utils/env';

(async () => {
  const app = express();
  const trpcApiEndpoint = '/trpc';
  const playgroundEndpoint = '/playground';

  // Middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://your-frontend-domain.com']
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  // tRPC middleware
  app.use(trpcApiEndpoint, trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }));

  app.get('/', (_req, res) => {
    res.send('QuickCart Backend is running!');
  });

  // Development playground
  app.get(playgroundEndpoint, async (_req: Request, res: Response): Promise<void> => {
    if (env.NODE_ENV === 'production') {
      res.status(404).send("Not Found");
      return;
    }
    const { renderTrpcPanel } = await import("trpc-ui");
    res.send(
      renderTrpcPanel(appRouter, {
        url: `http://localhost:${PORT}${trpcApiEndpoint}`,
        transformer: 'superjson',
      })
    );
  });

  const PORT = env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('🚀 QuickCart SERVER RUNNING:', {
      "Trpc Api Endpoint": `http://localhost:${PORT}${trpcApiEndpoint}`,
      "Playground Endpoint": `http://localhost:${PORT}${playgroundEndpoint}`,
    });
  });
})();