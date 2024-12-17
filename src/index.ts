import 'dotenv/config'

import CBot from './bots/cbot/CBot.js'
import { CBotFactory } from './bots/cbot/CBotFactory.js'

const cbots = CBotFactory.createAllBots()

cbots.forEach((cbot: CBot) => {
  try {
    cbot.run()
  } catch (error) {
    console.error(`Bot (${cbot.ckey}) failed with error: `, error)
  }
})
