import { GameStatus } from '../types/game/state.type.js'
import { getGameStatusName } from './utils.js'

class Logger {
  private readonly loggingEnabled: boolean;
  private runCount = 0;
  private lastRunTime: number | null = null;

  constructor(loggingEnabled = false) {
    this.loggingEnabled = loggingEnabled;
  }

  startRun(ckey: string): void {
    const currentTime = Date.now();
    const timeBetweenTurns = this.lastRunTime !== null ? currentTime - this.lastRunTime : 0;
    this.lastRunTime = currentTime;
    this.runCount++;

    this.logInfo(`ckey: ${ckey}, Run Count: ${this.runCount}, Time Between Turns: ${timeBetweenTurns}ms`);
  }

  logGameStatus(ckey: string, status: GameStatus, action: string): void {
    const statusName = getGameStatusName(status);
    this.logDebug(`ckey: ${ckey}: ${statusName} -> ${action}`);
  }

  logDebug(message: string): void {
    if (this.loggingEnabled) {
      console.debug(message);
    }
  }

  logInfo(message: string): void {
    if (this.loggingEnabled) {
      console.info(message);
    }
  }

  logError(message: string): void {
    console.error(message);
  }
}

export default Logger
