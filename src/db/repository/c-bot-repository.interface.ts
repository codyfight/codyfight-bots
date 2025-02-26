import { BotStatus, ICBotConfig } from '../../c-bots/c-bot/c-bot-config.interface.js'
import { MoveStrategyType } from '../../c-bots/strategies/move/move-strategy.type.js'
import { CastStrategyType } from '../../c-bots/strategies/cast/cast-strategy.type.js'
import { GameMode } from '../../game/state/game-state.type.js'

export interface IBotFilter {
  player_id?: string,
  mode?: GameMode,
  environment?: "development" | "production",
  move_strategy?: MoveStrategyType,
  cast_strategy?: CastStrategyType,
  status?: BotStatus
}

export interface IBotFilterCondition {
  field: keyof IBotFilter;
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=';
  value: any;
}

export interface ICBotRepository {
  addBot(bot: ICBotConfig): Promise<void>
  getBot(ckey: string): Promise<ICBotConfig>
  getBots(filter: IBotFilterCondition[]): Promise<ICBotConfig[]>
  updateBot(ckey: string, params: IBotFilter): Promise<void>
  deleteBot(ckey: string): Promise<void>
}
