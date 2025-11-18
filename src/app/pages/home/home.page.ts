import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: false,
})

export class HomePage {
  lecturas: any[] = [];

  constructor(private supa: SupabaseService, private router: Router) { }

  async ionViewWillEnter() {
    const session = await this.supa.getCurrentSession();

    if (!session || !session.user) return;
    this.lecturas = await this.supa.obtenerLecturas(session.user.id, false);
  }

  logout() {
    this.supa.signOut();
    this.router.navigate(['/login']);
  }

}
