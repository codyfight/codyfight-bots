import { Request, Response, Router } from 'express'
import { moveStrategyOptions } from '../../c-bots/strategies/move/move-strategy.type.js'
import { castStrategyOptions } from '../../c-bots/strategies/cast/cast-strategy.type.js'
import { getFilteredGameModes } from '../../game/state/game-state.type.js'


const router = Router()

// Get options for dropdowns
router.get('/bots/options', (req: Request, res: Response) => {
  // Retrieve the user from query parameters (e.g., ?user=dev)
  // or from req.params depending on your routing setup
  const { user } = req.query;
  const isDev = user === 'dev';

  // Filter game modes based on user
  const gameModeOptions = getFilteredGameModes(isDev);

  res.json({
    gameModeOptions,
    moveStrategyOptions,
    castStrategyOptions
  });
});

export default router
