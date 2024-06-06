import { Timestamp } from './timestamp';
import * as FirebaseFirestore from 'firebase/firestore';

export interface Appointment {
    appointment_id: string;
    appointment_type: string;
    appointment_end_time: Timestamp;
    appointment_start_time: Timestamp;
    creation_date: Timestamp;
    description: string;
    health_coach_id: FirebaseFirestore.DocumentReference;
    last_modified_date: Timestamp;
    member_id: FirebaseFirestore.DocumentReference;
    notes?: string;
    status: string;
}