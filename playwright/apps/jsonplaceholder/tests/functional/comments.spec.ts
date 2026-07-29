import { test, expect } from '../../app.fixture';
import { getJson } from '../../utils';
import { RESOURCE_COUNTS, RELATION_COUNTS, VALID_ID, NONEXISTENT_ID } from '../../constants';
import { TAGS } from '../../../../common/constants';
import type { Comment } from '../../types';

test.describe('Check Comments endpoint functionalities', () => {
  test('Verify GET /comments returns all comments', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request all comments', async () => {
      return app.commentsClient.getAll();
    });

    await test.step('Verify the response is a 200 with the full collection', async () => {
      expect(response.status()).toBe(200);
      const comments = await getJson<Comment[]>(response);
      expect(comments).toHaveLength(RESOURCE_COUNTS.COMMENTS);
    });
  });

  test('Verify GET /comments?postId= returns only comments for that post', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    const response = await test.step('Request comments filtered by postId', async () => {
      return app.commentsClient.getAll({ postId: VALID_ID });
    });

    await test.step('Verify the count and that every comment belongs to that post', async () => {
      expect(response.status()).toBe(200);
      const comments = await getJson<Comment[]>(response);
      expect(comments).toHaveLength(RELATION_COUNTS.POST_1_COMMENTS);
      for (const comment of comments) {
        expect(comment.postId).toBe(VALID_ID);
      }
    });
  });

  test('Verify GET /posts/:id/comments matches GET /comments?postId=', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const [nestedComments, filteredComments] = await test.step('Request comments via both routes', async () => {
      const nestedResponse = await app.postsClient.getComments(VALID_ID);
      const filteredResponse = await app.commentsClient.getAll({ postId: VALID_ID });
      return Promise.all([getJson<Comment[]>(nestedResponse), getJson<Comment[]>(filteredResponse)]);
    });

    await test.step('Verify both routes return identical data', async () => {
      expect(nestedComments).toEqual(filteredComments);
    });
  });

  test('Verify GET /posts/:id/comments for a nonexistent post returns an empty array', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request comments for a nonexistent post', async () => {
      return app.postsClient.getComments(NONEXISTENT_ID);
    });

    await test.step('Verify an empty array is returned with a 200, not a 404', async () => {
      expect(response.status()).toBe(200);
      const comments = await getJson<Comment[]>(response);
      expect(comments).toEqual([]);
    });
  });
});
