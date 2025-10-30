import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonToast, IonItem, IonButton, IonInputPasswordToggle, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonItem, IonButton, IonInput, IonInputPasswordToggle, IonToast]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  isToastOpen: boolean = false;
  toastMensaje: string = ''

  constructor(private router: Router) {}

  ngOnInit() {
  }

  login() {

    if(this.email === ''){
      this.toastMensaje = 'Ingrese el correo';
      this.isToastOpen = true;
      return;
    }

    if(this.password === ''){
      this.toastMensaje = 'Ingrese la clave';
      this.isToastOpen = true;
      return;
    }

    if (this.email === 'eduardo@gmail.com' && this.password === '123456') {
      // Guardar el nombre de usuario en localStorage
      localStorage.setItem('usuario', 'Eduardo');
      this.router.navigateByUrl('/home');
    } else {
      this.isToastOpen = true;
      this.toastMensaje = 'Usuario o clave incorrectas'
    }
  }

}