import StrategyManager from '../strategies/StrategyManager.js'

class StrategyManagerFactory {
  private static strategyManager?: StrategyManager

  public static get(): StrategyManager {
    if (!this.strategyManager) {
      this.strategyManager = new StrategyManager() as StrategyManager
    }

    return this.strategyManager
  }
}

export default StrategyManagerFactory
