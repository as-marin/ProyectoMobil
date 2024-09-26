import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  users = [
    { name: 'John Doe', email: 'john.doe@example.com', avatar: 'assets/img/john-doe.png' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'assets/img/jane-smith.png' },
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
