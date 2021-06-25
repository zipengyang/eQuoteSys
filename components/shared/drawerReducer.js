export const drawerReducer = (state, action) => {
  switch (action.type) {
    case 'submitted':
      return {
        menuSelected: 'submitted',
        status: 'submitted',
      };
    case 'allquotes':
      return {
        menuSelected: 'allquotes',
        status: 'draft',
      };
    case 'quoted':
      return {
        menuSelected: 'quoted',
        status: 'quoted',
      };
    case 'marketing':
      return {
        menuSelected: 'marketing',
        status: 'promoted',
        // camps: action.payload,
      };
    case 'campReport':
      return {
        menuSelected: 'campReport',
        status: 'promoted',
        camps: action.payload,
      };
    case 'promoted':
      return {
        menuSelected: 'promoted',
        status: 'promoted',
      };
    case 'opened':
      return {
        menuSelected: 'opened',
        status: 'promoted',
      };
    case 'accepted':
      return {
        menuSelected: 'accepted',
        status: 'promoted',
      };
    case 'customer':
      return {
        menuSelected: 'customer',
        status: '',
      };
    case 'report':
      return {
        menuSelected: 'report',
        status: '',
      };

    case 'customerTimeLine':
      return {
        menuSelected: 'customerTimeLine',
        status: '',
        camps: action.payload,
      };
    case 'quoteAllInOneView':
      return {
        menuSelected: 'quoteAllInOneView',
        status: '',
        camps: action.payload,
      };
    default:
      return state;
  }
};
