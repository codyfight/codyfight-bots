import { Request, Response, Router } from 'express'
import { asyncHandler } from '../../utils/utils.js'
import botManager from '../../c-bots/c-bot-manager.js'

const router = Router()

// Run a bot
router.post('/bot/:ckey/run', asyncHandler(async (req: Request, res: Response) => {
  const { ckey } = req.params;
  await botManager.startBot(ckey);
  const { bot, game } = await botManager.getBotStatus(ckey);
  res.status(200).json({ message: `Bot started successfully!`, bot, game });
}))

// Stop a bot
router.post('/bot/:ckey/stop', asyncHandler(async (req: Request, res: Response) => {
  const { ckey } = req.params
  botManager.stopBot(ckey)
  const { bot, game } = await botManager.getBotStatus(ckey);
  res.status(200).json({ message: 'Bot stopped successfully!', bot, game })
}))

// Get bot status
router.get('/bot/:ckey/status', asyncHandler(async (req: Request, res: Response) => {
  const { bot, game } = await botManager.getBotStatus(req.params.ckey);
  const message = bot.active ? 'Bot is running.' : 'Bot is stopped.';
  res.status(200).json({ message, bot, game });
}))

export default router
