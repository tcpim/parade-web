import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ClubFeed } from "./components/Club/ClubFeed";
import { ClubsPage } from "./components/Club/ClubsPage";
import { Feed } from "./components/Homepage/Feed";
import { PostCreationPage } from "./components/Post/PostCreationPage";
import { PostPage } from "./components/Post/PostPage";
import { Profile } from "./components/Profile/Profile";
import { LayoutWithSideBar } from "./components/Sidebar/SideBar";

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
          <Route
            path="/"
            element={
              <LayoutWithSideBar>
                <Feed />
              </LayoutWithSideBar>
            }
          />
          <Route
            path="/profile"
            element={
              <LayoutWithSideBar>
                <Profile />
              </LayoutWithSideBar>
            }
          />
          <Route
            path="/post/:postId"
            element={
              <LayoutWithSideBar>
                <PostPage />
              </LayoutWithSideBar>
            }
          />
          <Route
            path="/post-creator"
            element={
              <LayoutWithSideBar>
                <PostCreationPage />
              </LayoutWithSideBar>
            }
          />
          <Route
            path="/clubs"
            element={
              <LayoutWithSideBar>
                <ClubsPage />
              </LayoutWithSideBar>
            }
          />
          <Route
            path="/clubs/:clubId"
            element={
              <LayoutWithSideBar>
                <ClubFeed />
              </LayoutWithSideBar>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppContext.Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
