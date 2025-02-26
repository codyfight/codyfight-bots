import { Request, Response, Router } from 'express'

import { asyncHandler } from '../../utils/utils.js'
import { jwtAuthMiddleware } from '../middleware/authentication.js'
import botManager from '../../c-bots/c-bot-manager.js'
import { ICBotConfig } from '../../c-bots/c-bot/c-bot-config.interface.js'

const router = Router()

// Create Bot
router.post('/bot', jwtAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  await botManager.addBot(req.body as ICBotConfig)
  res.status(201).json({ message: 'Bot added successfully!', bot: req.body })
}))

// Get Bot
router.get('/bot/:ckey', asyncHandler(async (req: Request, res: Response) => {
  const bot = await botManager.getBot(req.params.ckey)
  const json = bot.toJSON()
  res.status(200).json({ message: 'Bot retrieved successfully!', bot: json })
}))

// Get All Bots
router.get('/bots', asyncHandler(async (req: Request, res: Response) => {
  
  if(!req.query.player_id) {
    res.status(400).json({ message: 'Missing player_id in query parameters' })
    return
  }

  const bots = await botManager.getAllBotConfigs(req.query)
  res.status(200).json({ message: 'Bots retrieved successfully!', bots: bots })
}))

// Update Bot
router.put('/bot/:ckey', jwtAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const ckey = req.params.ckey
  await botManager.updateBotConfig(ckey, req.body)
  res.status(200).json({ message: 'Bot updated successfully!', bot: { ckey, ...req.body } })
}))

// Delete Bot
router.delete('/bot/:ckey', jwtAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const ckey = req.params.ckey
  await botManager.stopBot(ckey)
  const bot = await botManager.getBot(ckey)
  const json = bot.toJSON()
  await botManager.deleteBotConfig(ckey)
  res.status(200).json({ message: 'Bot deleted successfully!', json })
}))

export default router
