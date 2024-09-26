import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  constructor(private navCtrl: NavController, private router: Router) {}  

  ngOnInit() {}

  validateEmail(emailField: NgModel) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.loginData.email)) {
      emailField.control.setErrors({ invalidEmail: true });
    } else {
      emailField.control.setErrors(null);
    }
  }

  onSubmit(formularioLogin: NgForm) {
    if (formularioLogin.valid) {
      console.log('Formulario válido:', this.loginData);
      this.router.navigate(['/user']);
    } else {
      console.log('Formulario no válido');
    }
  }


  goBack() {
    this.navCtrl.back();
  }
}