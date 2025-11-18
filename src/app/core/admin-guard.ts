import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from './supabase';

export const adminGuard: CanActivateFn = async () => {
  const supa = inject(SupabaseService);
  const router = inject(Router);
  const session = await supa.getCurrentSession();
  if (!session) { router.navigateByUrl('/login'); return false; }
  const isAdmin = await supa.isAdmin();
  if (isAdmin) return true;
  router.navigateByUrl('/home');
  return false;
};
