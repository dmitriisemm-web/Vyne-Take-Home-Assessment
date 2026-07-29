import { test, expect } from '../../app.fixture';
import { getJson } from '../../utils';
import { RESOURCE_COUNTS, RELATION_COUNTS, VALID_ID } from '../../constants';
import { TAGS } from '../../../../common/constants';
import type { Todo, User } from '../../types';

test.describe('Check Users endpoint functionalities', () => {
  test('Verify GET /users returns all users', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request all users', async () => {
      return app.usersClient.getAll();
    });

    await test.step('Verify the response is a 200 with the full collection', async () => {
      expect(response.status()).toBe(200);
      const users = await getJson<User[]>(response);
      expect(users).toHaveLength(RESOURCE_COUNTS.USERS);
    });
  });

  test('Verify GET /users/:id returns the correct nested address and company shape', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    const response = await test.step('Request a single user', async () => {
      return app.usersClient.getById(VALID_ID);
    });

    await test.step('Verify the response includes nested address.geo and company', async () => {
      expect(response.status()).toBe(200);
      const user = await getJson<User>(response);
      expect(user).toMatchObject({
        id: VALID_ID,
        name: expect.any(String),
        email: expect.any(String),
        address: {
          street: expect.any(String),
          city: expect.any(String),
          zipcode: expect.any(String),
          geo: { lat: expect.any(String), lng: expect.any(String) }
        },
        company: { name: expect.any(String), catchPhrase: expect.any(String), bs: expect.any(String) }
      });
    });
  });

  test('Verify GET /todos returns all todos', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request all todos', async () => {
      return app.todosClient.getAll();
    });

    await test.step('Verify the response is a 200 with the full collection', async () => {
      expect(response.status()).toBe(200);
      const todos = await getJson<Todo[]>(response);
      expect(todos).toHaveLength(RESOURCE_COUNTS.TODOS);
    });
  });

  test('Verify GET /users/:id/todos returns the todos for that user', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    const response = await test.step('Request todos for a user', async () => {
      return app.usersClient.getTodos(VALID_ID);
    });

    await test.step('Verify the count and that every todo belongs to that user', async () => {
      expect(response.status()).toBe(200);
      const todos = await getJson<Todo[]>(response);
      expect(todos).toHaveLength(RELATION_COUNTS.USER_1_TODOS);
      for (const todo of todos) {
        expect(todo.userId).toBe(VALID_ID);
      }
    });
  });
});
