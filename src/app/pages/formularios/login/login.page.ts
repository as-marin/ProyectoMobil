import { FireService } from './../../../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup, NgForm, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm= new FormGroup({
    email:new FormControl([Validators.required, Validators.email]),
    password:new FormControl([Validators.required])
  });
  constructor(private navCtrl: NavController, private router: Router, private fires:FireService) {}  

  ngOnInit() {}

   async onSubmit(){
    try {
      const {email,password} = this.loginForm.value;
      await this.fires.login(email,password!);
    } catch (error) {
      
    }

  }


  goBack() {
    this.navCtrl.back();
  }
}