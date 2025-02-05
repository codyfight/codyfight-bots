import { Request, Response, Router } from 'express'
import { gameModeOptions } from '../game/state/game-state.type.js'
import { moveStrategyOptions } from '../c-bots/strategies/move/move-strategy.type.js'
import { castStrategyOptions } from '../c-bots/strategies/cast/cast-strategy.type.js'
import { createCBotRepository } from '../db/repository/create-c-bot-repository.js'
import { asyncHandler, getEnvVar } from '../utils/utils.js'
import Logger from '../utils/logger.js'
import botManager from '../c-bots/c-bot-manager.js'
import { authenticate } from './authentication.js'

Logger.setLogLevel(+getEnvVar('LOG_LEVEL'))

const router = Router()
const botRepository = createCBotRepository()

// <editor-fold desc="Database Operations (CRUD)">

// Create Bot
router.post('/bot',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {

    await botRepository.addBot(req.body)

    res.status(201).json({
      message: 'Bot added successfully!',
      bot: req.body
    })
  })
)

// Get Bot
router.get('/bot/:ckey',
  asyncHandler(async (req: Request, res: Response) => {
    const bot = await botRepository.getBot(req.params.ckey);

    res.status(200).json({
      message: 'Bot retrieved successfully!',
      bot: bot
    });
  })
);


// Get All Bots
router.get('/bots',
  asyncHandler(async (req: Request, res: Response) => {

    const user_id = parseInt(req.query.user_id as string);
    if (!user_id) {
      res.status(400).json({ message: "user_id is required" });
    }

    const bots = await botRepository.getBots(user_id)

    res.status(200).json({
      message: 'Bots retrieved successfully!',
      bots: bots
    })
  })
)

// Update Bot
router.put('/bot/:ckey',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {

    const ckey = req.params.ckey
    await botRepository.updateBot(ckey, req.body)

    res.status(200).json({
      message: 'Bot updated successfully!',
      bot: { ckey, ...req.body }
    })
  })
)

// Delete Bot
router.delete('/bot/:ckey',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {

    const ckey = req.params.ckey
    const bot = await botRepository.getBot(ckey)
    await botRepository.deleteBot(ckey)

    res.status(200).json({
      message: 'Bot deleted successfully!',
      bot
    })
  })
)


// </editor-fold>

// <editor-fold desc="Bot Control">

// Run a bot
router.post('/bot/:ckey/run',
  asyncHandler(async (req: Request, res: Response) => {

    const { ckey } = req.params
    await botManager.startBot(ckey)
    const { status } = await botManager.getBotStatus(ckey);

    res.status(200).json({
      message: 'Bot started successfully!',
      status: status
    })
  })
)

// Stop a bot
router.post('/bot/:ckey/stop',
  asyncHandler(async (req: Request, res: Response) => {

    const { ckey } = req.params
    botManager.stopBot(ckey)

    const { status } = await botManager.getBotStatus(ckey);

    res.status(200).json({
      message: 'Bot stopped successfully!',
      status: status
    })
  })
)

// Get bot status
router.get(
  '/bot/:ckey/status',
  asyncHandler(async (req: Request, res: Response) => {

    const { status, active } = await botManager.getBotStatus(req.params.ckey);
    const message = active ? 'Bot is running.' : 'Bot is stopped.';

    res.status(200).json({
      message,
      status
    });
  })
);

// </editor-fold>

// <editor-fold desc="Utility Routes">

// Get options for dropdowns

router.get('/bots/options', (_req: Request, res: Response) => {
  res.json({ gameModeOptions, moveStrategyOptions, castStrategyOptions });
});

// </editor-fold>

export default router
