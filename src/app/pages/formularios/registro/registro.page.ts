import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  onSubmit(){
    console.log('hello');
  }

  goBack() {
    this.navCtrl.back();
  }
}
