import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service'; 
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  user: any;

  constructor(
    private navCtrl: NavController,
    private utilservice: UtilsService,
    private fireService: FireService 
  ) {}

  ngOnInit() {
    this.user = this.utilservice.getFromLocalStorage('user');
  }

  goBack() {
    this.navCtrl.back();
  }

  async logout() {
    await this.fireService.logout();
    this.utilservice.clearLocalStorage(); // Limpia los datos locales
    this.navCtrl.navigateRoot('/login'); // Redirige al login
  }
}
