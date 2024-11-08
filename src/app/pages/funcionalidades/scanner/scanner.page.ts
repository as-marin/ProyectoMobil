import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { formatDate } from '@angular/common';
import { QRCodeComponent } from "angularx-qrcode";

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  classForm: FormGroup;
  sections: any[] = []; // Populate with actual sections from Firestore
  qrCodeData: string | null = null;

  constructor(private fb: FormBuilder, private firestore: AngularFirestore) {
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

  generateQrCode() {
    const sectionId = this.classForm.get('section')?.value;
    const classDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    if (sectionId) {
      this.qrCodeData = JSON.stringify({
        sectionId,
        classDate,
      });
    } else {
      console.error("No section selected!");
    }
  }
}
