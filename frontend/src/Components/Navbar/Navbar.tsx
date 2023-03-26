import { AppBar, styled, Button } from '@mui/material';
import {NavLink} from 'react-router-dom';
import React from 'react';
import { home_path, measurement_path, report_path } from '../../UrlUtilities/Paths';

export interface NavbarProps
{

}

const StyledDiv = styled('div')({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "stretch",
    alignContent: "flex-start"
});

const Navbar = (props: NavbarProps) => {
    return (
        <AppBar position='static' sx={{borderRadius: '10px', marginTop: '5px', width: '90%', marginLeft: '5%'}} >
            <StyledDiv>
                <div>
                    <Button color="inherit" component={NavLink} to={home_path}>Home</Button>
                    <Button color="inherit" component={NavLink} to={measurement_path}>Pomiar</Button>
                    <Button color="inherit" component={NavLink} to={report_path}>Podsumowanie</Button>
                </div>
            </StyledDiv>
        </AppBar>
    )
}

export default Navbar;