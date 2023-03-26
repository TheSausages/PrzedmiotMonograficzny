import React from 'react';

import { Paper, Typography} from '@mui/material';

export interface FooterProps
{

}

const Footer = (props: FooterProps) => {
    return (
        <Paper sx={{width: '100%', position: 'fixed', bottom: 0}} component="footer" square variant="outlined">
            <Typography variant="caption" color="initial">
                Copyright ©2023, PWR Wroclaw
            </Typography>
        </Paper>
    )
}

export default Footer;