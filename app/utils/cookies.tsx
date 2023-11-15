import { createCookie } from '@remix-run/node';

export const hasUserVisited = createCookie('has-user-visited')
