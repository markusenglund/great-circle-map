const error = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_ERROR': {
      return action.error;
    }
    case 'HIDE_ERROR': {
      return false;
    }
    default:
      return state;
  }
};

export default error;
