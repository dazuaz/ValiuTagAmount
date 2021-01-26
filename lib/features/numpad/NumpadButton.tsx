import * as React from 'react';
import {CustomMasker} from '../../utils/CustomMasker';
// import {useNumpadState} from './NumpadContext';
import {ButtonPrimary} from '../../components/Theme';
import {useSelector, useDispatch} from 'react-redux';
import {selectNumpad} from './numpadSlice';
import {handleAddTag, handleEditTag} from '../taglist/tagsSlice';

const masker = new CustomMasker();

type NumpadButtonProps = {
  editTag?: Tag;
  goBack: () => void;
};

const NumpadButton: React.FC<NumpadButtonProps> = ({editTag, goBack}) => {
  const state = useSelector(selectNumpad);
  const isEdit = editTag?._id !== undefined;
  const dispatch = useDispatch();
  const handleAddOrEditTag = () => {
    // Grab InputText number
    const tagTitle = masker.unmask(state);

    if (editTag && isEdit) {
      // Its edit action
      dispatch(handleEditTag({tag: editTag, title: tagTitle}));
    } else {
      if (tagTitle) {
        // Its add action
        dispatch(handleAddTag({title: tagTitle}));
      }
    }
    goBack();
  };
  return (
    <ButtonPrimary
      style={{marginLeft: 12}}
      onPress={() => handleAddOrEditTag()}>
      {isEdit ? 'Edit' : 'Add'}
    </ButtonPrimary>
  );
};

export default NumpadButton;
