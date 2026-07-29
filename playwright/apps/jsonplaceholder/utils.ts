import type { APIResponse } from '@playwright/test';

export async function getJson<T>(response: APIResponse): Promise<T> {
  return response.json() as Promise<T>;
}
