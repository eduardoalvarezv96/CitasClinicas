import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // 👈 necesario para ir atrás

import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonDatetime, 
  IonButton, 
  IonButtons 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro-cita',
  templateUrl: 'registro-cita.page.html',
  styleUrls: ['registro-cita.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonDatetime,
    IonButton, IonButtons
  ],
})
export class RegistroCitaPage {
  citaForm: FormGroup;

  especialidades: string[] = [
    'Cardiología', 'Dermatología', 'Neurología', 'Oftalmología', 'Pediatría'
  ];

  clinicas: string[] = [
    'Clínica Central', 'Clínica Norte', 'Clínica Sur', 'Clínica Oriente'
  ];

  constructor(private fb: FormBuilder, private router: Router, private location: Location) {
    this.citaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rut: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      especialidad: ['', Validators.required],
      clinica: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }

  registrarCita() {
    if (this.citaForm.valid) {
      console.log('✅ Cita registrada:', this.citaForm.value);
      alert('✅ Cita registrada con éxito');
      this.citaForm.reset();
    } else {
      alert('⚠️ Por favor, completa todos los campos obligatorios');
    }
  }

  volver() {
    this.location.back(); // 👈 vuelve a la página anterior
  }
}
