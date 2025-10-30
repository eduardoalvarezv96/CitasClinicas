import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

// Interfaz para el objeto Acción, útil para la tipificación
export interface Accion {
  id: number;
  accion: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db: SQLiteObject | null = null;
  private readonly DB_NAME = 'medicina_app.db'; // Nombre de la BD más genérico

  constructor(private sqlite: SQLite, private platform: Platform) {}

  /**
   * Inicializa la base de datos y crea las tablas necesarias (usuarios y acciones).
   * Debe llamarse al inicio de la aplicación (e.g., en el constructor del App component).
   */
  async crearBD(): Promise<void> {
    try {
      await this.platform.ready();

      this.db = await this.sqlite.create({
        name: this.DB_NAME,
        location: 'default'
      });

      console.log("Base de datos creada/abierta exitosamente.");

      // 1. Tabla para usuarios (existente)
      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT, password TEXT)', []
      );
      console.log("Tabla 'usuarios' verificada.");

      // 2. Tabla para registrar acciones/logs (nueva, requerida por registro-citas.ts)
      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS acciones (id INTEGER PRIMARY KEY AUTOINCREMENT, accion TEXT NOT NULL, fecha TEXT NOT NULL)', []
      );
      console.log("Tabla 'acciones' verificada.");

    } catch (e) {
      console.error("❌ Ocurrió un error al crear la base de datos o tablas", e);
    }
  }
  
  /**
   * Agrega un nuevo registro de acción (log de una cita) a la tabla 'acciones'.
   * Este es el método que se requiere en registro-citas.ts.
   * @param accion Descripción de la acción a guardar.
   */
  async addAccion(accion: string): Promise<void> {
    if (!this.db) {
      console.error('La base de datos no está inicializada. No se puede guardar la acción.');
      return;
    }

    try {
      // Usamos el formato ISO para guardar la fecha, fácil de ordenar y parsear.
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
  
  /**
   * Obtiene todos los registros de acciones (historial).
   */
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


  // --- Métodos de Usuarios (Mantenidos del original) ---

  async insertarUsuario() {
    try {
      if (!this.db) {
        console.log('La base de datos no está inicializada.');
        return;
      }
      // Ejemplo de inserción de un usuario
      const nombre = 'Juan Pérez';
      const email = 'juan.perez@example.com';
      const password = '123456';

      await this.db.executeSql(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, password]
      );

      console.log('Usuario de ejemplo insertado correctamente');
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
