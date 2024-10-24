import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tests-not-found',
  templateUrl: './tests-not-found.page.html',
  styleUrls: ['./tests-not-found.page.scss'],
})
export class TestsNotFoundPage {

  constructor(private navCtrl: NavController) { }

  async verificarUbicacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const latitud = coordinates.coords.latitude;
      const longitud = coordinates.coords.longitude;

      this.compararCoordenadas(latitud, longitud);
    } catch (error) {
      console.log('Error obteniendo la ubicación', error);
    }
  }

  compararCoordenadas(latitud: number, longitud: number) {
    const centroEducacional = { lat: -36.79514625608453, lng: -73.06263717662237 };
    const rangoAceptable = 0.02; // Ajusta según tus necesidades

    const dentroDelRango = (
      Math.abs(latitud - centroEducacional.lat) < rangoAceptable &&
      Math.abs(longitud - centroEducacional.lng) < rangoAceptable
    );

    if (dentroDelRango) {
      this.iniciarEscaneoQR();
    } else {
      console.log('Fuera del rango aceptable');
      // Puedes mostrar un mensaje al usuario si lo deseas
    }
  }

  iniciarEscaneoQR() {
    // Lógica para iniciar el escaneo de QR
    console.log('Iniciando escaneo QR...');
    // Aquí puedes llamar a la función de escaneo QR
  }

  ngOnInit() {
    this.verificarUbicacion();
  }

  goBack() {
    this.navCtrl.back();
  }
  
}
