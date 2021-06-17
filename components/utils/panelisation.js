const Calc_Array = (panType, w, h) => {
  const dimension = {
    24: 560,
    21: 483,
    18: 406,
    12: 255,
  };
  const getWidth = panType ? panType.substr(0, 2) : '21';
  const getLength = panType ? panType.substr(2, 2) : '24';
  const workAreaW = dimension[getWidth];
  const workAreaL = dimension[getLength];
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

export default function GetPanel(p, w, h) {
  const num_1 = Calc_Array(p, w, h);
  const num_2 = Calc_Array(p, w, h);
  const best_cut = Math.max(num_1, num_2);
  return best_cut;
}
