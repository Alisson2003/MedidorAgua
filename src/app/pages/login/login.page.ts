import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: false
})

export class LoginPage implements OnInit {
  email = '';
  password = '';
  rol = 'medidor'; 

  constructor(private supa: SupabaseService, private router: Router) {}

  ngOnInit() {}

  async login() {
    try {
      const { user } = await this.supa.signIn(this.email, this.password);
      if (!user) throw new Error("Usuario no encontrado");

      const rol = await this.supa.getRolUsuario(user.id);

      if (rol === 'admin') this.router.navigate(['/admin']);
      else this.router.navigate(['/home']);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async registrar() {
    this.router.navigate(['/register']);
  }
}


