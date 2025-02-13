import 'dotenv/config'

/**
 * Retrieves an environment variable or default.
 * Logs a warning if the variable is not set.
 *
 * @param name The environment variable name.
 * @param defaultValue The default value to use.
 * @returns The environment variable value or the default.
 */
function getEnvVar(name: string, defaultValue: string): string {
  const value = process.env[name];

  if (value !== undefined) return value;

  console.warn(`Environment variable '${name}' is not set. Defaulting to '${defaultValue}'.`);
  return defaultValue;
}

const config = {
  /** Environment mode (development, production, staging) */
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),

  /** USER for codyfight configuration (developer, user) */
  USER: getEnvVar('USER', 'user'),

  /** URL for production environment where requests will be sent */
  PROD_API_URL: getEnvVar('PROD_API_URL', 'https://game.codyfight.com'),

  /** URL for development environment where requests will be sent */
  DEV_API_URL: getEnvVar('DEV_API_URL', 'https://game-dev.codyfight.com'),

  /** Logging level (0=debug, 1=info, 2=warning, 3=error) */
  LOG_LEVEL: Number(getEnvVar('LOG_LEVEL', '1')),

  /** API secret key for JWT authentication */
  API_SECRET: getEnvVar('API_SECRET', 'development'),

  /** Port for running the Express API */
  SERVER_PORT: Number(getEnvVar('SERVER_PORT', '3000')),

  /** Database dialect (e.g., mysql, postgresql, sqlite) */
  DB_DIALECT: getEnvVar('DB_DIALECT', 'sqlite'),

  /** PostgreSQL connection URL */
  POSTGRES_URL: getEnvVar('POSTGRES_URL', 'postgresql://postgres:password@localhost:5432/codyfight_bots'),

  /** SQLite database file path */
  SQLITE_DB_PATH: getEnvVar('SQLITE_DB_PATH', './src/db/bots.db'),

  /** MySQL database configuration */
  MYSQL: {
    HOST: getEnvVar('MYSQL_HOST', '127.0.0.1'),
    USER: getEnvVar('MYSQL_USER', 'root'),
    PASSWORD: getEnvVar('MYSQL_PASSWORD', 'root'),
    DB: getEnvVar('MYSQL_DB', 'codyfight'),
    CONNECTION_LIMIT: Number(getEnvVar('MYSQL_CONN_LIMIT', '10')),
  },
};

export default config;
