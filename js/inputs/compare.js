// Three buttons: <  =  >   (keyboard: < = > or , = .)

import { buttonInput } from './choices.js';

export default {
  id: 'compare',
  mount(container, { onAnswer }) {
    return buttonInput(container, ['<', '=', '>'], {
      onAnswer,
      captions: ['less than', 'equal to', 'greater than'],
      keys: ['<', '=', '>'],
      className: 'choices-compare',
    });
  },
};
