import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: false,
})

export class RegisterPage {
  email = '';
  password = '';
  rol = '';

  constructor(
    private supa: SupabaseService,
    private router: Router
  ) { }

  async registrar() {
    try {
      const { data, error } = await this.supa.client.auth.signUp({
        email: this.email,
        password: this.password
      });
      if (error) { alert(error.message); return; }

      alert('Cuenta creada. Revisa tu correo y confirma para poder iniciar sesión.');
      this.router.navigate(['/login']);
    } catch (e: any) {
      alert(e?.message || 'Error al registrar');
    }
  }
}
