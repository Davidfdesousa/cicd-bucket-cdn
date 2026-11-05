import { createFirebaseAuthService } from './firebase-auth.service.ts';
import type { AuthService } from './auth.types.ts';

export type * from './auth.types.ts';
export { toAuthError } from './auth-errors.ts';

let instance: AuthService | undefined;

/** Lazily creates the app-wide auth service (one Firebase app per page). */
export function getAuthService(): AuthService {
  instance ??= createFirebaseAuthService();
  return instance;
}
