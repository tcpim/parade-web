import { Box, Stack } from '@mui/material';
import TopBar from '../topbar/TopBar'
import SideBar from '../../sidebar/SideBar'
import { Feed } from './Feed';
import LeaderBoard from './LeaderBoard';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { GetStreetPostsRequest, GetStreetPostsResponse, _SERVICE as MainServer } from '../../../backend_declarations/main_server/main_server.did';
import {main_server, createActor} from '../../../backend_declarations/main_server';
import {MAIN_SERVER_CANISTER} from '../../../backend_declarations/config'
import { ActorSubclass } from '@dfinity/agent';
import {useMainServer} from '../../hooks/useMainServer'

const Homepage = () => {
    const [getPostsResponse, setGetPostsResponse] = useState<GetStreetPostsResponse | null>(null);
    const mainServer = useMainServer();

    useEffect(() => {
        const fetchData = async () => {
            const request: GetStreetPostsRequest = {
                'offset': 0,
                'limit': [],
            };
            
            const response: GetStreetPostsResponse = await mainServer.get_street_posts(request);
            console.log(`response: ${JSON.stringify(response.posts[1].created_by)}`)
            setGetPostsResponse(response);
            
        };
        fetchData().catch(console.error);
    }, []);

    console.log("CANISTER_ID_MAIN_SERVER: " + getPostsResponse?.posts.length);
    return (
        <Box> 
            <TopBar /> 
            <Stack direction="row" justifyContent="space-between" height='100vh' >
                <SideBar />
                <Feed />
                <h1>heyheye</h1>
                <LeaderBoard />
            </Stack>
        </Box>
    )
}

export default Homepage