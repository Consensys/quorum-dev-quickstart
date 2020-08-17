
export class AuthorizationError extends Error {
  private _authFailureReason: string;

  constructor(message: string, authFailureReason: string) {
    super(message);
    this._authFailureReason = authFailureReason;
  }

  get authFailureReason(): string {
    return this._authFailureReason;
  }
}