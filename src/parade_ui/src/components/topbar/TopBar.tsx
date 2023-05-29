import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { Box, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WalletConnection from "./WalletConnection";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { useAllCollectionsDab } from "../../hooks/fetch-nft-data/useAllCollectionsDab";
import Autocomplete from "@mui/material/Autocomplete";
import { DABCollection } from "@psychedelic/dab-js";

interface TopBarProps {
  searchCollection?: React.Dispatch<React.SetStateAction<string>>;
}

export default function TopBar({ searchCollection }: TopBarProps) {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const allCollectionQuery = useAllCollectionsDab();
  const [typedCollectionName, setTypedCollectionName] = useState("");

  console.log("allCollectionQuery", allCollectionQuery.data?.length);

  const collections = allCollectionQuery.data ?? [];

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleCollectionSelect = (canisterId?: string) => {
    if (searchCollection) {
      searchCollection(canisterId ?? "");
    }
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
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            width: "500px",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Autocomplete
              color="primary"
              onChange={(event: any, newValue: DABCollection | null) => {
                handleCollectionSelect(newValue?.principal_id.toString());
              }}
              options={collections}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Collection names" />
              )}
            />
          </Box>
          <Button variant="contained" sx={{ margin: "4px" }}>
            Recent
          </Button>
          <Button variant="contained" sx={{ margin: "4px" }}>
            Trending
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
