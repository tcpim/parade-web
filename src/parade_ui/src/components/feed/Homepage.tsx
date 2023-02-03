import { Box, Stack } from '@mui/material';
import TopBar from '../topbar/TopBar'
import SideBar from '../../sidebar/SideBar'
import Feed from './Feed';
import LeaderBoard from './LeaderBoard';
import Divider from '@mui/material/Divider';

const Homepage = () => {
    return (
        <Box>
            <TopBar />
            <Stack direction="row" justifyContent="space-between" height='100vh' >
                <SideBar />
                <Feed />
                <LeaderBoard />
            </Stack>
        </Box>
    )
}

export default Homepage