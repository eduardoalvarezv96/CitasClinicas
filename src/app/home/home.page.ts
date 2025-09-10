import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
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
  IonCol 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

interface Cita {
  nombre: string;
  rut: string;
  fecha: string;
  hora: string;
  especialidad: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,   // 👈 importante
    NgFor,          // 👈 necesario para *ngFor
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
    IonCol
  ],
})
export class HomePage {
  citas: Cita[] = [
    { nombre: 'Juan Pérez', rut: '12.345.678-9', fecha: '10-09-2025', hora: '09:00', especialidad: 'Cardiología' },
    { nombre: 'María López', rut: '11.223.344-5', fecha: '11-09-2025', hora: '11:30', especialidad: 'Dermatología' },
    { nombre: 'Pedro González', rut: '22.334.556-7', fecha: '12-09-2025', hora: '15:00', especialidad: 'Neurología' },
    { nombre: 'Ana Torres', rut: '99.888.777-6', fecha: '13-09-2025', hora: '10:15', especialidad: 'Oftalmología' }
  ];

  constructor(private router : Router) {}



  onMenuClick(option: string) {
    console.log("Opción seleccionada:", option);

    switch(option) {
      case 'home':
        console.log("AKI");
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
