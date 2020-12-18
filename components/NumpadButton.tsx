import React from 'react';
import {CustomMasker} from '../utils/CustomMasker';
import {createTag, modifyTag} from '../utils/TagsApi';
import {useCurrencyState} from './CurrencyContext';
import {ButtonPrimary} from './Theme';
import randomColor from 'randomcolor';
import {Tag} from '../types';

const masker = new CustomMasker();

type NumpadButtonProps = {
  editTag?: Tag;
  goBack: () => void;
};
const NumpadButton: React.FC<NumpadButtonProps> = ({editTag, goBack}) => {
  const state = useCurrencyState();

  const handleAddOrEditTag = async () => {
    // Grab InputText number
    const tagTitle = masker.unmask(state);

    if (editTag?._id) {
      // Its edit action
      await modifyTag(editTag._id, {...editTag, title: tagTitle});
    } else {
      if (tagTitle) {
        // Its add action
        await createTag(tagTitle, randomColor());
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
