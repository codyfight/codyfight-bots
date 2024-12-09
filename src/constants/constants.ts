import dotenv from 'dotenv'

dotenv.config()

function getEnvVariable(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`${key} is not set. Please define it in the .env file.`)
  }

  return value
}

export const GAME_API_URL = getEnvVariable('GAME_URL')
