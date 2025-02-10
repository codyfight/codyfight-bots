import config from '../config/env.js'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private static level: LogLevel = config.LOG_LEVEL

  public static setLogLevel(level: LogLevel): void {
    Logger.level = level
  }

  public static debug(message: string): void {
    if (Logger.level > LogLevel.DEBUG) {
      return
    }

    console.debug(Logger.format('[DEBUG] ' + message))
  }

  public static info(message: string): void {
    if (Logger.level > LogLevel.INFO) {
      return
    }

    console.info(Logger.format('[INFO] ' + message))
  }

  public static warn(message: string): void {
    if (Logger.level > LogLevel.WARN) {
      return
    }

    console.warn(Logger.format('[WARN] ' + message))
  }

  public static error(message: string, error: any): void {
    if (Logger.level > LogLevel.ERROR) {
      return
    }

    console.error(Logger.format('[ERROR] ' + message))
    console.error(Logger.formatError(error))
  }

  private static format(message: string): string {
    const now = new Date()
    return `${now.toISOString()}: ${message}`
  }

  private static formatError(error: any): string {
    return error?.toString() ?? 'Unknown error'
  }

}

export default Logger
