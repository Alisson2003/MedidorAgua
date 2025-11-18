import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  standalone: false
})

export class AdminPage {
  lecturas: any[] = [];

  constructor(private supa: SupabaseService, private router: Router) { }

  async ionViewWillEnter() {
    this.lecturas = await this.supa.obtenerLecturas('', true);
  }

  logout() {
    this.supa.signOut();
    this.router.navigate(['/login']);
  }


}

