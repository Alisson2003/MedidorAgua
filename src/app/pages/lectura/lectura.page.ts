import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-lectura',
  templateUrl: './lectura.page.html',
  styleUrls: ['./lectura.page.scss'],
  standalone: false,
})
export class LecturaPage {
  valorMedidor = 0;
  observaciones = '';
  lat!: number;
  lng!: number;
  fotoMedidor!: string;
  fotoFachada!: string;
  subiendo = false;

  constructor(private supabase: SupabaseService) {}

  async tomarGPS() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    } catch (e: any) {
      alert('Error al obtener ubicación: ' + e?.message);
    }
  }

  async tomarFotoMedidor() {
    try {
      const img = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
        quality: 80,
      });

      const nombre = `medidor-${Date.now()}.jpg`;
      const blob = this.b64toBlob(img.base64String!);
      this.fotoMedidor = await this.supabase.subirFoto(nombre, blob);
    } catch (e: any) {
      alert('Error al tomar foto del medidor: ' + e?.message);
    }
  }

  async tomarFotoFachada() {
    try {
      const img = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
        quality: 80,
      });

      const nombre = `fachada-${Date.now()}.jpg`;
      const blob = this.b64toBlob(img.base64String!);
      this.fotoFachada = await this.supabase.subirFoto(nombre, blob);
    } catch (e: any) {
      alert('Error al tomar foto de la fachada: ' + e?.message);
    }
  }

  async guardar() {
    this.subiendo = true;

    if (!this.valorMedidor || !this.lat || !this.lng || !this.fotoMedidor || !this.fotoFachada) {
      alert('Completa todos los campos y toma las fotos antes de guardar');
      this.subiendo = false;
      return;
    }

    try {
      const session = await this.supabase.getCurrentSession();
      const uid = session?.user?.id;
      if (!uid) {
        alert('Sesión inválida');
        this.subiendo = false;
        return;
      }

      await this.supabase.insertarLectura({
        user_id: uid,
        valor: this.valorMedidor,
        observaciones: this.observaciones,
        foto_medidor: this.fotoMedidor,
        foto_fachada: this.fotoFachada,
        lat: this.lat,
        lon: this.lng,
        mapa_url: `https://www.google.com/maps?q=${this.lat},${this.lng}`,
      });

      alert('Lectura registrada con éxito');
      this.valorMedidor = 0;
      this.observaciones = '';
      this.fotoMedidor = '';
      this.fotoFachada = '';
      this.lat = 0;
      this.lng = 0;
    } catch (e: any) {
      alert('Error al guardar lectura: ' + e.message);
    }

    this.subiendo = false;
  }

  b64toBlob(base64: string): Blob {
    const byteChars = atob(base64);
    const arr = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) arr[i] = byteChars.charCodeAt(i);
    return new Blob([arr], { type: 'image/jpeg' });
  }
}
