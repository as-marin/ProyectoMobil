import { Injectable } from '@angular/core';
import { getAuth, updateEmail, reauthenticateWithCredential, EmailAuthProvider, User, sendEmailVerification } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = this.angularFirestore;
  private auth = getAuth();
  lastAttendance: any;

  constructor(private angularFirestore: AngularFirestore) { }

  async modifyUserName(newName: string, userId: string): Promise<void> {
    try {
      // Actualiza el nombre en la base de datos de Firestore
      const userRef = this.firestore.collection('users').doc(userId);
      await userRef.update({ name: newName });
      
      console.log('Nombre actualizado correctamente');
    } catch (error) {
      console.error('Error al modificar el nombre:', error);
      throw error;
    }
  }

    // Método para sincronizar datos offline con Firestore
    async syncOfflineData(): Promise<void> {
      const offlineData = JSON.parse(localStorage.getItem('offlineAttendance') || '[]');
      if (offlineData.length === 0) {
        console.log('No hay datos para sincronizar.');
        return;
      }
  
      for (const record of offlineData) {
        try {
          const { sectionId, classDate, attendanceData } = record;
          const attendancePath = `sections/${sectionId}/attendance`;
  
          await this.firestore.collection(attendancePath).doc(classDate).set(attendanceData, { merge: true });
          console.log(`Datos sincronizados para la sección ${sectionId}, fecha ${classDate}`);
        } catch (error) {
          console.error('Error al sincronizar datos:', error);
        }
      }
  
      localStorage.removeItem('offlineAttendance');
    }
  
    // Método para obtener la última asistencia
    // Método para obtener la última asistencia
    fetchLastAttendance(uid: string, email: string): void {
      this.syncOfflineData();
  
      this.firestore.collection('sections').snapshotChanges().subscribe(sectionsSnapshot => {
        let lastRecord = null;
  
        const promises = sectionsSnapshot.map(async (sectionDoc: any) => {
          const sectionId = sectionDoc.payload.doc.id;
          const sectionData = sectionDoc.payload.doc.data() as { name?: string };
  
          this.firestore.collection(`sections/${sectionId}/attendance`).snapshotChanges().subscribe(attendanceSnapshot => {
            attendanceSnapshot.forEach((recordDoc: any) => {
              const recordData = recordDoc.payload.doc.data();
              if (recordData[email] && recordData[email].uid === uid) {
                const studentData = recordData[email];
  
                const timestamp =
                  typeof studentData.timestamp === 'string'
                    ? new Date(studentData.timestamp)
                    : studentData.timestamp.toDate();
  
                if (!lastRecord || lastRecord.timestamp < timestamp) {
                  lastRecord = {
                    sectionName: sectionData.name || 'Unknown Section',
                    date: studentData.date,
                    timestamp: timestamp,
                  };
                }
              }
            });
  
            this.lastAttendance = lastRecord;
          });
        });
  
        Promise.all(promises).then(() => {
          // Aquí puedes realizar cualquier acción adicional con lastAttendance
          console.log('Última asistencia actualizada:', this.lastAttendance);
        });
      });
    }
}
