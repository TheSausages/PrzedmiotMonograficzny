import React from 'react';

import {Box, Button} from '@mui/material';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import { useNavigate } from 'react-router-dom';

export interface HomeProps
{

}

const Home = (props: HomeProps) => {
    const navigate = useNavigate();

    return (
        <Box sx={{marginTop: '50px'}}>
            <TipsAndUpdatesTwoToneIcon fontSize='large' sx={{marginTop: '70px', marginBottom:'70px', transform: 'scale(5)'}}/>
            <h2>Aplikacja do obliczania i prognozowania zużycia energii przez oświetlenie uliczne</h2>
            <Button variant="outlined" onClick={() => navigate("/measurement")}>Rozpocznij obliczenia</Button>
        </Box>
    )
}

export default Home;