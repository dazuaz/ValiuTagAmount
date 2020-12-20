import * as React from 'react';
import {View} from 'react-native';
import NumpadInput from './NumpadInput';
import NumpadButton from './NumpadButton';
import NumpadDigits from './NumpadDigits';
import {Colors} from './Theme';
import {ActionTypes, useNumpadDispatch} from './NumpadContext';

import {CustomMasker} from '../utils/CustomMasker';

type NumpadProps = {
  editTag?: Tag;
  goBack: () => void;
};
const masker = new CustomMasker();

const Numpad: React.FC<NumpadProps> = ({editTag, goBack}) => {
  const dispatch = useNumpadDispatch();

  React.useEffect(() => {
    // if navigating from and edit tag, we update the input and
    if (editTag?._id) {
      dispatch({
        type: ActionTypes.INSERT_NUMBER,
        payload: masker.mask(editTag.title),
      });
    }
  }, [editTag, dispatch]);

  return (
    <>
      <View style={{paddingHorizontal: 24}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '70%'}}>
            <NumpadInput
              style={{
                flex: 1,
                borderBottomWidth: 1.5,
                borderColor: Colors.primary,
                backgroundColor: Colors.lighter,
                fontSize: 24,
                paddingHorizontal: 12,
                borderRadius: 4,
              }}
            />
          </View>
          <View style={{width: '30%'}}>
            <NumpadButton editTag={editTag} goBack={() => goBack()} />
          </View>
        </View>
      </View>
      <View style={{flex: 1, marginTop: 48}}>
        <NumpadDigits />
      </View>
    </>
  );
};

export default Numpad;
