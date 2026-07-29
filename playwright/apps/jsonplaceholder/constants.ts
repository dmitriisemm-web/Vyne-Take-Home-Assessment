export const ROUTES = {
  POSTS: '/posts',
  COMMENTS: '/comments',
  ALBUMS: '/albums',
  PHOTOS: '/photos',
  TODOS: '/todos',
  USERS: '/users'
} as const;

export const RESOURCE_COUNTS = {
  POSTS: 100,
  COMMENTS: 500,
  ALBUMS: 100,
  PHOTOS: 5000,
  TODOS: 200,
  USERS: 10
} as const;

export const RELATION_COUNTS = {
  POST_1_COMMENTS: 5,
  ALBUM_1_PHOTOS: 50,
  USER_1_TODOS: 20,
  USER_1_POSTS: 10
} as const;

export const VALID_ID = 1;
export const NONEXISTENT_ID = 9999;
export const MALFORMED_ID = 'abc';

export const VALID_POST_PAYLOAD = {
  title: 'foo',
  body: 'bar',
  userId: 1
};

export const CREATED_RESOURCE_ID = 101;
