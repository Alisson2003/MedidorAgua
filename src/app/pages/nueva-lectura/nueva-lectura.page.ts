import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  standalone: false,
  selector: 'app-nueva-lectura',
  templateUrl: './nueva-lectura.page.html',
})

export class NuevaLecturaPage {
  valor = 0;
  observaciones = '';

  constructor(private supa: SupabaseService) {}

  async guardar() {
    const session = await this.supa.getCurrentSession();

    const lectura = {
      user_id: session?.user.id,
      valor: this.valor,
      observaciones: this.observaciones,
      lat: -0.1807,
      lon: -78.4678,
      mapa_url: 'https://maps.google.com/?q=-0.1807,-78.4678',
    };

    await this.supa.insertarLectura(lectura);
    alert('Lectura guardada ✔');
  }
}
