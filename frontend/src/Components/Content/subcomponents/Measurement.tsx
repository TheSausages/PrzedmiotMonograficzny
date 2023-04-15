import React, { useState, useEffect }  from 'react';
import Radar from 'radar-sdk-js';

import Map, { Marker } from "react-map-gl";
import './Measurement.css';
import "mapbox-gl/dist/mapbox-gl.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const MAPBOX_TOKEN = "pk.eyJ1IjoicG9saXRlY2huaXg5OCIsImEiOiJjbGZ4cnMxNmowdHgxM3FvM2NodndtaHdiIn0.FwaEG3xKV59iMN9zgW-B7A"

export interface MeasurementProps
{

}

const Measurement = (props: MeasurementProps) => {
    const [inputTypeAdress, setInputType] = React.useState(true);
    const [viewport, setViewport] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 1,
        transitionDuration: 100,
      });
    useEffect(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        setViewport({
          ...viewport,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          zoom: 3.5,
        });
      });
    });

    const handleLocationInputChange = (
      event: React.MouseEvent<HTMLElement>,
      newInputType: string,
    ) => {
        setInputType(!inputTypeAdress);
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
                >
                Podaj dane do pomiaru
                </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={2}>
                        <Typography variant="h5" color="text.secondary" component="p">
                            I. Lokalizacja
                        </Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={inputTypeAdress ? "address" : "coordinates"}
                            exclusive
                            onChange={handleLocationInputChange}
                            fullWidth
                        >
                            <ToggleButton value="address">
                                Adres <MapIcon />
                            </ToggleButton>
                            <ToggleButton value="coordinates">
                                Koordynaty <MyLocationIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <TextField
                            id="addres"
                            label="Adres"
                            variant="outlined"
                            disabled={!inputTypeAdress}
                        />
                        <TextField
                            id="longitude"
                            label="Długość geograficzna"
                            variant="outlined"
                            disabled={inputTypeAdress}
                        />
                        <TextField
                            id="latitude"
                            label="Szerokość geograficzna"
                            variant="outlined"
                            disabled={inputTypeAdress}
                        />
                        <Typography variant="h5" color="text.secondary" component="p">
                            Bierząca wybrana lokalizacja
                        </Typography>
                        <div className="outerWrapper">
                        {viewport.latitude && viewport.longitude && (
                            <div className="myMapWrapper">
                            {/* <h5>Your Location:</h5> */}
                                <Map
                                    mapboxAccessToken={MAPBOX_TOKEN}
                                    initialViewState={viewport}
                                    mapStyle="mapbox://styles/mapbox/streets-v11"
                                    // class="myMap"
                                >
                                    <Marker
                                    longitude={viewport.longitude}
                                    latitude={viewport.latitude}
                                    />
                                </Map>
                            </div>
                        )}
                        </div>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={2}>
                        <Typography variant="h5" color="text.secondary" component="p">
                            II. Okres pomiaru
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Początek pomiaru" />
                            <DatePicker label="Koniec pomiaru" />
                        </LocalizationProvider>

                        <Typography variant="h5" color="text.secondary" component="p">
                            III. Dane techniczne
                        </Typography>
                        <TextField
                            id="nrOfLamps"
                            label="Ilość lamp w instalacji"
                            variant="outlined"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            id="sinleLampPower"
                            label="Moc pojednyńczej lampy"
                            variant="outlined"
                            type="number"
                        />

                        {/* const [name, setName] = React.useState('Cat in the Hat');                        <TextField */}
                        <TextField
                            id="observedPowerUsage"
                            label="Zaobserwowane rzeczywiste zużycie danych w danym okresie"
                            variant="outlined"
                            type="number"
                            // value={name}
                            // onChange={(event) => {
                            //     setName(event.target.value)
                            // }}
                        />

                        <Button variant="contained" endIcon={<SendIcon />}>
                            Przeprowadź analizę
                        </Button> 
                    </Stack>
                </Grid>
            </Grid> 
        </div>
    );
}

export default Measurement;

    // const [viewport, setViewport] = useState({
    //     latitude: 0,
    //     longitude: 0,
    //     zoom: 1,
    //     transitionDuration: 100,
    //   });
    // useEffect(() => {
    //   navigator.geolocation.getCurrentPosition((pos) => {
    //     setViewport({
    //       ...viewport,
    //       latitude: pos.coords.latitude,
    //       longitude: pos.coords.longitude,
    //       zoom: 3.5,
    //     });
    //   });
    // });


        // <div className="outerWrapper">
        //   {viewport.latitude && viewport.longitude && (
        //     <div className="myMapWrapper">
        //       {/* <h5>Your Location:</h5> */}
        //       <Map
        //         mapboxAccessToken={MAPBOX_TOKEN}
        //         initialViewState={viewport}
        //         mapStyle="mapbox://styles/mapbox/streets-v11"
        //         // class="myMap"
        //       >
        //         <Marker
        //           longitude={viewport.longitude}
        //           latitude={viewport.latitude}
        //         />
        //       </Map>
        //     </div>
        //   )}
        // </div>