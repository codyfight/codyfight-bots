import { GameMode } from './types/game/state.type.js'
import GameManager from './engine/GameManager.js'

const CKEY = process.env.CKEY as string

const startApplication = async () => {
  const gameManager = new GameManager(CKEY, GameMode.Sandbox)
  await gameManager.start()
}

startApplication().catch((error) => {
  console.error('Error starting application:', error)
  process.exit(1)
})
