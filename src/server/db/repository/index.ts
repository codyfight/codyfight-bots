import { SqliteBotRepository } from './SqliteBotRepository.js'
import { PostgresBotRepository } from './PostgresBotRepository.js'
import { IBotRepository } from './IBotRepository.js'
import { getEnvVar } from '../../../utils/utils.js'

export function createBotRepository(): IBotRepository {
  const dbDialect = getEnvVar('DB_DIALECT')?.toLowerCase() || 'sqlite'

  if (dbDialect === 'postgres') {
    return new PostgresBotRepository()
  }
  
  return new SqliteBotRepository()
}
