import { GameMode } from './types/game/state.type.js'
import CBot from './engine/CBot.js'

const RETRIES = 3

const gameConfigs = [
   { ckey: '571422-12faa5-917db5-358bae', mode: GameMode.Testing, strategy: {}, opponent: undefined  },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-1', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-2', mode: GameMode.Sandbox },
  //{ ckey: 'cfight-8afd68-f61ece-1c150d-3', mode: GameMode.Sandbox, strategy: {}, opponent: undefined } // TODO: strategy as an object with some more configuration?
  //{ ckey: 'cfight-8afd68-f61ece-1c150d-4', mode: GameMode.Sandbox, strategy: {}, opponent: undefined },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-5', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-6', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-7', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-8', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-9', mode: GameMode.Sandbox },
  // { ckey: 'cfight-8afd68-f61ece-1c150d-10', mode: GameMode.Sandbox }
]

const retry = async <T>(runBot: () => Promise<T>): Promise<T> => {
  for (let i = 0; i < RETRIES; i++) {
    try {
      return await runBot()
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed. Retrying...`)
    }
  }

  throw new Error(`Failed to start bot ....`)
}

const startApplication = async () => {
  for (const { ckey, mode, strategy, opponent } of gameConfigs) {
    const cbot = new CBot(ckey, mode, opponent)

    try {
      await retry(() => cbot.run(strategy))
    } catch (error) {
      console.error(`CBot (${ckey}) failed after ${RETRIES} attempts:`, error)
    }
  }
}

startApplication().catch((error) => {
  console.error('Error starting application:', error)
  process.exit(1)
})

