const KeyCode = {
  ESC: 27,
  ENTER: 13
};

export default {
  isEnterPressed(evt) {
    return evt.keyCode === KeyCode.ENTER;
  },
  isEscPressed(evt) {
    return evt.keyCode === KeyCode.ESC;
  }
};
