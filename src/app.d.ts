// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env?: {
        CALENDAR_CACHE?: { get(key: string): Promise<string | null> };
      };
    }
  }
}

export {};
