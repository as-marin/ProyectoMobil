import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
})
export class TeacherPage implements OnInit {

  classes = [
    { name: 'Ingeniería de Software', hour: 'Martes 17:30 - 18:30 hrs.', avatar: 'assets/img/john-doe.png' },
    { name: 'Programación de algoritmos', hour: 'Martes 19:00 - 19:45 hrs.', avatar: 'assets/img/jane-smith.png' },
  ];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  viewUserDetails(user: any) {
    console.log('User details:', user);
  }

}
