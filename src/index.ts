import CBot from './bots/CBot.js'
import { CBotFactory } from './bots/factories/CBotFactory.js'

const cbots = CBotFactory.createAllBots()

cbots.forEach((cbot: CBot) => {
  try {
    cbot.run()
  } catch (error) {
    console.error(`Bot (${cbot.ckey}) failed with error: `, error)
  }
})
