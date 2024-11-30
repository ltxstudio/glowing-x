import { getRequestContext } from '@cloudflare/next-on-pages';
import { supabase } from '../../../lib/supabase';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return new Response('Query parameter is required', { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('dorks')
      .select('*')
      .ilike('query', `%${query}%`); // case-insensitive search

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
