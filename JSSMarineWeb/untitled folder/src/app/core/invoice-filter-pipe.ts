import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceFilter'
})
export class InvoiceFilterPipe implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => item.invoice_num.toUpperCase().indexOf(filter['invoice_num'].toUpperCase()) !== -1);
  }
}
