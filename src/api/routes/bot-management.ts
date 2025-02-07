import { Request, Response, Router } from 'express'
import { asyncHandler } from '../../utils/utils.js'
import botManager from '../../c-bots/c-bot-manager.js'

const router = Router()

// Run a bot
router.post('/bot/:ckey/run', asyncHandler(async (req: Request, res: Response) => {
  const { ckey } = req.params
  await botManager.startBot(ckey)
  const { status } = await botManager.getBotStatus(ckey)
  res.status(200).json({ message: 'Bot started successfully!', status })
}))

// Stop a bot
router.post('/bot/:ckey/stop', asyncHandler(async (req: Request, res: Response) => {
  const { ckey } = req.params
  botManager.stopBot(ckey)
  const { status } = await botManager.getBotStatus(ckey)
  res.status(200).json({ message: 'Bot stopped successfully!', status })
}))

// Get bot status
router.get('/bot/:ckey/status', asyncHandler(async (req: Request, res: Response) => {
  const { status, active } = await botManager.getBotStatus(req.params.ckey)
  const message = active ? 'Bot is running.' : 'Bot is stopped.'
  res.status(200).json({ message, status })
}))

export default router
