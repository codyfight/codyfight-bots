import { SqliteCBotRepository } from './sqlite-c-bot-repository.js'
import { PostgresCBotRepository } from './postgres-c-bot-repository.js'
import { ICBotRepository } from './c-bot-repository.interface.js'
import MysqlCBotRepository from './mysql-c-bot-repository.js'
import config from '../../config/env.js'

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
  const dbDialect = config.DB_DIALECT

  switch (dbDialect) {
    case 'postgresql':
      return new PostgresCBotRepository();

    case 'sqlite':
      return new SqliteCBotRepository();

    case 'mysql':
      return new MysqlCBotRepository();

    default:
      throw new Error(`DB Dialect ${dbDialect} not supported.`)
  }
}
