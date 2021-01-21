import numpad, {insertDigit, insertComma, deleteChar} from './numpadSlice';
describe('numpad reducer', () => {
  it('should handle initial state', () => {
    expect(numpad(undefined, '')).toEqual({value: ''});
  });

  it('should handle INSERT_DIGIT', () => {
    expect(
      numpad({value: ''}, {type: insertDigit.type, payload: '1'}),
    ).toEqual({value: '1'});
    expect(
      numpad({value: '1'}, {type: insertDigit.type, payload: '9'}),
    ).toEqual({value: '19'});
    expect(
      numpad({value: '123'}, {type: insertDigit.type, payload: '9'}),
    ).toEqual({value: '1.239'});
    expect(
      numpad({value: '123,'}, {type: insertDigit.type, payload: '9'}),
    ).toEqual({value: '123,9'});
  });

  it('should handle INSERT_COMMA', () => {
    expect(numpad({value: ''}, {type: insertComma.type})).toEqual({value: ''});
    expect(numpad({value: '1'}, {type: insertComma.type})).toEqual({
      value: '1,',
    });
    expect(numpad({value: '123,0'}, {type: insertComma.type})).toEqual({
      value: '123,0',
    });
  });

  it('should handle DELETE_CHAR', () => {
    expect(numpad({value: ''}, {type: deleteChar.type})).toEqual({value: ''});
    expect(numpad({value: '1'}, {type: deleteChar.type})).toEqual({
      value: '0',
    });
    expect(numpad({value: '123,0'}, {type: deleteChar.type})).toEqual({
      value: '123',
    });
    expect(numpad({value: '1.230'}, {type: deleteChar.type})).toEqual({
      value: '123',
    });
  });
});
