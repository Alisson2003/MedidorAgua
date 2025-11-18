import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-admin',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
  standalone: false
})

export class AdminPage implements OnInit {
  lecturas: any[] = [];

  constructor(private supa: SupabaseService, private router: Router) {}

  async ngOnInit() {
    this.lecturas = await this.supa.obtenerLecturas('', true);
  }

  async logout() {
    await this.supa.signOut();
    this.router.navigate(['/login']);
  }
}

