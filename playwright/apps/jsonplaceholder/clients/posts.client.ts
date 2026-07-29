import type { APIRequestContext, APIResponse } from '@playwright/test';
import { ResourceClient } from './resource.client';
import { ROUTES } from '../constants';

export class PostsClient extends ResourceClient {
  constructor(request: APIRequestContext) {
    super(request, ROUTES.POSTS);
  }

  async getComments(postId: number | string): Promise<APIResponse> {
    return this.getNested(postId, 'comments');
  }
}
