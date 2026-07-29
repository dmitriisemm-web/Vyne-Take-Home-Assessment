import type { APIRequestContext, APIResponse } from '@playwright/test';
import { ResourceClient } from './resource.client';
import { ROUTES } from '../constants';

export class UsersClient extends ResourceClient {
  constructor(request: APIRequestContext) {
    super(request, ROUTES.USERS);
  }

  async getTodos(userId: number | string): Promise<APIResponse> {
    return this.getNested(userId, 'todos');
  }
}
