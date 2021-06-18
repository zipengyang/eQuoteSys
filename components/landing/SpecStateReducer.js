import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_STATE = {
  quoteId: uuidv4(),
  suppliedAs: {
    value: false,
    error: null,
  },
  ccPerArray: {
    value: '',
    error: null,
  },
  height: {
    value: '',
    error: null,
  },
  width: {
    value: '',
    error: null,
  },
  xOut: {
    value: false,
  },
  layer: {
    value: 2,
    error: null,
  },
  material: {
    value: '',
    error: null,
  },
  quantity: {
    value: '',
    error: null,
  },
  leadtime: {
    value: [],
    error: null,
  },
};

export const SpecReducer = (state, { key, payload }) => {
  switch (key) {
    case 'suppliedAs':
      state.suppliedAs.value = payload.newValue;
      state.suppliedAs.error = payload.error;
      return;
    case 'ccPerArray':
      state.ccPerArray.value = payload.newValue;
      state.ccPerArray.error = payload.error;
      return;
    case 'height':
      state.height.value = payload.newValue;
      state.height.error = payload.error;
      return;
    case 'width':
      state.width.value = payload.newValue;
      state.width.error = payload.error;
      return;
    case 'xOut':
      state.xOut.value = payload.newValue;
      state.xOut.error = payload.error;
      return;
    case 'layer':
      state.layer.value = payload.newValue;
      state.layer.error = payload.error;
      return;
    case 'material':
      state.material.value = payload.newValue;
      state.material.error = payload.error;
      return;
    case 'quantity':
      state.quantity.value = payload.newValue;
      state.quantity.error = payload.error;
      return;
    case 'leadtime':
      state.leadtime.value = payload.newValue;
      state.leadtime.error = payload.error;
      return;
    default:
      return state;
  }
};
