import type { APIRequestContext } from '@playwright/test';

/**
 * Shared base for every API client. Mirrors common/base.ts (the Page-based
 * Base for UI apps) but wraps an APIRequestContext instead - API test
 * clients drive requests directly, they never touch a Page.
 */
export class ApiBase {
  constructor(protected readonly request: APIRequestContext) {}
}
