/**
 * @format
 */

import {ActionTypes, reducer} from '../components/NumpadContext';
// Note: test renderer must be required after react-native.
describe('numpad reducer', () => {
  describe('INSERT_NUMBER', () => {
    const addDigit = (value: string, digit: string) =>
      reducer(value, {type: ActionTypes.INSERT_NUMBER, payload: digit});
    it('Adds a digit', () => {
      expect(addDigit('', '1')).toEqual('1');
    });
    it('Adds a digit after numbers', () => {
      expect(addDigit('123', '1')).toEqual('1.231');
    });
    it('Accepts leading zero decimals', () => {
      expect(addDigit('123,', '0')).toEqual('123,0');
    });
  });
  describe('INSERT_COMMA', () => {
    const addComma = (value: string) =>
      reducer(value, {type: ActionTypes.INSERT_COMMA, payload: undefined});
    it('Does not accepts a comma without number', () => {
      expect(addComma('')).toEqual('');
    });
    it('Adds a comma', () => {
      expect(addComma('1.234')).toEqual('1.234,');
    });
    it('Can not add more than 1 comma', () => {
      expect(addComma('1.234,')).toEqual('1.234,');
    });
  });
  describe('DELETE', () => {
    const deleteDigit = (value: string) =>
      reducer(value, {type: ActionTypes.DELETE, payload: undefined});
    it('Does nothing if no value', () => {
      expect(deleteDigit('')).toEqual('');
    });
    it('Removes a comma', () => {
      expect(deleteDigit('1.234,')).toEqual('1.234');
    });
    it('Removes a decimal', () => {
      expect(deleteDigit('1.234,01')).toEqual('1.234,0');
    });
    it('Removes a digit', () => {
      expect(deleteDigit('1.234')).toEqual('123');
    });
  });
});
