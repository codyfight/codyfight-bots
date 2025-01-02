import { NextFunction, Request, Response, Router } from 'express'
import { gameModeOptions } from '../game/state/game-state.type.js'
import { moveStrategyOptions } from '../bots/strategies/move/move-strategy.type.js'
import { castStrategyOptions } from '../bots/strategies/cast/cast-strategy.type.js'
import { createBotRepository } from './db/repository/index.js'

const router = Router()
const botRepository = createBotRepository()

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

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
