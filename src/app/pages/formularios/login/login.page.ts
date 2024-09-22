import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
  constructor(private navCtrl: NavController) {}  

  ngOnInit() {}

  onSubmit() {
    console.log('hello');
  }


  goBack() {
    this.navCtrl.back();
  }
}