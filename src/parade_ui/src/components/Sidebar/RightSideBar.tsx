import { Box, Drawer } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import WalletConnection from "../Topbar/WalletConnection";

interface RightSideBarProps {
  width: number;
}
export const RightSideBar = ({ width }: RightSideBarProps) => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", width: `${width}px` }}
    >
      <Drawer variant="permanent" anchor="right">
        <Box sx={{ margin: 3 }}>
          <WalletConnection />
        </Box>
      </Drawer>
    </Box>
  );
};
