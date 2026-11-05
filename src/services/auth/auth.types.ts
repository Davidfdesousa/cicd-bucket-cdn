export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
}

export interface AuthError {
  code: string;
  message: string;
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'unconfigured'; missingKeys: string[] }
  | { status: 'signed-out'; error?: AuthError }
  | { status: 'signed-in'; user: AuthUser };

export type AuthStatus = AuthState['status'];

export type AuthListener = (state: AuthState) => void;

export interface AuthService {
  getState: () => AuthState;
  subscribe: (listener: AuthListener) => () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
