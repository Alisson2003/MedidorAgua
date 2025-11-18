import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class RegisterPage {
  email = '';
  password = '';
  rol = 'medidor'; 

  constructor(private supa: SupabaseService, private router: Router) {}

  async registrar() {
    try {
      await this.supa.signUpWithRol(this.email, this.password, this.rol);
      alert('Usuario registrado correctamente');
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}
