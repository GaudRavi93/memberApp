export interface Habit {
    habit_id:  string;
    member_id: string; // Unique identifier for the associated member

    start_date: Date; // Date & time the protocol starts
    end_date: Date; // Date & time the protocol ends
    frequency?: {
        days: {
            sunday: boolean;
            monday: boolean;
            tuesday: boolean;
            wednesday: boolean;
            thursday: boolean;
            friday: boolean;
            saturday: boolean;
        }
        hours: number; // Hours of the day (0-23)
        minutes: number; // Minutes of the hour (0-59)
    }

    name: string; // Name of the nutrition protocol
    description: string; // Description of the nutrition protocol and why it is important
    goal: string; // End goal that the protocol contributes towards (e.g. “lose 5-7% of body weight)

    completion_status: string; // Status of the protocol (e.g. pending, completed, skipped, canceled)

    list_of_tasks: string[]; // List of tasks associated with the protocol

    creation_date: Date; // Date & time when the protocol was created
    last_modified_date: Date; // Date & time when the protocol was last updated
}
