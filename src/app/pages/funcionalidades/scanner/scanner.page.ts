import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { formatDate } from '@angular/common';
import { QRCodeComponent } from "angularx-qrcode";
import { NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  classForm: FormGroup;
  sections: any[] = []; // Populate with actual sections from Firestore
  qrCodeData: string | null = null;

  constructor(private fb: FormBuilder, private firestore: AngularFirestore,private navCtrl: NavController) {
    this.classForm = this.fb.group({
      section: ['']
    });
  }

  ngOnInit() {
    this.fetchSections();
  }

  fetchSections() {
    // Fetch sections from Firestore
    this.firestore.collection('sections').valueChanges({ idField: 'sectionID' })
      .subscribe((sections: any[]) => {
        this.sections = sections;
      });
  }


  async getCurrentPosition() {
    const position = await Geolocation.getCurrentPosition();
    const profeLatitude = position.coords.latitude;
    const profeLongitude = position.coords.longitude;
    return { profeLatitude, profeLongitude };
  }

  async generateQrCode() {
    const sectionId = this.classForm.get('section')?.value;
    const classDate = formatDate(new Date(), 'dd-MM-yyyy', 'en');
    
    // Obtener la posición actual del profesor
    const position = await this.getCurrentPosition();
    const profeLatitude = position.profeLatitude;
    const profeLongitude = position.profeLongitude;
  
    if (sectionId) {
      this.qrCodeData = JSON.stringify({
        sectionId,
        classDate,
        profeLatitude,
        profeLongitude,
      });
    } else {
      console.error("No section selected!");
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
