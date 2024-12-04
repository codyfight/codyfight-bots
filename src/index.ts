import GameManager from './engine/GameManager.js'

const startApplication = async () => {
  const gameManager = new GameManager()
  await gameManager.start()
}

startApplication().catch((error) => {
  console.error('Error starting application:', error)
  process.exit(1)
})

// TODO
// Only cast skills when ready and have targets
// Make sure agent only moves to safe locations
