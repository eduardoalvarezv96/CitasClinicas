import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DatabaseService } from '../services/database-service'; // Servicio para SQLite

// Importaciones Standalone de Ionic
import { 
 ToastController, 
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

 constructor(
 private fb: FormBuilder, 
 private router: Router, 
 private location: Location,
 private toastController: ToastController, 
 private dbService: DatabaseService 
) {
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


 async registrarCita() {
  if (this.citaForm.valid) {
   const citaData = this.citaForm.value;
   
   
   const paciente = `${citaData.nombre} ${citaData.apellido}`;
   const especialidad = citaData.especialidad;
   const fechaCita = new Intl.DateTimeFormat('es-CL', { 
            dateStyle: 'short' 
        }).format(new Date(citaData.fecha));

   const accion = `Cita registrada para ${paciente} con ${especialidad} en ${citaData.clinica} el ${fechaCita}`;
   
 
   await this.dbService.addAccion(accion);
   

   console.log('✅ Cita registrada (y acción guardada localmente):', citaData);
      
   this.presentToast('✅ Cita registrada con éxito. Verifique su historial local.', 'success');
   
   this.citaForm.reset();
  } else {
   this.citaForm.markAllAsTouched();
   this.presentToast('⚠️ Por favor, completa todos los campos obligatorios', 'warning');
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
 

 async presentToast(message: string, color: string) {
  const toast = await this.toastController.create({
   message: message,
   duration: 3000,
   color: color
  });
  toast.present();
 }
}