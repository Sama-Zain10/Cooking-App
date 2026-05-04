import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitConvert',
  standalone: true
})
export class UnitConversionPipe implements PipeTransform {
  transform(value: number, fromUnit: string, toUnit: string = 'oz'): string {
    if (!value || !fromUnit) return `${value} ${fromUnit}`;

    const from = fromUnit.toLowerCase();
    const to = toUnit.toLowerCase();

    if ((from === 'g' || from === 'grams' ||from==='piece') && to === 'oz') {
      return `${(value * 0.035274).toFixed(2)} oz`;
    }
    if ((from === 'oz' || from === 'ounces') && to === 'g') {
      return `${(value * 28.3495).toFixed(2)} g`;
    }
    if ((from === 'ml' || from === 'milliliters') && to === 'cup') {
      return `${(value * 0.00422675).toFixed(2)} cups`;
    }
    if ((from === 'cup' || from === 'cups') && to === 'ml') {
      return `${(value * 236.588).toFixed(2)} ml`;
    }

    return `${value} ${fromUnit}`;
  }
}