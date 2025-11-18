import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  lecturas: any[] = [];

  constructor(private supa: SupabaseService) {}

  async ngOnInit() {
    const session = await this.supa.getCurrentSession();
    if (!session?.user) return;

    this.lecturas = await this.supa.obtenerLecturas(session.user.id, false);
  }
}
