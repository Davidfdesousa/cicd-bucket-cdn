import type { FirebaseOptions } from 'firebase/app';

type FirebaseEnv = Pick<
  ImportMetaEnv,
  'VITE_FIREBASE_API_KEY' | 'VITE_FIREBASE_AUTH_DOMAIN' | 'VITE_FIREBASE_PROJECT_ID' | 'VITE_FIREBASE_APP_ID'
>;

export type FirebaseConfigResult =
  | { status: 'configured'; options: FirebaseOptions }
  | { status: 'missing'; missingKeys: (keyof FirebaseEnv)[] };

const requiredKeys: (keyof FirebaseEnv)[] = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

/**
 * Reads the Firebase options from the Vite environment.
 * Returns the list of missing keys instead of throwing, so the UI can
 * explain what is left to configure.
 */
export function resolveFirebaseConfig(env: FirebaseEnv = import.meta.env): FirebaseConfigResult {
  const missingKeys = requiredKeys.filter((key) => !env[key]?.trim());

  if (missingKeys.length > 0) {
    return { status: 'missing', missingKeys };
  }

  return {
    status: 'configured',
    options: {
      apiKey: env.VITE_FIREBASE_API_KEY!,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN!,
      projectId: env.VITE_FIREBASE_PROJECT_ID!,
      appId: env.VITE_FIREBASE_APP_ID!,
    },
  };
}
