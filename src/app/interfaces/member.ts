import * as FirebaseFirestore from 'firebase/firestore';

export interface User {
    user_id: FirebaseFirestore.DocumentReference;
    first_name: string;
    last_name: string;
    date_of_birth?: string;
    email: string;
    phone_number: string;
    creation_date: Date;
    last_modified_date: Date;
}

export interface Member extends User {
    address?: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
    };
}

export interface HealthCoach extends User {
    assigned_members?: FirebaseFirestore.DocumentReference[];
}

export interface MemberHealthCoachAssignment {
    member_id: FirebaseFirestore.DocumentReference;
    health_coach_id: string;
    assignment_date: Date;
    unassignment_date?: Date;
    workout_protocol_ids:Array<string>;
    nutrition_protocol_ids:Array<string>;
    task_ids:Array<string>;
}
