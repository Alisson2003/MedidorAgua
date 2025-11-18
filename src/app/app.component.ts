import { Component } from '@angular/core';
import { SupabaseService } from './core/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {
  constructor(private supa: SupabaseService, private router: Router) {}

  logout() {
    this.supa.signOut();
    this.router.navigate(['/login']);
  }
}
