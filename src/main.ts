import http from 'http';
import app from './app';
import { PORT } from './lib/constants';
import { createSocketServer } from './services/socketService';

const httpServer = http.createServer(app);

createSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
