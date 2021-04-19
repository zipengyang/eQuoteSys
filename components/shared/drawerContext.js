import { createContext, useReducer } from 'react';
import { drawerReducer } from './drawerReducer';

export const drawerContext = createContext();

const drawerContextProvider = (props) => {
  const [state, dispatch] = useReducer(drawerReducer, {
    menuSelected: 'submitted',
    status: 'submitted',
    camps: {},
  });
  return (
    <drawerContext.Provider value={{ state, dispatch }}>
      {props.children}
    </drawerContext.Provider>
  );
};

export default drawerContextProvider;
