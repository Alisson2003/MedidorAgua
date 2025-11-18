import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase';

@Component({
  selector: 'app-nueva-lectura',
  templateUrl: './nueva-lectura.page.html',
  standalone: false
})
export class NuevaLecturaPage implements OnInit {
  valorMedidor = '';
  observaciones = '';
  fotoMedidor: File | null = null;
  fotoFachada: File | null = null;
  latitud!: number;
  longitud!: number;

  // Manejo seguro de archivos
  onFotoMedidorChange(event: any) {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.fotoMedidor = fileList[0];
    }
  }

  onFotoFachadaChange(event: any) {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.fotoFachada = fileList[0];
    }
  }

  constructor(private supa: SupabaseService, private router: Router) { }

  ngOnInit() { }

  async guardarLectura() {
    try {
      const session = await this.supa.getCurrentSession();
      if (!session?.user) throw new Error("No hay usuario logeado");

      //Obtener ubicación GPS
      if (navigator.geolocation) {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              this.latitud = pos.coords.latitude;
              this.longitud = pos.coords.longitude;
              resolve();
            },
            (err) => {
              console.warn("No se pudo obtener ubicación GPS:", err);
              // Puedes decidir si continuar sin GPS
              this.latitud = 0;
              this.longitud = 0;
              resolve();
            }
          );
        });
      } else {
        // Si no hay GPS
        this.latitud = 0;
        this.longitud = 0;
      }

      //Subir fotos si existen
      let fotoMedidorUrl = '';
      let fotoFachadaUrl = '';

      if (this.fotoMedidor) {
        fotoMedidorUrl = await this.supa.subirFoto(`medidor_${Date.now()}.jpg`, this.fotoMedidor);
      }
      if (this.fotoFachada) {
        fotoFachadaUrl = await this.supa.subirFoto(`fachada_${Date.now()}.jpg`, this.fotoFachada);
      }

      //Construir objeto lectura
      const lectura = {
        user_id: session.user.id,
        valor: this.valorMedidor,
        observaciones: this.observaciones,
        foto_medidor: fotoMedidorUrl,
        foto_fachada: fotoFachadaUrl,
        lat: this.latitud,
        lng: this.longitud,
        created_at: new Date().toISOString(),
      };

      //Insertar lectura en Supabase
      await this.supa.insertarLectura(lectura);
      alert("Lectura registrada correctamente");
      this.router.navigate(['/home']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}


//alissonviracocha602@gmail.com