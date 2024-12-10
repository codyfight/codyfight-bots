import { GameMode } from './types/game/state.type.js'
import CBot from './engine/CBot.js'

const RETRIES = 3

const gameConfigs = [
   { ckey: '571422-12faa5-917db5-358bae', mode: GameMode.Testing, strategy: {}, opponent: undefined  },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-1', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-2', mode: GameMode.Sandbox },
  { ckey: 'cfight-8afd68-f61ece-1c150d-3', mode: GameMode.Sandbox, strategy: {}, opponent: undefined },// TODO: strategy as an object with some more configuration?
  { ckey: 'cfight-8afd68-f61ece-1c150d-4', mode: GameMode.Sandbox, strategy: {}, opponent: undefined },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-5', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-6', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-7', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-8', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-9', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-10', mode: GameMode.Sandbox }
]
/**
 * Retry a function with a specified number of attempts.
 *
 * @param {() => Promise<T>} runBot - The function to execute.
 * @returns {Promise<T>} The resolved value of the function.
 * @throws {Error} If all retry attempts fail.
 */
const retry = async <T>(runBot: () => Promise<T>): Promise<T> => {
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      return await runBot();
    } catch (error) {
      console.warn(`Attempt ${attempt} failed. Retrying...`);
    }
  }
  throw new Error(`Failed to start bot after ${RETRIES} attempts.`);
};

/**
 * Start the application by initializing and running bots based on game configurations.
 */
const startApplication = async () => {
  for (const { ckey, mode, strategy, opponent } of gameConfigs) {
    console.info(`Starting bot for ckey: ${ckey}, mode: ${mode}, opponent: ${opponent}`);

    const cbot = new CBot(ckey, mode, opponent);

    try {
      await retry(() => cbot.run(strategy));
      console.info(`Bot (${ckey}) completed successfully.`);
    } catch (error) {
      console.error(`Bot (${ckey}) failed after ${RETRIES} attempts:`, error);
    }
  }
};


startApplication().catch((error) => {
  console.error('Error starting application:', error)
  process.exit(1)
})



// const y = Array.from({ length: 100 }, (_, i) => i + 1);
//
// for (const x of y) {
//   doStuff(x);
// }
//
// async function doStuff(x: number) {
//   console.log("Running Bot", x);
//
//   while(true){
//     //processing
//   }
// }
//
// async function runAll() {
//   const promises = y.map((x) => doStuff(x)); // Create an array of promises
//   await Promise.all(promises); // Wait for all promises to complete
// }
//
// runAll();
