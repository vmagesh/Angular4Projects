import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subjectFilter'
})
export class AppointmentFilterPipe implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => item.subject.toUpperCase().indexOf(filter['subject'].toUpperCase()) !== -1);
  }
}
