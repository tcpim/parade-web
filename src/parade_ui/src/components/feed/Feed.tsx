import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material';

const Feed = () => {
    const [httpRes, seHttpRes] = useState('')

    useEffect(() => {
        fetch('https://parade-api-lbbl5ziblq-wl.a.run.app/fetch')
            .then(response => response.text())
            .then(data => seHttpRes(data));
    })

    return (
        <Box bgcolor='rgba(251, 18, 18, 0.2)' sx={{ flexBasis: '60%', marginLeft: "15%", marginTop: "5%" }}>
            {httpRes}
        </Box>
    )
}

export default Feed