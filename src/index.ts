import { GameMode } from './types/game/state.type.js'
import CBot from './engine/CBot.js'

const RETRIES = 3;

const startApplication = async () => {
  const gameConfigs = [
    // { ckey: '571422-12faa5-917db5-358bae', mode: GameMode.Sandbox },
    // { ckey: 'cfight-8afd68-f61ece-1c150d-1', mode: GameMode.Sandbox },
    // { ckey: 'cfight-8afd68-f61ece-1c150d-2', mode: GameMode.Sandbox },
    { ckey: 'cfight-8afd68-f61ece-1c150d-3', mode: GameMode.Sandbox, strategy: {}, opponent: undefined }, // TODO: strategy as an object with some more configuration?
    // { ckey: 'cfight-8afd68-f61ece-1c150d-4', mode: GameMode.Sandbox, strategy: {}, opponent: undefined },
    // { ckey: 'cfight-8afd68-f61ece-1c150d-5', mode: GameMode.Sandbox },
    // { ckey: 'cfight-8afd68-f61ece-1c150d-6', mode: GameMode.Sandbox },
    // { ckey: 'cfight-8afd68-f61ece-1c150d-7', mode: GameMode.Sandbox },
    // { ckey: 'cfight-8afd68-f61ece-1c150d-8', mode: GameMode.Sandbox },
    // { ckey: 'cfight-8afd68-f61ece-1c150d-9', mode: GameMode.Sandbox },
    // { ckey: 'cfight-8afd68-f61ece-1c150d-10', mode: GameMode.Sandbox }
  ]

  // TODO: strategy as an object or some configuration that stores the strategy identifier and then CBot takes it and acts according to it on it's play()

  for (const { ckey, mode, strategy, opponent } of gameConfigs) {
    const cbot = new CBot(ckey, mode, opponent)

    for (let i = 0; i < RETRIES; i++) {
      try {
        cbot.run(strategy)
          .then(res => console.log(res))
          .catch(err => console.error(err));

      } catch (error) {
        console.warn(
          `Error creating bot ${i + 1} of 3`
        )

        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }
}

startApplication().catch((error) => {
  console.error('Error starting application:', error)
  process.exit(1)
})


