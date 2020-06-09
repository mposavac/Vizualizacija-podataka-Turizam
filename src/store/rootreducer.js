const rootReducer = (state = { countrySelected: undefined, isByMonths: false }, action) => {
  switch (action.type) {
    case 'CHANGE_COUNTRY':
      return { ...state, countrySelected: action.data };
    case 'TOGGLE_YEARS_MONTHS':
      const isByMonths = !state.isByMonths;
      return { ...state, isByMonths: isByMonths };
    default:
      return state;
  }
};

export default rootReducer;
