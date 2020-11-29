import { Handlers } from '@/types';

declare global {
  interface Window {
    handlers: Handlers;
  }
}
