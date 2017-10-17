const location = (state = '', action) => {
  switch (action.type) {
    case 'GET_LOCATION': {
      return action.location;
    }
    default:
      return state;
  }
};

export default location;
