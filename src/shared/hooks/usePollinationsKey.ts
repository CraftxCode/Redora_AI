import { useSyncExternalStore } from 'react';
import { getPollinationsKey, subscribePollinationsKey } from '@/services/pollinationsKey';

/** True while a user-supplied Pollinations key is saved in this browser. */
export function useHasPollinationsKey(): boolean {
  return useSyncExternalStore(subscribePollinationsKey, () => getPollinationsKey() !== null, () => false);
}
