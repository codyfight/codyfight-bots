import { SqliteCBotRepository } from './sqlite-c-bot-repository.js'
import { PostgresCBotRepository } from './postgres-c-bot-repository.js'
import { ICBotRepository } from './c-bot-repository.interface.js'
import { getEnvVar } from '../../../utils/utils.js'

export function createCBotRepository(): ICBotRepository {
  const dbDialect = getEnvVar('DB_DIALECT')?.toLowerCase() || 'sqlite'

  if (dbDialect === 'postgres') {
    return new PostgresCBotRepository()
  }

  return new SqliteCBotRepository()
}
