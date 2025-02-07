class ApiError extends Error {
  public readonly status: number;
  public readonly details?: any;

  constructor(message: string, status = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public static from(err: unknown, message = 'An unknown error occurred', status = 500 ): ApiError {

    if (err instanceof ApiError) {
      return err;
    }

    return new ApiError(message, status, err);
  }
}

export default ApiError;
