import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subscriptionFilter'
})
export class SubscriptionFilterPipe implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }
    console.log(items[0].plan_name);
    console.log(filter['plan_name']);
    return items.filter(item => item.plan_name.toUpperCase().indexOf(filter['plan_name'].toUpperCase()) !== -1);
  }
}
