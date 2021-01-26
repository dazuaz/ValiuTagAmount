import * as React from 'react';
import {View} from 'react-native';
import NumpadInput from './NumpadInput';
import NumpadButton from './NumpadButton';
import NumpadDigits from './NumpadDigits';
import {Colors} from '../../components/Theme';

import {CustomMasker} from '../../utils/CustomMasker';
import {useDispatch} from 'react-redux';
import {replaceNumpad} from './numpadSlice';

type NumpadProps = {
  editTag?: Tag;
  goBack: () => void;
};
const masker = new CustomMasker();

const Numpad: React.FC<NumpadProps> = ({editTag, goBack}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    // if navigating from and edit tag, we update the input text
    if (editTag?._id) {
      dispatch(replaceNumpad(masker.mask(editTag.title)));
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
                color: Colors.black,
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
