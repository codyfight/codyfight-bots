import { Request, Response, Router } from 'express'
import { gameModeOptions } from '../../game/state/game-state.type.js'
import { moveStrategyOptions } from '../../c-bots/strategies/move/move-strategy.type.js'
import { castStrategyOptions } from '../../c-bots/strategies/cast/cast-strategy.type.js'


const router = Router()

// Get options for dropdowns
router.get('/bots/options', (_req: Request, res: Response) => {
  res.json({ gameModeOptions, moveStrategyOptions, castStrategyOptions })
})

export default router
