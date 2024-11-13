import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

  private allowedRange = 10; // Rango permitido en metros
  isSupported = false;
  barcodes: Barcode[] = [];
  studentData: any; // Reemplazar el valor inicial con datos del estudiante logueado
  scannedQrData: any;

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private utilService: UtilsService,
    private navCtrl: NavController
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

  goBack() {
    this.navCtrl.back();
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
      // Paso 1: Obtener la posición actual del estudiante
      const { studentLatitude, studentLongitude } = await this.getCurrentPosition();
  
      // Paso 2: Escanear el QR
      const scannedQrData = await this.scan(); // Esto ya devuelve los datos del QR, no lo llames de nuevo aquí
  
      if (!scannedQrData) {
        return; // Si no hay datos de QR, retorna sin hacer nada
      }
  
      // Paso 3: Extraer las coordenadas del profesor desde el QR
      const profeLatitude = scannedQrData.profeLatitude;
      const profeLongitude = scannedQrData.profeLongitude;
  
      if (profeLatitude === undefined || profeLongitude === undefined) {
        await this.presentAlert('Error', 'El QR no contiene coordenadas válidas del profesor.');
        return;
      }
  
      // Paso 4: Calcular la distancia entre el estudiante y el profesor
      const distance = this.getDistanceFromLatLonInMeters(
        profeLatitude,
        profeLongitude,
        studentLatitude,
        studentLongitude
      );
  
      // Paso 5: Verificar si está dentro del rango permitido
      if (distance <= this.allowedRange) {
        console.log("Estás dentro del rango permitido. Puedes registrar la asistencia.");
        await this.saveAttendance(scannedQrData.sectionId, scannedQrData.classDate); // Llamar a saveAttendance con los datos del QR
      } else {
        console.log("Estás fuera del rango permitido. Acércate al profesor.");
        await this.presentAlert('Fuera de rango', 'Estás fuera del rango permitido. Acércate al profesor.');
      }
    } catch (error) {
      console.error("Error al obtener la ubicación o al escanear el QR:", error);
      await this.presentAlert('Error', 'Ocurrió un error al intentar escanear el QR o obtener la ubicación.');
    }
  }
  
  async scan(): Promise<any> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert('Permiso denegado', 'Para usar la aplicación autorizar los permisos de cámara');
      return null; // Si no se obtiene permiso, retornamos null
    }
  
    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length > 0) {
      try {
        const qrData = JSON.parse(barcodes[0].displayValue); // Asume que el QR contiene datos en formato JSON
        const { sectionId, classDate, profeLatitude, profeLongitude } = qrData;
  
        // Verifica que la fecha de la clase sea válida
        const currentDate = new Date();
        const classDateParts = classDate.split('-'); // '13-11-2024' -> ['13', '11', '2024']
        const classDateObj = new Date(Number(classDateParts[2]), Number(classDateParts[1]) - 1, Number(classDateParts[0]));
  
        if (classDateObj.toDateString() !== currentDate.toDateString()) {
          console.log("La clase no está programada para hoy.");
          await this.presentAlert('Fecha inválida', 'El código QR no corresponde a la clase de hoy.');
          return null; // Si la fecha no es válida, retornamos null
        }
  
        // Almacena los datos escaneados en scannedQrData y retorna los datos
        return { sectionId, classDate, profeLatitude, profeLongitude };
      } catch (error) {
        console.error("Error al procesar el código QR:", error);
        await this.presentAlert('Error', 'El código QR escaneado es inválido.');
        return null; // Si hay un error, retornamos null
      }
    } else {
      console.log("No se pudo escanear el QR.");
      return null; // Si no se escaneó ningún código, retornamos null
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
