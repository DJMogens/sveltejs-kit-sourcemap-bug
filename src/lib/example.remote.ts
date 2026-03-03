import { query, command } from '$app/server';

export const getMessage = query(async () => {
	console.log('Reading...')
  return { text: 'Hello from remote function' };
});

