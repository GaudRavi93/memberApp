import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CalendarMode, IEvent } from 'ionic2-calendar/calendar.interface';
import { AppointmentService } from 'src/app/services/appointment.service';
import { CalendarComponent } from 'ionic2-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, OnDestroy {
  private appointmentsSubscription: Subscription = new Subscription();
  events: IEvent[] = [];
  
  calendar = {
    mode: 'day' as CalendarMode,
    currentDate: new Date()
  };

  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;
  viewTitle!: string;
  
  private initialAppointments: IEvent[] = [
    {
      title: 'Event 1',
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      allDay: false
    },
    {
      title: 'Event 2',
      startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
      endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 1)),
      allDay: false
    }
  ];
  
  private appointmentsSubject: BehaviorSubject<IEvent[]> = new BehaviorSubject<IEvent[]>(this.initialAppointments);
  appointments$: Observable<IEvent[]> = this.appointmentsSubject.asObservable();  
  
  constructor(
    private appointmentService: AppointmentService
  ) { }

  ngOnInit() {
    this.loadAppointments();
    this.appointmentsSubscription = this.appointments$.subscribe(appointments => {
      this.events = appointments;
    });
  }

  ngOnDestroy() {
    this.appointmentsSubscription.unsubscribe();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().pipe(
      map(appointments => appointments.map(appointment => ({
        title: appointment.description,
        startTime: new Date(appointment.appointment_start_time.seconds * 1000),
        endTime: new Date(appointment.appointment_end_time.seconds * 1000),
        allDay: false
      }))),
      startWith(this.initialAppointments)
    ).subscribe(appointments => {
      this.appointmentsSubject.next(appointments);
      this.events = appointments;
    });
  }

  back() {
    this.calendarComponent.slidePrev();
  }

  next() {
    this.calendarComponent.slideNext();
  }

  onViewTitleChanged(title: string) {
    this.viewTitle = title;
  }
}