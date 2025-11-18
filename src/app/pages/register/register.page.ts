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
      if (!this.email || !this.password || !this.rol) {
        alert('Completa email, contraseña y rol'); 
        return;
      }

      const { data, error } = await this.supa.client.auth.signUp({
        email: this.email, password: this.password
      });

      if (error) 
        { alert(error.message); 
        return; }

      const user = data.user;
      if (!user?.id) 
        { alert('Revisa tu correo para confirmar tu cuenta'); 
          return; }

      const { error: insertError } = await this.supa.client.from('usuarios').insert({
        id: user.id, email: this.email, rol: this.rol
      });

      if (insertError)
        { alert('Error al guardar usuario: ' + insertError.message); 
          return; }

      alert('Cuenta creada, ahora inicia sesión');
      this.router.navigate(['/login']);
    } catch (e: any) { alert(e.message); }
  }
}
