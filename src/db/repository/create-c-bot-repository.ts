import { SqliteCBotRepository } from './sqlite-c-bot-repository.js'
import { PostgresCBotRepository } from './postgres-c-bot-repository.js'
import { ICBotRepository } from './c-bot-repository.interface.js'
import { getEnvVar } from '../../utils/utils.js'

/**
 * Factory function to create a `CBotRepository` based on the configured database dialect.
 *
 * This function reads the `DB_DIALECT` environment variable to determine which
 * implementation of the `ICBotRepository` to return. If the `DB_DIALECT` is not set,
 * it defaults to using the SQLite implementation.
 *
 * ### Adding a New Database
 * 1. Create a new implementation of the `ICBotRepository` interface for the desired database.
 * 2. Add a new `case` in the `switch` statement for the new database dialect.
 *
 * @returns {ICBotRepository} An instance of the appropriate `CBotRepository` implementation.
 */
export function createCBotRepository(): ICBotRepository {
  const dbDialect = getEnvVar('DB_DIALECT')?.toLowerCase() || 'sqlite';

  switch (dbDialect) {
    case 'postgres':
      return new PostgresCBotRepository();

    case 'sqlite':
    default:
      return new SqliteCBotRepository();
  }
}
