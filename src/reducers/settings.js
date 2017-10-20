const settings = (
  state = {
    buttonsVisible: true
  },
  action
) => {
  switch (action.type) {
    case 'TOGGLE_BUTTON_VISIBILITY': {
      return { ...state, buttonsVisible: action.visible };
    }
    default:
      return state;
  }
};

export default settings;
