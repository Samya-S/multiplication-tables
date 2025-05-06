'use server';

import { headers } from 'next/headers';

export async function getClientIP() {
  const headersList = headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded;

  return ip;
}