import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-tests-not-found',
  templateUrl: './tests-not-found.page.html',
  styleUrls: ['./tests-not-found.page.scss'],
})
export class TestsNotFoundPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }
}
