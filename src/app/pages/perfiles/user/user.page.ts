import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service'; 
import { FireService } from 'src/app/services/fire.service';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  user: any;
  Attendance: any;

  constructor(
    private navCtrl: NavController,
    private utilservice: UtilsService,
    private fireService: FireService 
  ) {}

  ngOnInit() {
    this.user = this.utilservice.getFromLocalStorage('user');
    this.getStudentAttendance(this.user.uid, this.user.email);
  }

  goBack() {
    this.navCtrl.back();
  }

  async logout() {
    await this.fireService.logout();
    this.utilservice.clearLocalStorage(); // Limpia los datos locales
    this.navCtrl.navigateRoot('/login'); // Redirige al login
  }

  async getStudentAttendance(sectionID: string, studentID: string) {
    // Inicializa Firestore
    const db = getFirestore();
  
    // Ruta hacia la subcolección `attendance` dentro de la sección específica
    const attendanceRef = collection(db, "sections", sectionID, "attendance");
  
    // Filtra por el ID del estudiante
    const q = query(attendanceRef, where("studentID", "==", studentID));
  
    try {
      // Ejecuta la consulta
      const querySnapshot = await getDocs(q);
  
      // Recorre los resultados (puede devolver varias fechas de asistencia)
      const attendanceRecords: any[] = [];
      querySnapshot.forEach((doc) => {
        attendanceRecords.push({ id: doc.id, ...doc.data() });
      });
  
      // Retorna los registros de asistencia
      return attendanceRecords;
    } catch (error) {
      console.error("Error al obtener la asistencia:", error);
      throw new Error("No se pudo obtener la asistencia del alumno.");
    }
  }
}
