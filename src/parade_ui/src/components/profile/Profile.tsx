import { ShowNFTs } from '../../NftList'
import { TabPanel } from '../../TabPanel'
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Stack } from '@mui/material';
import UserPortfolio from './UserPortfolioPage';
import SideBar from '../../sidebar/SideBar';
import TopBar from '../topbar/TopBar';
import Divider from '@mui/material/Divider';

export const Profile = () => {
  return (
    <Box>
      <TopBar />
      <Stack direction="row" justifyContent="space-between" height='100vh'>
        <SideBar />
        <UserPortfolio />
      </Stack>
    </Box>
  );
}