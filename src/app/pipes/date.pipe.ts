import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixTimestamp'
})
export class UnixTimestampPipe implements PipeTransform {

  transform(value: any): string {
    // extract date from Firebase Date
    let date = value.toDate();
    
    // Make it more readable
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    date = `${day}/${month}/${year} at ${hours}:${minutes}`;

    return date;
  }
}