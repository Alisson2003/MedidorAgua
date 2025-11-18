import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-nueva-lectura',
  templateUrl: './nueva-lectura.page.html',
  styleUrls: ['./nueva-lectura.page.scss'],
  standalone: false,
})
export class NuevaLecturaPage implements OnInit {
  valorMedidor = '';
  observaciones = '';
  fotoMedidorBase64 = '';
  fotoFachadaBase64 = '';
  lat = 0;
  lng = 0;

  constructor(private supa: SupabaseService, private router: Router) {}

  ngOnInit() {}

  async tomarFotoMedidor() {
    this.fotoMedidorBase64 = await this.supa.tomarFoto();
  }

  async tomarFotoFachada() {
    this.fotoFachadaBase64 = await this.supa.tomarFoto();
  }

  async obtenerGps() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      alert(`Ubicación obtenida: ${this.lat}, ${this.lng}`);
    } catch (err) {
      console.error(err);
      alert('No se pudo obtener la ubicación');
    }
  }

  /*  
  async guardarLectura() {
    try {
      const session = await this.supa.getCurrentSession();
      if (!session?.user) throw new Error("No hay usuario logeado");

      // Obtener ubicación
      const coords = await this.supa.obtenerUbicacion();
      this.lat = coords.lat;
      this.lng = coords.lng;

      // Subir fotos
      const medidorUrl = await this.supa.subirFoto(this.fotoMedidorBase64, `medidor_${Date.now()}.jpg`);
      const fachadaUrl = await this.supa.subirFoto(this.fotoFachadaBase64, `fachada_${Date.now()}.jpg`);

      // Crear lectura
      const lectura = {
        user_id: session.user.id,
        valor: this.valorMedidor,
        observaciones: this.observaciones,
        foto_medidor: medidorUrl,
        foto_fachada: fachadaUrl,
        lat: this.lat,
        lng: this.lng,
        google_maps_url: `https://www.google.com/maps?q=${this.lat},${this.lng}`,
        created_at: new Date().toISOString()
      };

      await this.supa.insertarLectura(lectura);
      alert("Lectura registrada correctamente");
      this.router.navigate(['/home']);
    } catch (error: any) {
      alert(error.message);
    }
  }*/
  async guardarLectura() {
    try {
      const session = await this.supa.getCurrentSession();
      if (!session?.user) throw new Error('No hay usuario logeado');

      // Obtener ubicación (ya existe tu método)
      const coords = await this.supa.obtenerUbicacion();
      this.lat = coords.lat;
      this.lng = coords.lng;

      // Subir las fotos que ya tomaste
      const medidorUrl = this.fotoMedidorBase64
        ? await this.supa.subirFoto(
            this.fotoMedidorBase64,
            `medidor_${Date.now()}.jpg`
          )
        : '';
      const fachadaUrl = this.fotoFachadaBase64
        ? await this.supa.subirFoto(
            this.fotoFachadaBase64,
            `fachada_${Date.now()}.jpg`
          )
        : '';

      // Crear lectura
      const lectura = {
        user_id: session.user.id,
        valor: this.valorMedidor,
        observaciones: this.observaciones,
        foto_medidor: medidorUrl,
        foto_fachada: fachadaUrl,
        lat: this.lat,
        lng: this.lng,
        //google_maps_url: `https://www.google.com/maps?q=${this.lat},${this.lng}`,
        mapa_url: `https://www.google.com/maps?q=${this.lat},${this.lng}`,
        created_at: new Date().toISOString(),
      };

      await this.supa.insertarLectura(lectura);
      alert('Lectura registrada correctamente');
      this.router.navigate(['/home']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}
