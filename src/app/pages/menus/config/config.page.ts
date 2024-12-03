import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  user: any;
  newName: string = '';
  currentPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private navCtrl: NavController,
    private utilservice: UtilsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.utilservice.getFromLocalStorage('user');
  }

  async updateEmail() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newName || !this.currentPassword) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    try {
      await this.userService.modifyUserName(this.newName, this.currentPassword);
      this.successMessage = 'Correo electrónico actualizado con éxito.';
      // Opcional: Actualizar localStorage o recargar el usuario
    } catch (error) {
      this.errorMessage = 'Error al actualizar el correo: ' + error.message;
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
