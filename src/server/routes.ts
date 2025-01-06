import { Request, Response, Router } from 'express'
import { gameModeOptions } from '../game/state/game-state.type.js'
import { moveStrategyOptions } from '../c-bots/strategies/move/move-strategy.type.js'
import { castStrategyOptions } from '../c-bots/strategies/cast/cast-strategy.type.js'
import { createCBotRepository } from './db/repository/create-c-bot-repository.js'
import { asyncHandler } from '../utils/utils.js'

const router = Router()
const botRepository = createCBotRepository()

router.get('/dropdown-options', (req, res) => {
  res.json({ gameModeOptions, moveStrategyOptions, castStrategyOptions })
})

router.delete(
  '/bots/:ckey',
  asyncHandler(async (req: Request, res: Response) => {
    await botRepository.deleteBot(req.params.ckey)
    res.status(200).send('Bot deleted successfully')
  })
)

router.get(
  '/bots',
  asyncHandler(async (req: Request, res: Response) => {
    const bots = await botRepository.getAllBots()
    res.json(bots)
  })
)

router.post(
  '/bots',
  asyncHandler(async (req: Request, res: Response) => {
    await botRepository.addBot(req.body)
    res.status(201).send('Bot added successfully')
  })
)

export default router
