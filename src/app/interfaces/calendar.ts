export interface EventSource {
    events: Event[];
}

export interface Event {
    title: string;
    startTime: Date;
    endTime: Date;
    allDay: boolean;
    category?: string;
}