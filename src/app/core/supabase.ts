import { Injectable, inject } from '@angular/core';
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private _session$ = new BehaviorSubject<Session | null>(null);
  session$ = this._session$.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    // Recupera sesión al iniciar
    this.supabase.auth.getSession().then(({ data }) => this._session$.next(data.session));

    // Escucha cambios de sesión (login/logout/refresh)
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._session$.next(session);
    });
  }

  get client() {
    return this.supabase;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  //MEDIDOR

  async insertarLectura(lectura: any) {
    const { data, error } = await this.supabase.from('lecturas').insert([lectura]);
    if (error) throw error;
    return data;
  }

  async obtenerLecturas(userId: string, esAdmin = false) {
    const query = this.supabase.from('lecturas').select('*');
    if (!esAdmin) query.eq('user_id', userId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  // 📸 Subida de imágenes
  async subirFoto(nombre: string, archivo: Blob) {
    const { data, error } = await this.supabase.storage
      .from('lecturas')
      .upload(nombre, archivo, { contentType: 'image/jpeg' });
    if (error) throw error;

    return this.supabase.storage.from('lecturas').getPublicUrl(nombre).data.publicUrl;
  }

}