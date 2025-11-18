import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  get client() {
    return this.supabase;
  }

  /** LOGIN */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  /** REGISTRO CON ROL */
  async signUpWithRol(email: string, password: string, rol: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error("No se pudo crear el usuario");

    const { error: insertError } = await this.supabase
      .from('usuarios')
      .insert([{ id: user.id, email, rol }]);

    if (insertError) throw insertError;

    return user;
  }

  /** LOGOUT */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  /** SESIÓN ACTUAL */
  async getCurrentSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  /** TOMAR FOTO */
  async tomarFoto(): Promise<string> {
    const photo: Photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      source: CameraSource.Camera,
      //source: CameraSource.Prompt,
      resultType: CameraResultType.Base64
    });

    if (!photo.base64String) throw new Error("No se pudo tomar la foto");
    return photo.base64String;
  }

  /** SUBIR FOTO A SUPABASE */
  async subirFoto(base64Image: string, fileName: string): Promise<string> {
    const byteString = atob(base64Image);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }

    const file = new Blob([bytes], { type: 'image/jpeg' });

    const { error } = await this.supabase.storage
      .from('fotos_medidores')
      .upload(fileName, file, { contentType: 'image/jpeg', upsert: true });

    if (error) throw error;

    const urlData = this.supabase.storage.from('fotos_medidores').getPublicUrl(fileName);
    return urlData.data.publicUrl;
  }

  /** INSERTAR LECTURA */
  async insertarLectura(lectura: any) {
    const { data, error } = await this.supabase.from('fotos_medidores').insert([lectura]);
    if (error) throw error;
    return data;
  }

  /** OBTENER LECTURAS */
  async obtenerLecturas(userId: string, esAdmin = false) {
    let query = this.supabase.from('fotos_medidores').select('*');
    if (!esAdmin) query = query.eq('user_id', userId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  /** OBTENER ROL DEL USUARIO */
  async getRolUsuario(userId: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data?.rol;
  }

  /** OBTENER UBICACIÓN */
  async obtenerUbicacion(): Promise<{ lat: number; lng: number }> {
    const position = await Geolocation.getCurrentPosition();
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  }
}
