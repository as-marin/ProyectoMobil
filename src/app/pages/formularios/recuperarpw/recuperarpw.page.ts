import { FireService } from './../../../services/fire.service';
import { Component, OnInit, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup, NgForm, NgModel, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/usuario.model';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-recuperarpw',
  templateUrl: './recuperarpw.page.html',
  styleUrls: ['./recuperarpw.page.scss'],
})
export class RecuperarpwPage implements OnInit {

  loginForm= new FormGroup({
    email:new FormControl('', [Validators.required, Validators.email]),
  });
  constructor(private navCtrl: NavController, private router: Router,) {}  

  firebaseservice = inject(FireService);
  utilservice = inject(UtilsService)

  ngOnInit() {}


  async submit() {
    if (this.loginForm.valid) {

      const loading = await this.utilservice.loading();
      await loading.present();  

      this.firebaseservice.sendRecoveryEmail(this.loginForm.value.email).then( res =>{


        this.utilservice.presentToast({
          message: 'Correo enviado',
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        })


        this.utilservice.routerLink('/login')
        this.loginForm.reset


      }).catch(error => {
        console.log(error);

        this.utilservice.presentToast({
          message: error.message,
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() =>  {
        loading.dismiss()
      })
    }
  }
   

  goBack() {
    this.navCtrl.back();
  }







}
