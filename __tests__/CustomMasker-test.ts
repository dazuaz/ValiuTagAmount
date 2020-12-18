import {CustomMasker} from '../utils/CustomMasker';
const masker = new CustomMasker();

it('unmask correct number 1.234 => 1234', () => {
  const masked = '1.234';
  const _number = masker.unmask(masked);
  expect(_number).toBe('1234');
});

it('masks correct number 123.4 => 123,4', () => {
  const unmasked = '123.4';
  const _masked = masker.mask(unmasked);
  expect(_masked).toBe('123,4');
});

it('unmask correct number 1.234,976 => 1234.976', () => {
  const masked = '1.234,976';
  const _number = masker.unmask(masked);
  expect(_number).toBe('1234.976');
});

it('masks correct number 1234.976 => 1.234,976', () => {
  const unmasked = '1234.976';
  const _masked = masker.mask(unmasked);
  expect(_masked).toBe('1.234,976');
});

it('mask does not add invalid commas 1', () => {
  const unmasked = '1';
  const _masked = masker.mask(unmasked);
  expect(_masked).toBe('1');
});

it('unmask correct number 1.234,900 => 1234.900', () => {
  const masked = '1.234,900';
  const _number = masker.unmask(masked);
  expect(_number).toBe('1234.900');
});
