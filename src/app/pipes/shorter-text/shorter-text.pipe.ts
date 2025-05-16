import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorterText'
})
export class ShorterTextPipe implements PipeTransform {

  transform(value: string, limit: number = 20): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + "..." : value;
  }

}
