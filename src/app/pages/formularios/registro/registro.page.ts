import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  loginData = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  constructor(private navCtrl: NavController, private router: Router) { }

  ngOnInit() {
  }

  validateEmail(emailField: NgModel) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.loginData.email)) {
      emailField.control.setErrors({ invalidEmail: true });
    } else {
      emailField.control.setErrors(null);
    }
  }

  onSubmit(formularioRegistro: NgForm) {
    if (formularioRegistro.valid && this.loginData.password === this.loginData.confirmPassword) {
      console.log('Formulario válido:', this.loginData);
      this.router.navigate(['/login']);
    } else {
      console.log('Formulario no válido o contraseñas no coinciden');
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
