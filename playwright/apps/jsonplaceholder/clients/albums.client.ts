import type { APIRequestContext, APIResponse } from '@playwright/test';
import { ResourceClient } from './resource.client';
import { ROUTES } from '../constants';

export class AlbumsClient extends ResourceClient {
  constructor(request: APIRequestContext) {
    super(request, ROUTES.ALBUMS);
  }

  async getPhotos(albumId: number | string): Promise<APIResponse> {
    return this.getNested(albumId, 'photos');
  }
}
