import Homepage from './components/feed/Homepage';
import { createContext, useState, Dispatch, SetStateAction } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { Profile } from './components/profile/Profile';

export interface UserLoginInfo {
  userPid: string;
  walletConnected: boolean;
  walletType: "Plug" | "Stoic" | "";
}

interface AppContext {
  userLoginInfo: UserLoginInfo;
  setUserLoginInfo: Dispatch<SetStateAction<UserLoginInfo>>
}

const defaultLoginInfo: UserLoginInfo = {
  userPid: "",
  walletConnected: false,
  walletType: ""
}

// only use this in local testing
const defaultTestingLoginInfo: UserLoginInfo = {
  userPid: "dt6hm-ehioi-scl5p-lcl2v-jlti3-iexjx-rbzfn-cb4dc-tru44-jex2a-hae",
  walletConnected: true,
  walletType: "Plug"
}

export const AppContext = createContext<AppContext>({
  userLoginInfo: defaultLoginInfo,
  setUserLoginInfo: () => { },
})

export const App = () => {
  const [userLoginInfo, setUserLoginInfo] = useState<UserLoginInfo>(defaultTestingLoginInfo)

  return (
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
  );
}

