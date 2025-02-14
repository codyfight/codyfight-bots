import botManager from './c-bot-manager.js'
import Logger from '../utils/logger.js'

let stopping = false;
// Shutdown signal handlers for graceful termination of bots
['SIGINT', 'SIGHUP', 'SIGTERM'].forEach(signal =>
  process.on(signal, async () => {
   if(stopping) return

    stopping = true;
    Logger.info(`${signal} received. Stopping all bots...`);
    await botManager.stopAll();
    Logger.info('Shutdown complete.');
    process.exit(0);
  })
);

// Start the bot runner
Logger.info(`Application started: Running All Bots`);
await botManager.runAll();
