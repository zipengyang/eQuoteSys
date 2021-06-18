// price calculation

import { useQuery } from 'react-query';
import { getSpecById } from '../../pages/api/getSpec';
import firebase from '../../firebase/firebase';
// import * as admin from 'firebase-admin'; // will removed

//factors
const factors = {
  panel: {
    1: { unitPrice: 100 },
    2: { unitPrice: 99.6 },
    3: { unitPrice: 99.2 },
    4: { unitPrice: 98.8 },
    5: { unitPrice: 98.4 },
    6: { unitPrice: 98.0 },
    7: { unitPrice: 97.6 },
    8: { unitPrice: 97.2 },
    9: { unitPrice: 96.8 },
    10: { unitPrice: 96.4 },
    11: { unitPrice: 96.0 },
    12: { unitPrice: 95.6 },
    13: { unitPrice: 95.2 },
    14: { unitPrice: 94.8 },
    15: { unitPrice: 94.4 },
    16: { unitPrice: 94.0 },
    17: { unitPrice: 93.6 },
    18: { unitPrice: 93.2 },
    19: { unitPrice: 92.8 },
    20: { unitPrice: 92.4 },
  },
  panelType: {
    1: { type: '18X24', Val: 0, width: 406, height: 560 },
    2: { type: '18x12', Val: 0, width: 406, height: 255 },
    3: { type: '21x24', Val: 5, width: 483, height: 560 },
    4: { type: '16x18', Val: 5, width: 368, height: 406 },
  },
};

// step 1: panelization
const Calc_Array = (panType, w, h) => {
  panType = panType ? panType : 1; // default: '18x24

  const workAreaW = factors.panelType[panType].width;
  const workAreaL = factors.panelType[panType].height;
  let gap = 6;
  let p_w = workAreaW + gap;
  let p_h = workAreaL + gap;
  let numArray = 0;
  w = Number(w);
  h = Number(h);
  let i = 0;
  while (i <= 1) {
    let num = Math.floor(p_w / (w + gap)) * Math.floor(p_h / (h + gap));
    numArray += num;
    let r_w = p_w >= w ? p_w % (w + gap) : 0;
    let r_h = p_h >= h ? p_h % (h + gap) : 0;

    if (r_w < h && r_h < w) {
      break;
    }
    p_h = r_w >= h ? r_w : p_h;
    p_w = r_w >= h ? workAreaL + gap : p_w;

    p_w = r_h >= w ? r_h : p_w;
    p_h = r_h >= w ? workAreaW + gap : p_h;

    i += 1;
  }
  return numArray;
};

const GetPanel = (p, w, h) => {
  const num_1 = Calc_Array(p, w, h);
  const num_2 = Calc_Array(p, w, h);
  const best_cut = Math.max(num_1, num_2);
  return best_cut;
};

// panelization
const Panelization = (
  panelType,
  suppliedAs,
  width,
  height,
  ccPerArray,
  quantity,
) => {
  const bestCut = GetPanel(panelType, width, height);
  const calSteps = suppliedAs === 'single' ? bestCut : bestCut * ccPerArray;

  const panel =
    suppliedAs === 'single'
      ? Math.ceil(quantity / bestCut)
      : Math.ceil(quantity / (bestCut * ccPerArray));

  const unitPrice = panel > 20 ? 92.0 : factors.panel[panel].unitPrice;
  return { panel, calSteps, unitPrice };
};

//overmake
//others

// calculation

export default function Calculation(data) {
  console.log('id: ', data.quoteId);
  let calArray = [];
  let totalPrice = 0;
  const panelType = 1; // set penal size as '18x24'
  const suppliedAs = data.suppliedAs.value === false ? 'single' : 'array';
  const panelization = Panelization(
    panelType,
    suppliedAs,
    data.width.value,
    data.height.value,
    data.ccPerArray.value,
    data.quantity.value,
  );
  const { calSteps, panel, unitPrice } = panelization;
  calArray.push({
    factor: 'step',
    value: calSteps,
    unitPrice: 0,
    amount: 0,
    totalPrice: 0,
  });
  calArray.push({
    factor: 'panel',
    value: panel,
    unitPrice,
    amount: panel * unitPrice,
    totalPrice: panel * unitPrice,
  });
  totalPrice = panel * unitPrice;
  return calArray;
}
