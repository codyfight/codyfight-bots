import CBot from '../bots/cbot/CBot.js'
import { CBotFactory } from '../bots/cbot/CBotFactory.js'

try {
  const cbots: CBot[] = await CBotFactory.createAllBots()

  cbots.forEach((cbot: CBot) => {
    try {
      cbot.run()
    } catch (error) {
      console.error(`Bot (${cbot.ckey}) failed with error:`, error)
    }
  })
} catch (error) {
  console.error('Error while creating bots:', error)
}
