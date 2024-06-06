export interface Task {
    task_id: string;
    user_id: string; //  identifier to the member associated with the task
    name: string; // Name of the task
    description: string; // Description of the task
    task_type: string; // Task category (e.g. HealthCheck, Medication, Nutrition, Workout)
    status: string; // Status of the task (e.g. pending, completed, skipped, canceled)
    scheduled_start_time: Date; // The scheduled date & time the task starts on
    scheduled_end_time: Date; // The scheduled date & time the task ends on
    creation_date: Date; // Date & time when the task was created
    last_modified_date: Date; // When the event was last modified
    completion_time?: Date; // The actual completion time of the task
    task_info: {
        medication_id?: string; // Reference to unique medication ID, if applicable
        habits_id?: string; // Reference to unique habits protocol ID, if applicable
        workout_id?: string; // Reference to unique workout ID, if applicable
        link_to_external_calendars?: string; // Link to external calendar integration (e.g. Google or Apple Calendar)
    };
}