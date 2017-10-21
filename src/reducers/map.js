const map = (state = null, action) => {
  switch (action.type) {
    case 'MOUNT_MAP': {
      return action.map;
    }
    default:
      return state;
  }
};

export default map;
