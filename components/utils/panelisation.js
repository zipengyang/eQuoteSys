const Calc_Array = (w, h) => {
  let gap = 6;
  let p_w = 419 + gap;
  let p_h = 572 + gap;
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
    p_w = r_w >= h ? 572 + gap : p_w;

    p_w = r_h >= w ? r_h : p_w;
    p_h = r_h >= w ? 419 + gap : p_h;

    i += 1;
  }
  return numArray;
};

export default Calc_Array;
