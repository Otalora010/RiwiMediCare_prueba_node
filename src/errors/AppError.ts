export class AppError extends Error {
  // Creates a custom application error with a status code, error code, and optional details.
  constructor(
    public readonly statusCode: number,
    // Error message describing what went wrong.
    message: string,
    // Identifies the type of application error.
    public readonly code = 'APP_ERROR',
    // Optional additional information about the error.
    public readonly details?: unknown,
  ) {
    // Call the parent Error constructor with the provided message.
    super(message);
    // Set the error name to identify this custom error class.
    this.name = 'AppError';
    // Ensure the correct prototype is maintained for the custom error class.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}