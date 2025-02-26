import axios, { AxiosError } from 'axios'

class GameError extends Error {
  public readonly error: unknown
  private readonly context: Record<string, unknown>

  constructor(error: unknown, context: Record<string, unknown> = {}) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    super(message)

    this.name = 'GameError'
    this.error = error
    this.context = { ...context }
    this.stack = error instanceof Error && error.stack ? error.stack : 'N/A'
  }

  /**
   * Add a single key-value pair to the existing context.
   */
  public addToContext(key: string, value: unknown): void {
    this.context[key] = value
  }

  /**
   * Merge a new context object into the existing context.
   * This will overwrite the values of any existing keys.
   */
  public setContext(newContext: Record<string, unknown>): void {
    Object.assign(this.context, newContext)
  }

  /**
   * Return the entire context object.
   */
  public getContext(): Record<string, unknown> {
    return this.context
  }

  public toString(): string {
    let result = this.formatGameError()

    if (axios.isAxiosError(this.error)) {
      result += this.formatAxiosError(this.error)
    }

    return result
  }

  public getErrorCode(): string {
    const isError = this.error instanceof Error
    const hasCode = isError && (this.error as any).code !== undefined

    return hasCode ? String((this.error as any).code) : 'N/A'
  }

  private formatGameError(): string {
    return `
    --------------------------
    ERROR: ${this.name}
    MESSAGE: ${this.message}
    CODE: ${this.getErrorCode()}
    --------------------------
    CONTEXT: ${JSON.stringify(this.context, null, 2)}
    --------------------------\n`
  }

  private formatAxiosError(error: AxiosError): string {
    const responseData = (error.response?.data ?? {}) as {
      code?: string
      message?: string
      context?: unknown
    }

    return `
    --------------------------
    ERROR: ${error.name}
    STATUS: ${error.response?.status ?? 'N/A'}
    CODE: ${error.code ?? 'N/A'}
    MESSAGE: ${error.message}
    --------------------------
    URL: ${error.config?.url ?? 'N/A'}
    DATA: ${JSON.stringify(error.config?.data ?? {}, null, 2)}
    --------------------------
    RESPONSE_CODE: ${responseData.code ?? 'N/A'}
    RESPONSE_MESSAGE: ${responseData.message ?? 'N/A'}
    RESPONSE_CONTEXT: ${JSON.stringify(responseData.context ?? {}, null, 2)}
    --------------------------\n
    `
  }
}

export default GameError
