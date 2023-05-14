import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WalletConnection from "./WalletConnection";
import { useContext } from "react";
import { AppContext } from "../../App";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: theme.spacing(50),
  marginRight: theme.spacing(2),
  display: "flex",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  position: "absolute", // absolute to parent Search with relative
  display: "flex",
  alignItems: "center",
  height: "100%",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  paddingLeft: theme.spacing(6),
  width: "100%",
}));

export default function TopBar() {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <AppBar color="secondary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ color: "white" }}
          component={Link}
          to="/"
        >
          Parade
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search collections…" />
          </Search>
          <Button variant="contained" sx={{ margin: "4px" }}>
            Recent
          </Button>
          <Button variant="contained" sx={{ margin: "4px" }}>
            Trending
          </Button>
          <Button variant="contained" sx={{ margin: "4px" }}>
            Buy Now
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
          {appContext.userLoginInfo.walletConnected && (
            <Button
              variant="contained"
              sx={{ margin: "4px" }}
              onClick={handleProfileClick}
            >
              Profile
            </Button>
          )}
          <WalletConnection />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
