import type { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiBase } from '../../../common/api-base';

/**
 * Generic CRUD + nested-relation client for a single json-server-style
 * resource. Every JSONPlaceholder resource (posts, comments, albums,
 * photos, todos, users) speaks this same shape, so resource-specific
 * clients (see posts.client.ts, albums.client.ts, users.client.ts) extend
 * this instead of re-implementing get/create/update/delete themselves.
 */
export class ResourceClient extends ApiBase {
  constructor(
    request: APIRequestContext,
    protected readonly resourcePath: string
  ) {
    super(request);
  }

  async getAll(params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(this.resourcePath, { params });
  }

  async getById(id: number | string): Promise<APIResponse> {
    return this.request.get(`${this.resourcePath}/${id}`);
  }

  async create(data: unknown): Promise<APIResponse> {
    return this.request.post(this.resourcePath, { data });
  }

  async update(id: number | string, data: unknown): Promise<APIResponse> {
    return this.request.put(`${this.resourcePath}/${id}`, { data });
  }

  async patch(id: number | string, data: unknown): Promise<APIResponse> {
    return this.request.patch(`${this.resourcePath}/${id}`, { data });
  }

  async delete(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${this.resourcePath}/${id}`);
  }

  protected async getNested(id: number | string, nestedResource: string): Promise<APIResponse> {
    return this.request.get(`${this.resourcePath}/${id}/${nestedResource}`);
  }
}
