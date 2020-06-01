const rootReducer = (state = { countrySelected: null }, action) => {
  console.log(action.data);
  switch (action.type) {
    case 'CHANGE_COUNTRY':
      return { ...state, countrySelected: action.data };
    default:
      return state;
  }
};

export default rootReducer;
