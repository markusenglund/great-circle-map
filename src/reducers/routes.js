const routes = (state = [], action) => {
  switch (action.type) {
    case 'SUBMIT_ROUTES': {
      return action.routes;
    }
    default:
      return state;
  }
};

export default routes;
