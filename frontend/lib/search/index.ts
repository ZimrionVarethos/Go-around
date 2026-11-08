import { httpSearchGateway } from './http-gateway';
import { mockSearchGateway } from './mock-gateway';
import { supabaseSearchGateway } from './supabase-gateway';

export const searchGateway =
  process.env.NEXT_PUBLIC_SEARCH_SOURCE === 'api'
    ? httpSearchGateway
    : process.env.NEXT_PUBLIC_SEARCH_SOURCE === 'mock'
    ? mockSearchGateway
    : supabaseSearchGateway;

export * from './types';
