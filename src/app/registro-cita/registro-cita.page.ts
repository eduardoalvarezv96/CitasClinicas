import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// Importamos Cita para tipificar, aunque no es estrictamente necesario aquí
import { DatabaseService } from '../services/database-service'; 

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
 // Eliminadas las importaciones de Card si no se usan en el HTML
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
   
   // 1. Registrar la CITA ESTRUCTURADA en la tabla 'citas'
   try {
       await this.dbService.addCita(citaData);
   } catch (error) {
       console.error('Error al guardar la cita estructurada:', error);
       this.presentToast('⚠️ Error al guardar la cita en la base de datos.', 'danger');
       return; // Detener si falla la inserción principal
   }
   
   // 2. Registrar la ACCIÓN (LOG) en la tabla 'acciones'
   const paciente = `${citaData.nombre} ${citaData.apellido}`;
   const especialidad = citaData.especialidad;
   
   // Formatear la fecha para el mensaje de log
   const fechaCita = new Intl.DateTimeFormat('es-CL', { 
    }).format(new Date(citaData.fecha));

   const accion = `Cita registrada para ${paciente} con ${especialidad} en ${citaData.clinica} el ${fechaCita} a las ${citaData.hora}`;
   
   await this.dbService.addAccion(accion);
   

   console.log('✅ Cita registrada (y acción guardada localmente):', citaData);
      
   this.presentToast('✅ Cita registrada con éxito. Verifique su historial y lista de citas.', 'success');
   
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