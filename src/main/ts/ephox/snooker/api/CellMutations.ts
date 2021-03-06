import Sizes from '../resize/Sizes';

const halve = function (main, other) {
  const width = Sizes.getGenericWidth(main);
  width.each(function (w) {
    const newWidth = w.width() / 2;
    Sizes.setGenericWidth(main, newWidth, w.unit());
    Sizes.setGenericWidth(other, newWidth, w.unit());
  });
};

export default {
  halve
};