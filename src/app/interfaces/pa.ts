import * as FirebaseFirestore from 'firebase/firestore';

  export interface Step {
    exercise_id: string;
    duration: number;
    exercise?: Exercise;
}

export interface Exercise {
    exercise_id: string;
    name: string;
    description: string;
    location: string[];
    equipment: string;
    mode_of_exercise: string;
    body_regions: string;
    movement: string;
    difficulty_level: number;
    video_url?: string;
}

export interface Workout {
    workout_id: string;
    name: string;
    description: string;
    workout_type: string;
    steps: Array<Step>;
    default_duration: number;
    difficulty_level: number;
}

  export interface Timestamp {
    nanoseconds: number;
    seconds: number;
}