/**
 * CustomMasker
 *
 * You can convert a number to a string and back, 1234.5 <=> '1.234,5'
 *
 * @more https://observablehq.com/@jokycz/localized-number-parsing/2
 */
export class CustomMasker {
  _group: RegExp;
  _decimal: RegExp;
  constructor() {
    this._group = new RegExp(/\./g);
    this._decimal = new RegExp(/,/g);
  }
  mask(unmasked: string) {
    const split = unmasked.toString().split('.');
    const [integer, decimal] = [split[0], split[1]];
    const remainder = +integer.length % 3;
    const zeros = '000'.slice(0, -remainder);
    const integers = `${zeros}${integer}`.match(/.{1,3}/g);
    const addDots = integers
      ?.map((int) => int + '.')
      .join('')
      .slice(0, -1);
    const noLeadingZero = addDots?.replace(/^0+/, '');
    return [noLeadingZero ?? '0', decimal && ',', decimal].join('');
  }
  unmask(masked: string) {
    return masked.replace(this._group, '').replace(this._decimal, '.');
  }
}
