import { test, expect } from '../../app.fixture';
import { getJson } from '../../utils';
import { NONEXISTENT_ID, MALFORMED_ID } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Check API error handling', () => {
  test('Verify GET /posts/:id for a nonexistent post returns 404', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    const response = await test.step('Request a nonexistent post', async () => {
      return app.postsClient.getById(NONEXISTENT_ID);
    });

    await test.step('Verify a 404 is returned', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('Verify GET /posts/:id with a malformed id returns 404, not 400', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request a post with a non-numeric id', async () => {
      return app.postsClient.getById(MALFORMED_ID);
    });

    await test.step('Verify a 404 is returned', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('Verify GET on an unknown resource returns 404', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request an unknown top-level resource', async () => {
      return app.request.get('/nonexistent-resource');
    });

    await test.step('Verify a 404 is returned', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('Verify POST /posts with an empty body still succeeds with 201', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Create a post with no fields', async () => {
      return app.postsClient.create({});
    });

    await test.step('Verify the API accepts it anyway (no server-side validation)', async () => {
      expect(response.status()).toBe(201);
      const created = await getJson<{ id: number }>(response);
      expect(created.id).toBeDefined();
    });
  });

  test('Check PUT /posts/:id for a nonexistent post crashes with a 500', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Attempt to replace a nonexistent post', async () => {
      return app.postsClient.update(NONEXISTENT_ID, { title: 'x' });
    });

    await test.step('Verify the API crashes with a 500 (known bug - json-server throws on PUT to a missing id)', async () => {
      expect(response.status()).toBe(500);
    });
  });

  test('Check PATCH /posts/:id for a nonexistent post returns 200, unlike PUT', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Attempt to patch a nonexistent post', async () => {
      return app.postsClient.patch(NONEXISTENT_ID, { title: 'x' });
    });

    await test.step('Verify PATCH succeeds and echoes only the submitted fields, unlike PUT', async () => {
      expect(response.status()).toBe(200);
      const body = await getJson<{ title: string }>(response);
      expect(body).toEqual({ title: 'x' });
    });
  });

  test('Verify DELETE /posts/:id for a nonexistent post is idempotent', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Delete a nonexistent post', async () => {
      return app.postsClient.delete(NONEXISTENT_ID);
    });

    await test.step('Verify a 200 is returned rather than an error', async () => {
      expect(response.status()).toBe(200);
    });
  });
});
