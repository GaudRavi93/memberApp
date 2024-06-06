import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData, doc, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Appointment } from '../interfaces/appointment'; 
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private collectionRef: CollectionReference;
  private appointments: BehaviorSubject<Appointment[]> = new BehaviorSubject<Appointment[]>([]);
  private appointmentsSub!: Subscription; 

  constructor(
    private firestore: Firestore,
    private auth: Auth) {
      this.collectionRef = collection(this.firestore, 'appointments');

      // When the user logs in, we want to get their appointments
      onAuthStateChanged(this.auth, (user) => {
        if(user) {
          this.subscribeToAppointments(user.uid);          
        }
        else {
          // If the user logs out, clear the appointments
          this.unsubscribeFromAppointments();
        }
      });
  }

  subscribeToAppointments(userId: string) {
    // Get the member reference because the appointments collection has a member_id field which is a DocumentReference to the member
    const memberRef = doc(this.firestore, 'members', userId);

    // Get the appointments for the member
    const appointmentsQuery = query(this.collectionRef, where('member_id', '==', memberRef));

    // Use rxfire's collectionData to get the appointments as an observable
    const collectionSub = collectionData(appointmentsQuery, {
      idField: 'appointment_id'
    }) as Observable<Appointment[]>;

    // Subscribe to the observable and update the appointments BehaviorSubject
    this.appointmentsSub = collectionSub.subscribe(appointments => {
      this.appointments.next(appointments);
    });
  }

  unsubscribeFromAppointments() {
    this.appointments.next([]);
    this.appointmentsSub.unsubscribe();
  }


  getAppointments() {
    return this.appointments.asObservable();
  }
}