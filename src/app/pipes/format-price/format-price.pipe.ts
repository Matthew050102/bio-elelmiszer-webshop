import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {

  transform(value: number, currency: string = 'Ft'): string {
    const valueString = value.toString();
    if (valueString.length < 4) {
      return value.toString + ' ' + currency;
    }
    let formattedValue = '';
    if (valueString.length % 3 === 0) {
      for (let i = 0; i < valueString.length; i++) {
        if (i > 0 && i % 3 === 0) {
          formattedValue += ' ';
        }
        formattedValue += valueString[i];
      }
      
    } else if (valueString.length % 3 === 1) {
      for (let i = 0; i < valueString.length; i++) {
        if (i > 0 && i % 3 === 1) {
          formattedValue += ' ';
        }
        formattedValue += valueString[i];
      }
    } else {
      for (let i = 0; i < valueString.length; i++) {
        if (i > 0 && i % 3 === 2) {
          formattedValue += ' ';
        }
        formattedValue += valueString[i];
      }
    }
    return formattedValue + ' ' + currency;
  }

}
