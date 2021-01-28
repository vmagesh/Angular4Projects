import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventName'
})
export class EventNamePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!value) {
      return value;
    }
    let x = value
      .replace(')@!@(', '')
      .replace(/!@#/g, '')
      .replace(/#@!/g, '')
      .replace(/~@#/g, '')
      .replace(/#@~/g, '');
    console.log(x);
    return x;
  }
}
