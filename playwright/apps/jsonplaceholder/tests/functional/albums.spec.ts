import { test, expect } from '../../app.fixture';
import { getJson } from '../../utils';
import { RESOURCE_COUNTS, RELATION_COUNTS, VALID_ID } from '../../constants';
import { TAGS } from '../../../../common/constants';
import type { Album, Photo } from '../../types';

test.describe('Check Albums and Photos endpoint functionalities', () => {
  test('Verify GET /albums returns all albums', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request all albums', async () => {
      return app.albumsClient.getAll();
    });

    await test.step('Verify the response is a 200 with the full collection', async () => {
      expect(response.status()).toBe(200);
      const albums = await getJson<Album[]>(response);
      expect(albums).toHaveLength(RESOURCE_COUNTS.ALBUMS);
    });
  });

  test('Verify GET /photos returns all photos', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request all photos', async () => {
      return app.photosClient.getAll();
    });

    await test.step('Verify the response is a 200 with the full collection', async () => {
      expect(response.status()).toBe(200);
      const photos = await getJson<Photo[]>(response);
      expect(photos).toHaveLength(RESOURCE_COUNTS.PHOTOS);
    });
  });

  test('Verify GET /albums/:id/photos returns the photos for that album', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request photos for an album', async () => {
      return app.albumsClient.getPhotos(VALID_ID);
    });

    await test.step('Verify the count and that every photo belongs to that album', async () => {
      expect(response.status()).toBe(200);
      const photos = await getJson<Photo[]>(response);
      expect(photos).toHaveLength(RELATION_COUNTS.ALBUM_1_PHOTOS);
      for (const photo of photos) {
        expect(photo.albumId).toBe(VALID_ID);
      }
    });
  });
});
