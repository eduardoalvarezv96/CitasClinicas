import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, DatePipe } from '@angular/common'; 
import { HttpClient } from '@angular/common/http'; 
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonMenu, 
  IonButtons, 
  IonMenuButton, 
  IonList, 
  IonItem, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonSearchbar,
  IonCard,          
  IonCardContent,   
  IonIcon,          
  IonButton,
  IonImg,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';


import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


import { DatabaseService, Accion } from '../services/database-service'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true, 
  imports: [
    CommonModule,   
    NgFor,          
    DatePipe, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonMenu, 
    IonButtons, 
    IonMenuButton, 
    IonList, 
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonCard,        
    IonCardContent, 
    IonIcon,        
    IonButton,
    IonImg,
    IonCardHeader, 
    IonCardTitle,
  ],
})
export class HomePage implements OnInit {
  acciones: Accion[] = [];
  accionesFiltradas: Accion[] = []; 
  
  usuario: string = ''; 
  horaActual: string = 'Cargando...';


  public fotoUrl: string = ''; 

  constructor(
    private router : Router,
    private dbService: DatabaseService,
    private http: HttpClient 
  ) {}

  async ngOnInit() {
    await this.dbService.crearBD(); 

    await Promise.all([
        this.cargarAcciones(),
        this.fetchCurrentTime() 
    ]);
    
    const nombreUsuario = localStorage.getItem('usuario');
    if (nombreUsuario) {
      this.usuario = nombreUsuario;
    }
  }

  async takePicture() {
    console.log('Iniciando captura de foto...');
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, 
        source: CameraSource.Camera 
      });

      this.fotoUrl = image.webPath || '';
      console.log('Foto capturada, URL:', this.fotoUrl);

    } catch (error) {
      console.error('❌ Error al capturar la foto:', error);
    }
  }

  
  async fetchCurrentTime() {
    const apiUrl = 'https://worldtimeapi.org/api/ip'; 
    
    try {
      const data: any = await this.http.get(apiUrl).toPromise();
      if (data && data.datetime) {
        const isoDate = new Date(data.datetime);
        const options: Intl.DateTimeFormatOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false
        };
        this.horaActual = isoDate.toLocaleTimeString('es-CL', options);
      } else {
         this.horaActual = 'Datos no disponibles';
      }
    } catch (error) {
      console.error('❌ Error al obtener la hora de la API:', error);
      this.horaActual = 'Error de carga';
    }
  }


  async recargarDatos() {
      this.horaActual = 'Actualizando...';
      console.log('Recargando datos...');
      await Promise.all([
          this.cargarAcciones(),
          this.fetchCurrentTime() 
      ]);
  }

  async cargarAcciones() {
    try {
        this.acciones = await this.dbService.getAcciones();
        this.accionesFiltradas = this.acciones;
        console.log('Acciones cargadas:', this.acciones);
    } catch (error) {
        console.error('Error al cargar acciones:', error);
    }
  }


  buscar(event: any) {
    const query = event.target.value.toLowerCase();
    
    if (!query || query.trim() === '') {
      this.accionesFiltradas = this.acciones;
      return;
    }

    this.accionesFiltradas = this.acciones.filter(accion => 
      accion.accion.toLowerCase().includes(query)
    );
  }

  onMenuClick(option: string) {
    console.log("Opción seleccionada:", option);

    switch(option) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'registro-cita':
        this.router.navigate(['/registro-cita']);
        break;
      case 'busqueda-paciente':
        this.router.navigate(['/busqueda-paciente']);
        break;
    }
  }
}