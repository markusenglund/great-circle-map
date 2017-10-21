const map = (state = { map: null, isLoaded: false }, action) => {
  switch (action.type) {
    case 'COMPLETE_MAP_LOAD': {
      return { ...state, isLoaded: true, map: action.map };
    }
    default:
      return state;
  }
};

export default map;
