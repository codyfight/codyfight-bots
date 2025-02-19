import { Request, Response, Router } from 'express'
import { createCBotRepository } from '../../db/repository/create-c-bot-repository.js'

import { asyncHandler } from '../../utils/utils.js'
import { jwtAuthMiddleware } from '../middleware/authentication.js'
import botManager from '../../c-bots/c-bot-manager.js'

const router = Router()
const botRepository = createCBotRepository()

// Create Bot
router.post('/bot', jwtAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  await botRepository.addBot(req.body)
  res.status(201).json({ message: 'Bot added successfully!', bot: req.body })
}))

// Get Bot
router.get('/bot/:ckey', asyncHandler(async (req: Request, res: Response) => {
  const bot = await botRepository.getBot(req.params.ckey)
  res.status(200).json({ message: 'Bot retrieved successfully!', bot })
}))

// Get All Bots
router.get('/bots', asyncHandler(async (req: Request, res: Response) => {
  const bots = await botRepository.getBots(req.query)

  // Updating status for all bots.
  for (const bot of bots) {
    const status = await botManager.getBotStatus(bot.ckey);
    bot.status = status;
  }

  res.status(200).json({ message: 'Bots retrieved successfully!', bots: bots })
}))

// Update Bot
router.put('/bot/:ckey', jwtAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const ckey = req.params.ckey
  await botRepository.updateBot(ckey, req.body)
  res.status(200).json({ message: 'Bot updated successfully!', bot: { ckey, ...req.body } })
}))

// Delete Bot
router.delete('/bot/:ckey', jwtAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const ckey = req.params.ckey
  const bot = await botRepository.getBot(ckey)
  await botRepository.deleteBot(ckey)
  res.status(200).json({ message: 'Bot deleted successfully!', bot })
}))

export default router
