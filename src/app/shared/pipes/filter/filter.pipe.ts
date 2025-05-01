import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, field: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    return items.filter((item) =>
      item[field]?.toLowerCase().includes(searchTerm)
    );
  }
}
