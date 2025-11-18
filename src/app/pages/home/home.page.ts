import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  lecturas: any[] = [];
  rol: string = '';

  constructor(private supa: SupabaseService, private router: Router) {}

  async ngOnInit() {
    const session = await this.supa.getCurrentSession();
    if (!session?.user) {
      this.router.navigate(['/login']);
      return;
    }

    // Obtener rol del usuario
    this.rol = await this.supa.getRolUsuario(session.user.id);

    // Obtener lecturas: admin ve todas, medidor solo las suyas
    const esAdmin = this.rol === 'admin';
    this.lecturas = await this.supa.obtenerLecturas(session.user.id, esAdmin);
  }

  mapsLink(lat: number, lng: number): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  async logout() {
    await this.supa.signOut();
    this.router.navigate(['/login']);
  }
}
