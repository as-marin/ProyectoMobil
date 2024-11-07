import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service'; 
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
})
export class TeacherPage implements OnInit {
  user: any;
  
  classes = [
    { name: 'Ingeniería de Software', hour: 'Martes 17:30 - 18:30 hrs.', avatar: 'assets/img/john-doe.png' },
    { name: 'Programación de algoritmos', hour: 'Martes 19:00 - 19:45 hrs.', avatar: 'assets/img/jane-smith.png' },
  ];

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


  viewUserDetails(user: any) {
    console.log('User details:', user);
  }
}
