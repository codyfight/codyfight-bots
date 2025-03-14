import botManager from './c-bot-manager.js'
import Logger from '../utils/logger.js'

// Uncomment the following lines to enable graceful shutdown for all bots when the process receives a shutdown signal
// This means that when the process receives a SIGINT, SIGHUP, or SIGTERM signal, it will stop all bots before exiting
// These signals can be sent when closing the terminal, or by using the `kill` command

// let stopping = false;
// // Shutdown signal handlers for graceful termination of bots
// ['SIGINT', 'SIGHUP', 'SIGTERM'].forEach(signal =>
//   process.on(signal, async () => {
//    if(stopping) return
//
//     stopping = true;
//     Logger.info(`${signal} received. Stopping all bots...`);
//     await botManager.stopAll();
//     Logger.info('Shutdown complete.');
//     process.exit(0);
//   })
// );

// Start the bot runner
Logger.info(`Application started: Running All Bots`);
await botManager.runAll();
