import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-lista-lecturas',
  templateUrl: './lista-lecturas.page.html',
  standalone: false,
})

export class ListaLecturasPage implements OnInit {
  lecturas: any[] = [];
  esAdmin = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const session = await this.supabase.getCurrentSession();

    const { data } = await this.supabase.client
      .from('usuarios')
      .select('rol')
      .eq('id', session?.user.id)
      .single();

    this.esAdmin = data?.rol === 'admin';

    const resultado = await this.supabase.obtenerLecturas(
      session!.user.id,
      this.esAdmin
    );

    this.lecturas = resultado ?? [];
  }
}
