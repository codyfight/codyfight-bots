import { Request, Response, Router } from 'express'
import { asyncHandler } from '../../utils/utils.js'
import botManager from '../../c-bots/c-bot-manager.js'

const router = Router()

// Run a bot
router.post('/bot/:ckey/run', asyncHandler(async (req: Request, res: Response) => {
  const { ckey } = req.params;
  await botManager.startBot(ckey);
  const status = await botManager.getBotStatus(req.params.ckey);
  res.status(200).json({ message: `Bot started successfully!`, status: status});
}))

// Stop a bot
router.post('/bot/:ckey/stop', asyncHandler(async (req: Request, res: Response) => {
  const { ckey } = req.params
  botManager.stopBot(ckey)
  const status = await botManager.getBotStatus(req.params.ckey);
  res.status(200).json({ message: 'Bot stopped successfully!', status: status})
}))

// Get bot status
router.get('/bot/:ckey/status', asyncHandler(async (req: Request, res: Response) => {
  const status = await botManager.getBotStatus(req.params.ckey);
  res.status(200).json({ message: 'Status retrieved successfully!', status: status });
}))

export default router
