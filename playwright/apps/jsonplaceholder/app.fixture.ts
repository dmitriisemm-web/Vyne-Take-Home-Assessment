import type { APIRequestContext } from '@playwright/test';
import { test as base } from '@playwright/test';
import { PostsClient } from './clients/posts.client';
import { AlbumsClient } from './clients/albums.client';
import { UsersClient } from './clients/users.client';
import { ResourceClient } from './clients/resource.client';
import { ROUTES } from './constants';

/**
 * Single entry point into every JSONPlaceholder API client. Tests pull in
 * the `jsonplaceholderApp` fixture and reach any resource from it, instead
 * of importing and constructing each client individually.
 */
export class JsonplaceholderApp {
  readonly postsClient: PostsClient;
  readonly commentsClient: ResourceClient;
  readonly albumsClient: AlbumsClient;
  readonly photosClient: ResourceClient;
  readonly todosClient: ResourceClient;
  readonly usersClient: UsersClient;

  /** Raw request context, for one-off calls that don't fit an existing resource client (e.g. an unknown route). */
  constructor(readonly request: APIRequestContext) {
    this.postsClient = new PostsClient(request);
    this.commentsClient = new ResourceClient(request, ROUTES.COMMENTS);
    this.albumsClient = new AlbumsClient(request);
    this.photosClient = new ResourceClient(request, ROUTES.PHOTOS);
    this.todosClient = new ResourceClient(request, ROUTES.TODOS);
    this.usersClient = new UsersClient(request);
  }
}

type JsonplaceholderAppFixtures = {
  jsonplaceholderApp: JsonplaceholderApp;
};

export const test = base.extend<JsonplaceholderAppFixtures>({
  jsonplaceholderApp: async ({ request }, use) => {
    await use(new JsonplaceholderApp(request));
  }
});

export { expect } from '@playwright/test';
