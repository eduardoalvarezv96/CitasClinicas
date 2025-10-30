import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createAnimation } from '@ionic/angular'; // ✅ createAnimation importado
import { 
  IonToast, 
  IonItem, 
  IonButton, 
  IonInputPasswordToggle, 
  IonInput 
} from '@ionic/angular/standalone';

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
  isToastOpen = false;
  
  // 1. ¡NUEVO! Propiedad para el mensaje de error del toast
  toastMensaje: string = 'Usuario o clave incorrectas'; 

  // 4. Se usa ElementRef para acceder al elemento DOM para la animación
  @ViewChild('emailItem', { read: ElementRef }) emailItem!: ElementRef; 
  @ViewChild('passwordItem', { read: ElementRef }) passwordItem!: ElementRef; 

  constructor(private router: Router) { }

  ngOnInit() {
    sessionStorage.setItem('isLoggedIn', 'false');
  }

  login(event: Event) {
    event.preventDefault();
    
    // 2. ¡NUEVO! Validación de campos vacíos
    if (!this.email || !this.password) {
      this.toastMensaje = 'Por favor, ingresa correo y clave.';
      this.isToastOpen = true;
      this.animateError();
      return;
    }

    // Lógica de autenticación
    if (this.email === 'eduardo@gmail.com' && this.password === '123456') {
      this.animateSuccess();
      
      // La redirección ocurre después de la animación
      setTimeout(() => {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', this.email);
        // Guardar el nombre de usuario "Eduardo" para la página home
        localStorage.setItem('usuario', 'Eduardo'); 
        this.router.navigateByUrl('/home');
      }, 600); // 600ms para que la animación termine (400ms + buffer)
      
    } else {
      this.toastMensaje = 'Usuario o clave incorrectos.';
      this.animateError();
      this.isToastOpen = true;
    }
  }

  // Las funciones de animación ahora referencian los items
  animateSuccess() {
    // Si la referencia no está lista, salimos
    if (!this.emailItem || !this.passwordItem) return;

    const animation = createAnimation()
      // Usamos los elementos <ion-item> que son más fáciles de referenciar
      .addElement(this.emailItem.nativeElement) 
      .addElement(this.passwordItem.nativeElement)
      .duration(400)
      .keyframes([
        { offset: 0, transform: 'scale(1)', background: 'transparent' },
        { offset: 0.5, transform: 'scale(1.03)', background: '#d4edda' }, // Fondo verde suave
        { offset: 1, transform: 'scale(1)', background: 'transparent' }
      ]);

    animation.play();
  }

  animateError() {
    // Si la referencia no está lista, salimos
    if (!this.emailItem || !this.passwordItem) return;

    const animation = createAnimation()
      .addElement(this.emailItem.nativeElement)
      .addElement(this.passwordItem.nativeElement)
      .duration(100)
      .iterations(3) // 3 sacudidas
      .keyframes([
        { offset: 0, transform: 'translateX(0px)' },
        { offset: 0.25, transform: 'translateX(-10px)' },
        { offset: 0.5, transform: 'translateX(10px)' },
        { offset: 0.75, transform: 'translateX(-10px)' },
        { offset: 1, transform: 'translateX(0px)' }
      ]);

    animation.play();
  }
}