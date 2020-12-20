import * as React from 'react';
import {CustomMasker} from '../utils/CustomMasker';
import {useTagListDispatch} from './TagListContext';
import {useNumpadState} from './NumpadContext';
import {ButtonPrimary} from './Theme';
import {addTag, modifyTag} from './TagListApi';

const masker = new CustomMasker();

type NumpadButtonProps = {
  editTag?: Tag;
  goBack: () => void;
};

const NumpadButton: React.FC<NumpadButtonProps> = ({editTag, goBack}) => {
  const state = useNumpadState();
  const dispatch = useTagListDispatch();
  const handleAddOrEditTag = async () => {
    // Grab InputText number
    const tagTitle = masker.unmask(state);

    if (editTag?._id) {
      // Its edit action
      try {
        await modifyTag(editTag, tagTitle, dispatch);
        // TODO: scroll to top and go back? or message snackbar.
      } catch (error) {
        // TODO: show error message snackbar.
      }
    } else {
      if (tagTitle) {
        // Its add action
        try {
          await addTag(tagTitle, dispatch);
        } catch (error) {
          // TODO: show error message snackbar
        }
      }
    }
    goBack();
  };
  return (
    <ButtonPrimary
      style={{marginLeft: 12}}
      onPress={() => handleAddOrEditTag()}>
      {editTag?._id ? 'Edit' : 'Add'}
    </ButtonPrimary>
  );
};

export default NumpadButton;
