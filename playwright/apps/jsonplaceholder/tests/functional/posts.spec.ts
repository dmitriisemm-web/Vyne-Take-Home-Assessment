import { test, expect } from '../../app.fixture';
import { getJson } from '../../utils';
import { RESOURCE_COUNTS, VALID_ID, VALID_POST_PAYLOAD, CREATED_RESOURCE_ID } from '../../constants';
import { TAGS } from '../../../../common/constants';
import type { Post } from '../../types';

test.describe('Check Posts endpoint functionalities', () => {
  test('Verify GET /posts returns all posts', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ jsonplaceholderApp }) => {
    const response = await test.step('Request all posts', async () => {
      return jsonplaceholderApp.postsClient.getAll();
    });

    await test.step('Verify the response is a 200 with the full collection', async () => {
      expect(response.status()).toBe(200);
      const posts = await getJson<Post[]>(response);
      expect(posts).toHaveLength(RESOURCE_COUNTS.POSTS);
    });
  });

  test('Verify GET /posts/:id returns the correct post shape', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ jsonplaceholderApp }) => {
    const response = await test.step('Request a single post', async () => {
      return jsonplaceholderApp.postsClient.getById(VALID_ID);
    });

    await test.step('Verify the response shape', async () => {
      expect(response.status()).toBe(200);
      const post = await getJson<Post>(response);
      expect(post).toMatchObject({
        id: VALID_ID,
        userId: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String)
      });
    });
  });

  test('Verify POST /posts creates a post with the expected fields', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ jsonplaceholderApp }) => {
    const response = await test.step('Create a post', async () => {
      return jsonplaceholderApp.postsClient.create(VALID_POST_PAYLOAD);
    });

    await test.step('Verify the response echoes the payload and assigns an id', async () => {
      expect(response.status()).toBe(201);
      const created = await getJson<Post>(response);
      expect(created).toMatchObject({ ...VALID_POST_PAYLOAD, id: CREATED_RESOURCE_ID });
    });
  });

  test('Verify PUT /posts/:id fully replaces the post', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ jsonplaceholderApp }) => {
    const replacement = { id: VALID_ID, title: 'updated title', body: 'updated body', userId: 1 };

    const response = await test.step('Replace the post', async () => {
      return jsonplaceholderApp.postsClient.update(VALID_ID, replacement);
    });

    await test.step('Verify the response is the full replacement body', async () => {
      expect(response.status()).toBe(200);
      const updated = await getJson<Post>(response);
      expect(updated).toEqual(replacement);
    });
  });

  test('Verify DELETE /posts/:id succeeds', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ jsonplaceholderApp }) => {
    const response = await test.step('Delete the post', async () => {
      return jsonplaceholderApp.postsClient.delete(VALID_ID);
    });

    await test.step('Verify the response is a 200', async () => {
      expect(response.status()).toBe(200);
    });
  });

  test(
    'Verify PATCH /posts/:id partially updates the post, preserving other fields',
    { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] },
    async ({ jsonplaceholderApp }) => {
      const original = await test.step('Read the original post', async () => {
        const response = await jsonplaceholderApp.postsClient.getById(VALID_ID);
        return getJson<Post>(response);
      });

      const response = await test.step('Patch only the title', async () => {
        return jsonplaceholderApp.postsClient.patch(VALID_ID, { title: 'patched title' });
      });

      await test.step('Verify the title changed but other fields are untouched', async () => {
        expect(response.status()).toBe(200);
        const patched = await getJson<Post>(response);
        expect(patched).toEqual({ ...original, title: 'patched title' });
      });
    }
  );

  test('Verify GET /posts?userId= filters posts by user', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ jsonplaceholderApp }) => {
    const response = await test.step('Request posts filtered by userId', async () => {
      return jsonplaceholderApp.postsClient.getAll({ userId: VALID_ID });
    });

    await test.step('Verify every returned post belongs to that user', async () => {
      expect(response.status()).toBe(200);
      const posts = await getJson<Post[]>(response);
      expect(posts.length).toBeGreaterThan(0);
      for (const post of posts) {
        expect(post.userId).toBe(VALID_ID);
      }
    });
  });

  test('Verify GET /posts?userId= with no matches returns an empty array', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ jsonplaceholderApp }) => {
    const response = await test.step('Request posts for a userId that owns none', async () => {
      return jsonplaceholderApp.postsClient.getAll({ userId: 9999 });
    });

    await test.step('Verify an empty array is returned with a 200', async () => {
      expect(response.status()).toBe(200);
      const posts = await getJson<Post[]>(response);
      expect(posts).toEqual([]);
    });
  });

  test(
    'Verify pagination with _page and _limit returns the correct slice',
    { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] },
    async ({ jsonplaceholderApp }) => {
      const response = await test.step('Request page 2 with a limit of 10', async () => {
        return jsonplaceholderApp.postsClient.getAll({ _page: 2, _limit: 10 });
      });

      await test.step('Verify 10 posts are returned starting at id 11', async () => {
        expect(response.status()).toBe(200);
        const posts = await getJson<Post[]>(response);
        expect(posts).toHaveLength(10);
        expect(posts[0].id).toBe(11);
      });
    }
  );

  test(
    'Verify sorting with _sort and _order returns posts in the requested order',
    { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] },
    async ({ jsonplaceholderApp }) => {
      const response = await test.step('Request posts sorted by id descending', async () => {
        return jsonplaceholderApp.postsClient.getAll({ _sort: 'id', _order: 'desc', _limit: 3 });
      });

      await test.step('Verify the ids are in descending order', async () => {
        expect(response.status()).toBe(200);
        const posts = await getJson<Post[]>(response);
        expect(posts.map(post => post.id)).toEqual([100, 99, 98]);
      });
    }
  );

  test('Verify GET /posts responses include a JSON content-type header', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ jsonplaceholderApp }) => {
    const response = await test.step('Request all posts', async () => {
      return jsonplaceholderApp.postsClient.getAll();
    });

    await test.step('Verify the content-type header', async () => {
      expect(response.headers()['content-type']).toContain('application/json');
    });
  });
});
