import CBot from '../CBot.js'
import { getEnvVar } from '../../utils/utils.js'
import { CBotConfig } from '../../types/game/index.js'


export class CBotFactory {
  static createAllBots(): CBot[] {
    const BOTS_CONFIG = JSON.parse(getEnvVar('BOTS_CONFIG'))

    return BOTS_CONFIG.map((config: CBotConfig) => {
      const botConfig: CBotConfig = {
        ckey: this.loadConfigParam(config, 'ckey'),
        mode: this.loadConfigParam(config, 'mode'),
        url: this.loadConfigParam(config, 'url'),
        logging: this.loadConfigParam(config, 'logging'),
        move_strategy: this.loadConfigParam(config, 'move_strategy')
      }

      return new CBot(botConfig)
    })
  }

  private static loadConfigParam(config: any, key: string): any {
    if (config[key] === undefined || config[key] === null) {
      const errorMessage = `Missing required configuration parameter: ${key}`
      console.error(`[ERROR]: ${errorMessage}`)
      throw new Error(errorMessage)
    }
    return config[key]
  }
}
