import { Request, Response, Router } from 'express'
import { createCBotRepository } from '../../db/repository/create-c-bot-repository.js'
import { authenticate } from './authentication.js'
import { asyncHandler } from '../../utils/utils.js'

const router = Router();
const botRepository = createCBotRepository();

// Create Bot
router.post('/bot', authenticate, asyncHandler(async (req: Request, res: Response) => {
  await botRepository.addBot(req.body);
  res.status(201).json({ message: 'Bot added successfully!', bot: req.body });
}));

// Get Bot
router.get('/bot/:ckey', asyncHandler(async (req: Request, res: Response) => {
  const bot = await botRepository.getBot(req.params.ckey);
  res.status(200).json({ message: 'Bot retrieved successfully!', bot });
}));

// Get All Bots
router.get('/bots',
  asyncHandler(async (req: Request, res: Response) => {

    /*
     TODO - Rather than just getting player id here and passing it
      Treat the request params as an array of filters
      Then the implementation of the DB can handle it */

    const player_id = parseInt(req.query.player_id as string);

    if (!player_id) {
      res.status(400).json({ message: "player_id is required" });
    }

    const bots = await botRepository.getBots(player_id)

    res.status(200).json({
      message: 'Bots retrieved successfully!',
      bots: bots
    })
  })
)

// Update Bot
router.put('/bot/:ckey', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const ckey = req.params.ckey;
  await botRepository.updateBot(ckey, req.body);
  res.status(200).json({ message: 'Bot updated successfully!', bot: { ckey, ...req.body } });
}));

// Delete Bot
router.delete('/bot/:ckey', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const ckey = req.params.ckey;
  const bot = await botRepository.getBot(ckey);
  await botRepository.deleteBot(ckey);
  res.status(200).json({ message: 'Bot deleted successfully!', bot });
}));

export default router;
