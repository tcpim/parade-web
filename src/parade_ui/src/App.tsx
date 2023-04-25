import Homepage from './components/feed/Homepage';
import { createContext, useState, Dispatch, SetStateAction } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { Profile } from './components/profile/Profile';
import { QueryClient, QueryClientProvider } from 'react-query';

export interface UserLoginInfo {
  userPid: string;
  userAccount: string;
  walletConnected: boolean;
  walletType: "Plug" | "Stoic" | "";
}

interface AppContext {
  userLoginInfo: UserLoginInfo;
  setUserLoginInfo: Dispatch<SetStateAction<UserLoginInfo>>
}

export const defaultLoginInfo: UserLoginInfo = {
  userPid: "",
  userAccount: "",
  walletConnected: false,
  walletType: ""
}

// only use this in local testing
const defaultTestingLoginInfo: UserLoginInfo = {
  userPid: "yrwna-bkgxs-vuzuw-lheqr-357oj-n4yiz-2zdjx-icv63-jgoqb-pmf3m-qqe",
  userAccount: "8795113c70c29285fb83d2b016fb12d8ee0d3e4fb19fca6b1c014c2f5096c17c",
  walletConnected: true,
  walletType: "Stoic"
}

export const AppContext = createContext<AppContext>({
  userLoginInfo: defaultLoginInfo,
  setUserLoginInfo: () => { },
})

const queryClient = new QueryClient();

export const App = () => {
  const [userLoginInfo, setUserLoginInfo] = useState<UserLoginInfo>(defaultTestingLoginInfo)

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ userLoginInfo, setUserLoginInfo }}>
        <BrowserRouter>
          <Route exact={true} path="/">
            <Homepage />
          </Route>
          <Route exact={true} path="/profile">
            <Profile />
          </Route>
        </BrowserRouter>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}

