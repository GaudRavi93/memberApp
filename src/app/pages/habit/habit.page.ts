import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent, CalendarMode, Step } from 'ionic2-calendar';
import { tap } from 'rxjs';
import { HabitService } from 'src/app/services/habit.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-habit',
  templateUrl: './habit.page.html',
  styleUrls: ['./habit.page.scss'],
})
export class HabitPage implements OnInit {
  @ViewChild(CalendarComponent) myCalendar!: CalendarComponent;
  habit_id: any;
  habit_details: any;
  task_details: any;
  eventSource: any = [];
  currentMonth: string = '';
  currentDate: Date = new Date();
  calendar = {
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date()
  };

  constructor(
    private habitService: HabitService,
    private taskService: TasksService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.habit_id = params.get('habitId');
      if (this.habit_id) {
        this.habitService.retrieveHabit(this.habit_id);
        this.habitService.habits$.pipe(
          tap(async (habit) => {
            if (habit.length != 0) {
              this.eventSource = [];
              this.habit_details = habit;
              this.habit_details.complianceAllTime = '0%';
              this.habit_details.compliance7days = '0%';
              this.habit_details.longestStreak = 0;
              this.habit_details.currentStreak = 0;
              this.getAllTask();
            }
          })
        ).subscribe();
      }
    });
  }

  ngAfterViewInit() {
    if (this.myCalendar) {
      this.currentDate = this.myCalendar.currentDate;
    }
  }

  // get the task details and calculate compliance and streak
  getAllTask() {
    this.task_details = [];
    this.taskService.tasks$.subscribe(async (task) => {
      // filter to get the task related to selected habit
      this.task_details = task.filter(task => task.task_info.habits_id === this.habit_id);

      //  sorting in ascending order
      this.task_details.sort((a: any, b: any) => a.scheduled_start_time.localeCompare(b.scheduled_start_time));
      this.habit_details.complianceAllTime = this.calculateCompliance(this.task_details);
      this.habit_details.compliance7days = this.getTasksForLast7Days(this.task_details);
      this.habit_details.longestStreak = this.calculateStreak(this.task_details);
      this.habit_details.currentStreak = this.currentStreak(this.task_details);
      this.task_details.forEach((element: any) => {
        let event: any = {};
        event.startTime = new Date(element.scheduled_start_time);
        event.endTime = new Date(element.scheduled_end_time);
        event.title = element.name;
        event.status = element.status;
        this.eventSource.push(event);
      });
      this.myCalendar.loadEvents();
    });
  }

  // get task for last 7 days
  getTasksForLast7Days(taskDetails: any) {
    // Get the current date
    const currentDate = new Date();

    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Filter tasks scheduled within the last 7 days
    const last7DaysTasks = taskDetails.filter((task: any) => {
      const taskDate = new Date(task.scheduled_start_time);
      return taskDate >= sevenDaysAgo && taskDate <= currentDate;
    });
    return this.calculateCompliance(last7DaysTasks);
  }

  // Calculate Compliance
  calculateCompliance(taskDetails: any[]) {
    let completedCount = 0;
    let skippedCount = 0;

    // Count completed and skipped tasks
    taskDetails.forEach((task: any) => {
      if (task.status === 'completed') {
        completedCount++;
      } else if (task.status === 'skipped') {
        skippedCount++;
      }
    });

    // Calculate compliance
    let totalTasks = completedCount + skippedCount;
    let compliance = (totalTasks === 0 ? 0 : Number(completedCount / totalTasks)) * 100;
    return (compliance).toFixed(2);
  }

  // Calculate longest streak of completed tasks
  calculateStreak(taskDetails: any[]) {
    let maxStreak = 0;
    let currentStreak = 0;

    taskDetails.forEach(element => {
      if (element.status === 'completed') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return (maxStreak);
  }

  // Calculate current streak of completed tasks
  currentStreak(taskDetails: any[]) {
    let streak = 0;
    let index = taskDetails.length - 1;

    while (index >= 0) {
      if (taskDetails[index].status === 'completed')
        streak++;

      if (streak > 0 && taskDetails[index].status !== 'completed')
        break;
      index--;
    }

    return streak;
  }

  // Change the month based on param
  changeMonth(direction: number) {
    if (this.myCalendar) {
      let newDate = new Date(this.myCalendar.currentDate.getTime());
      // Move to the next month if direction is +1, move to the previous month if direction is -1
      newDate.setMonth(newDate.getMonth() + direction);
      this.myCalendar.currentDate = newDate;
      this.currentDate = newDate;
      this.myCalendar.loadEvents();
    }
  }

  // display the class according to task status 
  getEventStatusClass(events: any[]): string {
    if (events && events.length > 0 && events[0].status) {
      const status = events[0].status;
      if (status === 'completed') {
        return 'completed-task';
      } else if (status === 'pending') {
        return 'pending-task';
      } else if (status === 'skipped') {
        return 'skipped-task';
      } else {
        return ''; // Handle other cases if necessary
      }
    } else {
      return ''; // Handle the case when events array is empty or undefined
    }
  }

  // display month when user swipe to next/previous month
  onViewTitleChanged(title: any) {
    var monthYearArray = title.split(' ');
    var year = (monthYearArray[1]);
    var monthIndx = new Date(Date.parse(monthYearArray[0] + " 1, 2012")).getMonth() + 1
    const newDate = new Date(year, (monthIndx - 1), 28);
    this.currentDate = newDate;
    this.myCalendar.loadEvents();
  }
}