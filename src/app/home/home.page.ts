import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../core/supabase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  logout() {
    this.supabase.signOut();
    this.router.navigateByUrl('/');
  }
}
