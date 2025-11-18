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
  error = '';
  rol: string = '';   // <-- propiedad para el ion-select

  constructor(
    private supa: SupabaseService,
    private router: Router
  ) { }

  async login() {
    try {
      const { data, error } = await this.supa.client.auth.signInWithPassword({
        email: this.email, password: this.password
      });
      if (error) { alert(error.message); 
        return; }

      const user = data.user;
      if (!user?.id) 
        { alert('No se pudo obtener el usuario'); 
          return; }

      const rol = await this.supa.getUserRole(user.id);
      if (!rol) 
        { alert('Error: usuario sin rol'); 
          return; }

      this.rol = rol;
      if (rol === 'admin') this.router.navigate(['/admin']);
      else this.router.navigate(['/home']);
    } catch (e: any) {
      console.error(e); alert('Error al ingresar: ' + e.message);
    }
  }

  register() { this.router.navigate(['/register']); }

}
