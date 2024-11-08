import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  private campusLatitude = -36.795334554350454;
  private campusLongitude = -73.06218485219422;
  private allowedRange = 1000; // Rango permitido en metros
  isSupported = false;
  barcodes: Barcode[] = [];
  studentData: any; // Reemplazar el valor inicial con datos del estudiante logueado

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    // Verificar si BarcodeScanner es compatible
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    // Cargar los datos del estudiante logueado
    this.studentData = this.utilService.getFromLocalStorage('user');
  }

  async getCurrentPosition() {
    const position = await Geolocation.getCurrentPosition();
    const studentLatitude = position.coords.latitude;
    const studentLongitude = position.coords.longitude;
    return { studentLatitude, studentLongitude };
  }

  getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en metros
    return distance;
  }

  async isWithinAllowedRange() {
    try {
      const { studentLatitude, studentLongitude } = await this.getCurrentPosition();
      const distance = this.getDistanceFromLatLonInMeters(
        this.campusLatitude,
        this.campusLongitude,
        studentLatitude,
        studentLongitude
      );

      if (distance <= this.allowedRange) {
        console.log("Estás dentro del rango permitido. Ahora puedes escanear el QR.");
        await this.scan();
      } else {
        console.log("Estás fuera del rango permitido. Acércate a la sede.");
        await this.presentAlert('Fuera de rango', 'Estás fuera del rango permitido. Acércate a la sede.');
      }
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      await this.presentAlert('Error', 'No se pudo obtener la ubicación.');
    }
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert('Permiso denegado', 'Para usar la aplicación autorizar los permisos de cámara');
      return;
    }
    
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    // Procesa los datos del QR escaneado
    if (barcodes.length > 0) {
      try {
        const qrData = JSON.parse(barcodes[0].displayValue); // Asume que el QR contiene datos en formato JSON
        const { sectionId, classDate } = qrData;

        // Guardar asistencia en Firestore
        await this.saveAttendance(sectionId, classDate);
      } catch (error) {
        console.error("Error al procesar el código QR:", error);
        await this.presentAlert('Error', 'El código QR escaneado es inválido.');
      }
    }
  }

  async saveAttendance(sectionId: string, classDate: string) {
    try {
      // Definir la ruta a la subcolección de asistencia de la sección
      const attendancePath = `sections/${sectionId}/attendance`;

      // Usa la fecha de la clase como ID de documento
      await this.firestore
        .collection(attendancePath)
        .doc(classDate)
        .set(
          {
            [this.studentData.email]: {
              ...this.studentData,
              timestamp: new Date(), // Opcional: marca la hora de escaneo
            }
          },
          { merge: true } // Combina con el documento existente si ya existe
        );

      console.log('Asistencia registrada con éxito.');
      await this.presentAlert('Éxito', 'Asistencia registrada.');
    } catch (error) {
      console.error('Error al guardar la asistencia:', error);
      await this.presentAlert('Error', 'No se pudo registrar la asistencia.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
