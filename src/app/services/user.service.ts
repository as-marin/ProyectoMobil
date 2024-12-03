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
    async fetchLastAttendance(uid: string, email: string): Promise<any> {
      let lastRecord = null;
    
      // Sincroniza datos locales con Firestore antes de buscar
      await this.syncOfflineData();
    
      // Obtiene todas las secciones
      const sectionsSnapshot = await this.firestore.collection('sections').get().toPromise();
    
      const promises = sectionsSnapshot.docs.map(async (section) => {
        const sectionId = section.id;
        const sectionData = section.data() as { name?: string };
    
        // Obtiene registros de asistencia para cada sección
        const attendanceSnapshot = await this.firestore.collection(`sections/${sectionId}/attendance`).get().toPromise();
    
        attendanceSnapshot.docs.forEach((record) => {
          const recordData = record.data();
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
      });
    
      // Espera a que todas las secciones sean procesadas
      await Promise.all(promises);
    
      return lastRecord || null;
    }
}
