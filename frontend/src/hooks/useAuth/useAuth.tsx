import React from 'react';
import { UserContext } from '../../components/UserProvider';
import { UserContextValue } from '../../components/UserProvider/UserProvider';

function useAuth(): UserContextValue {
  return React.useContext(UserContext);
}

export default useAuth;
