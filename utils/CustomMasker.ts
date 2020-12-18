/**
 * WARNING: Not for production use, this is intended for a coding exercise
 *
 * This can be refactor to use the locale
 *
 * @see https://observablehq.com/@jokycz/localized-number-parsing/2
 */
export class CustomMasker {
  _group: RegExp;
  _decimal: RegExp;
  _formatter: Intl.NumberFormat;
  constructor() {
    this._group = new RegExp(/\./g);
    this._decimal = new RegExp(/,/g);
    this._formatter = new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    });
  }
  mask(unmasked: number) {
    return this._formatter.format(unmasked);
  }
  unmask(masked: string) {
    return +masked.replace(this._group, '').replace(this._decimal, '.');
  }
  decimals(masked: string) {
    const maskedComma = masked.split(',');
    if (maskedComma.length > 1) {
      const value = maskedComma[maskedComma.length - 1];
      if (value === '') {
        return ',';
      } else {
        return `,${value}`;
      }
    }
    return '';
  }
}
