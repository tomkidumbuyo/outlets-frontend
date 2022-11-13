import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any[], attr: string, order: boolean = true): any[] {
    
    if (array !== undefined && Array.isArray(array)) {
      array.sort((a: any, b: any) => {
        if (a[attr].toLowerCase() < b[attr].toLowerCase()) {
          return -1;
        } else if (a[attr].toLowerCase() > b[attr].toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
      if (order) {
        return array;
      } else {
        return array.reverse();
      }
      }
      return array;

  }

}
