import { httpSearchGateway } from './http-gateway';
import { mockSearchGateway } from './mock-gateway';

export const searchGateway = process.env.NEXT_PUBLIC_SEARCH_SOURCE === 'api'
  ? httpSearchGateway
  : mockSearchGateway;

export * from './types';
