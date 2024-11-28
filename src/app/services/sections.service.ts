import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class SectionsService {

    constructor(private firestore: AngularFirestore) { }

    // Obtener las secciones disponibles en Firestore
    getSections(uid: string): Observable<any[]> {
        return this.firestore.collection(`users/${uid}/sections`).snapshotChanges().pipe(
            map(sections => sections.map(section => {
                const data = section.payload.doc.data() as { nombre?: string };
                //console.log('Datos de la sección:', data); // Depuración
                return { ...data };
            }))
        );
    }

    getAllSections(): Observable<any[]> {
        return this.firestore.collection('sections').snapshotChanges().pipe(
            map(sections => sections.map(section => {
                const data = section.payload.doc.data() as { nombre?: string };
                //console.log('Datos de la sección:', data); // Depuración
                return { ...data };
            }))
        );
    }

    // Inscribir a un usuario en una sección
    async enrollInSection(uid: string, sectionId: string): Promise<void> {
        const userRef = this.firestore.collection(`users/${uid}/sections`);
        await userRef.doc(sectionId).set({ enrolled: true });
    }

}
