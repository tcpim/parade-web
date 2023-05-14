import Homepage from "./components/Homepage/Homepage";
import { createContext, useState, Dispatch, SetStateAction } from "react";
import { Profile } from "./components/Profile/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PostPage } from "./components/Post/PostPage";
import {
  Route,
  Routes,
  RouterProvider,
  createBrowserRouter,
  BrowserRouter,
} from "react-router-dom";

const NotFoundPage = () => {
  return <h1>Not Found</h1>;
};

export interface UserLoginInfo {
  userPid: string;
  userAccount: string;
  walletConnected: boolean;
  walletType: "Plug" | "Stoic" | "";
}

interface AppContext {
  userLoginInfo: UserLoginInfo;
  setUserLoginInfo: Dispatch<SetStateAction<UserLoginInfo>>;
}

export const defaultLoginInfo: UserLoginInfo = {
  userPid: "",
  userAccount: "",
  walletConnected: false,
  walletType: "",
};

// only use this in local testing
const defaultTestingLoginInfo: UserLoginInfo = {
  userPid: "yrwna-bkgxs-vuzuw-lheqr-357oj-n4yiz-2zdjx-icv63-jgoqb-pmf3m-qqe",
  userAccount:
    "8795113c70c29285fb83d2b016fb12d8ee0d3e4fb19fca6b1c014c2f5096c17c",
  walletConnected: true,
  walletType: "Stoic",
};

export const AppContext = createContext<AppContext>({
  userLoginInfo: defaultLoginInfo,
  setUserLoginInfo: () => {},
});

const queryClient = new QueryClient();

export const App = () => {
  const [userLoginInfo, setUserLoginInfo] = useState<UserLoginInfo>(
    defaultTestingLoginInfo
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ userLoginInfo, setUserLoginInfo }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post">
            <Route path=":postId" element={<PostPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppContext.Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
