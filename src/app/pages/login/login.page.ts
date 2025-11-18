import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  rol: string = '';

  constructor(
    private supa: SupabaseService,
    private router: Router
  ) { }

  async login() {
    try {
      const { data, error } = await this.supa.client.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });
      if (error) { alert(error.message); return; }

      const user = data.user;
      if (!user?.id) { alert('No se pudo obtener el usuario'); return; }

      // Crea/actualiza el registro en usuarios con rol por defecto 'usuario'
      const { error: upsertErr } = await this.supa.client.from('usuarios').upsert({
        id: user.id,
        email: this.email,
        rol: 'usuario'
      });
      if (upsertErr) { alert('Error al guardar usuario: ' + upsertErr.message); return; }

      // Obtén el rol para redirigir
      const { data: rolData, error: rolErr } = await this.supa.client
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .maybeSingle();
      if (rolErr) { alert('Error al obtener rol: ' + rolErr.message); return; }
      const rol = rolData?.rol || 'usuario';

      // Redirección por rol
      this.router.navigate([rol === 'admin' ? '/admin' : '/home']);
    } catch (e: any) {
      alert(e?.message || 'Error al iniciar sesión');
    }
  }

  register() {
    this.router.navigate(['/register']);
  }

}
