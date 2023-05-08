import { Box, Stack } from '@mui/material';
import UserPortfolio from './UserPortfolioPage';
import SideBar from '../../sidebar/SideBar';
import TopBar from '../topbar/TopBar';

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