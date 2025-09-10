import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
  IonButtons, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent 
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
    IonButton, IonButtons,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent
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
      this.citaForm.markAllAsTouched();
      alert('⚠️ Por favor, completa todos los campos obligatorios');
    }
  }

  async openDatetime(datetime: any) {
    if (datetime) {
      await datetime.present();
    }
  }

  volver() {
    this.location.back();
  }
}