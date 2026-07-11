import { redirect } from 'next/navigation';
import { createClient } from './server';

/**
 * Call at the top of every admin server component / action.
 * Redirects to the login page if there is no valid session.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/admin/pieslegties');
  }

  return user;
}
