import * as React from 'react';
import {CustomMasker} from '../utils/CustomMasker';
import {ActionTypes, useTagListDispatch} from './TagListContext';
import {useNumpadState} from './NumpadContext';
import {ButtonPrimary} from './Theme';
import randomColor from 'randomcolor';

const masker = new CustomMasker();
const API_BASE_URL = 'http://localhost:3000/api/tags';
type ValiuResponse<T> = {
  data: T;
  message: string;
  status: string;
};

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
      dispatch({type: 'MODIFY_TAG', payload: editTag});
      const response = await fetch(API_BASE_URL + '/' + editTag._id, {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...editTag, title: tagTitle}),
      });
      const body: ValiuResponse<Tag> = await response.json(); //remove on server
      if (body.status !== '200') {
        // rollback
      }
    } else {
      if (tagTitle) {
        // Its add action
        const response = await fetch(API_BASE_URL, {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({title: tagTitle, color: randomColor()}),
        });
        const body: ValiuResponse<Tag> = await response.json(); //remove on server
        if (body.status === '200') {
          dispatch({type: ActionTypes.ADD_TAG, payload: body.data});
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
