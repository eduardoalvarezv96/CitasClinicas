import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

// 1. Interfaz para el objeto Acción (Logs)
export interface Accion {
  id: number;
  accion: string;
  fecha: string;
}

// 2. Interfaz para el objeto Cita (Registro estructurado)
export interface Cita {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    edad: number;
    especialidad: string;
    clinica: string;
    fechaCita: string;     // Fecha y hora de la cita
    registroFecha: string; // Fecha en que se registró la acción
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db: SQLiteObject | null = null;
  private readonly DB_NAME = 'medicina_app.db';

  constructor(private sqlite: SQLite, private platform: Platform) {}

  // -----------------------------------------------------------------
  // 🚀 INICIALIZACIÓN DE LA BASE DE DATOS
  // -----------------------------------------------------------------

  async crearBD(): Promise<void> {
    try {
      await this.platform.ready();

      this.db = await this.sqlite.create({
        name: this.DB_NAME,
        location: 'default'
      });

      console.log("Base de datos creada/abierta exitosamente.");

      // 1. Tabla de Usuarios
      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT, password TEXT)', []
      );
      console.log("Tabla 'usuarios' verificada.");

      // 2. Tabla de Acciones (Logs)
      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS acciones (id INTEGER PRIMARY KEY AUTOINCREMENT, accion TEXT NOT NULL, fecha TEXT NOT NULL)', []
      );
      console.log("Tabla 'acciones' verificada.");
      
      // 3. Tabla de Citas (Registro estructurado)
      await this.db.executeSql(
        `CREATE TABLE IF NOT EXISTS citas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          rut TEXT NOT NULL,
          edad INTEGER,
          especialidad TEXT NOT NULL,
          clinica TEXT NOT NULL,
          fechaCita TEXT NOT NULL, 
          registroFecha TEXT NOT NULL
        )`, []
      );
      console.log("Tabla 'citas' verificada.");

    } catch (e) {
      console.error("❌ Ocurrió un error al crear la base de datos o tablas", e);
    }
  }

  // -----------------------------------------------------------------
  // 📝 MÉTODOS DE ACCIONES (LOGS)
  // -----------------------------------------------------------------

  async addAccion(accion: string): Promise<void> {
    if (!this.db) {
      console.error('La base de datos no está inicializada. No se puede guardar la acción.');
      return;
    }

    try {
      const fecha = new Date().toISOString(); 
      
      await this.db.executeSql(
        'INSERT INTO acciones (accion, fecha) VALUES (?, ?)',
        [accion, fecha]
      );
      console.log(`✅ Acción guardada en SQLite: ${accion}`);
    } catch (e) {
      console.error('❌ Error al guardar la acción', e);
    }
  }
  
  async getAcciones(): Promise<Accion[]> {
    if (!this.db) {
      console.error('La base de datos no está inicializada.');
      return [];
    }
    
    try {
      const result = await this.db.executeSql('SELECT * FROM acciones ORDER BY id DESC', []);
      const acciones: Accion[] = [];
      
      for (let i = 0; i < result.rows.length; i++) {
        acciones.push(result.rows.item(i));
      }
      return acciones;
    } catch (e) {
      console.error('Error al obtener acciones', e);
      return [];
    }
  }
  
  // -----------------------------------------------------------------
  // 🏥 MÉTODOS DE CITAS
  // -----------------------------------------------------------------

  async addCita(citaData: any): Promise<void> {
    if (!this.db) {
      console.error('La base de datos no está inicializada. No se puede guardar la cita.');
      return;
    }

    try {
      const registroFecha = new Date().toISOString();
      const sql = `
        INSERT INTO citas 
        (nombre, apellido, rut, edad, especialidad, clinica, fechaCita, registroFecha) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await this.db.executeSql(sql, [
        citaData.nombre, 
        citaData.apellido, 
        citaData.rut, 
        citaData.edad, 
        citaData.especialidad, 
        citaData.clinica, 
        `${citaData.fecha} ${citaData.hora}`, 
        registroFecha
      ]);
      console.log(`✅ Cita para ${citaData.nombre} guardada en SQLite.`);
    } catch (e) {
      console.error('❌ Error al guardar la cita', e);
    }
  }

  async getCitas(): Promise<Cita[]> {
    if (!this.db) {
      console.error('La base de datos no está inicializada.');
      return [];
    }
    
    try {
      const result = await this.db.executeSql('SELECT * FROM citas ORDER BY id DESC', []);
      const citas: Cita[] = [];
      
      for (let i = 0; i < result.rows.length; i++) {
        citas.push(result.rows.item(i));
      }
      return citas;
    } catch (e) {
      console.error('Error al obtener citas', e);
      return [];
    }
  }

  // -----------------------------------------------------------------
  // 👤 MÉTODOS DE USUARIOS (Ejemplos)
  // -----------------------------------------------------------------

  async insertarUsuario() {
    try {
      if (!this.db) {
        console.log('La base de datos no está inicializada.');
        return;
      }
      // Asegúrate de que este email coincida con el usado en login.page.ts
      const nombre = 'Eduardo';
      const email = 'eduardo@gmail.com'; 
      const password = '123456';

      await this.db.executeSql(
        'INSERT OR IGNORE INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, password]
      );

      console.log('Usuario de ejemplo (Eduardo) insertado correctamente (o ya existía).');
    } catch (e) {
      console.error('Error al insertar usuario', e);
    }
  }

  async obtenerUsuarios(): Promise<any[]> {
    try {
      if (!this.db) {
        console.log('La base de datos no está inicializada.');
        return [];
      }

      const result = await this.db.executeSql('SELECT * FROM usuarios', []);
      const usuarios = [];

      for (let i = 0; i < result.rows.length; i++) {
        usuarios.push(result.rows.item(i));
      }

      return usuarios;
    } catch (e) {
      console.error('Error al obtener usuarios', e);
      return [];
    }
  }
}