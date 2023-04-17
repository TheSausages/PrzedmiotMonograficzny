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
const RADAR_PUBLISHABLE_KEY = "prj_test_pk_53339be127338176200d5ee01140449ca09219b4";

export interface MeasurementProps
{

}

const Measurement = (props: MeasurementProps) => {
    // form
    const [inputs, setInputs] = useState({
        address: '',
        longitude: 0,
        latitude: 0,
        start: null,
        end: null,
        nrOfLamps: null,
        singleLampPower: null,
        observedPowerUsage: null
    });

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }

    const handleStartDateChange = (date: any, event: any) => {
        //date is a complex object, $d contains Date in format: Wed Feb 04 1998 21:51:31 GMT+0100 (czas środkowoeuropejski standardowy)
        let value = date.$d.toLocaleDateString()
        setInputs(values => ({...values, 'start': value}))
    };

    const handleEndDateChange = (date: any) => {
        let value = date.$d.toLocaleDateString()
        setInputs(values => ({...values, 'end': value}))
    };

    // adress input
    const [inputTypeAdress, setInputType] = React.useState(true);
    const handleLocationInputChange = (
        event: React.MouseEvent<HTMLElement>,
        newInputType: string,
      ) => {
          setInputType(!inputTypeAdress);
      };

    // initial map parameters
    const [viewport, setViewport] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 1,
        transitionDuration: 100,
      });

    //compute initial location and adress
    Radar.initialize(RADAR_PUBLISHABLE_KEY);

    const geocode = (address: string) => {}

    const reverseGeocode = (latitude: number, longitude: number) => {
        Radar.reverseGeocode({
            latitude: latitude,
            longitude: longitude
        }, function(err: any, result: any) {
            if (!err) {
                console.log(result)
                setInputs({...inputs, 'address': result.addresses[0].formattedAddress});
            } else {
                console.log(err);
            }
        });       
    }

    //get initial location

    useEffect(() => {
        Radar.trackOnce(function(err: any, result: any) {
            console.log('Get initial location and adress')
            if (!err) {
                console.log(result);
                reverseGeocode(result.location.latitude, result.location.longitude);
            } else {
                console.error(err);
            }
        });
    }, []); //HOW TO PROPERLY CALL IT ONCE???


    // get initial map
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          setViewport({
            ...viewport,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            zoom: 3.5,
          });
  
          setInputs({
              ...inputs,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
          });
        });
    });

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
                            name='address'
                            label="Adres"
                            variant="outlined"
                            disabled={!inputTypeAdress}
                            value={inputs.address}
                            onChange={handleChange}
                        />
                        <TextField
                            id="longitude"
                            name='longitude'
                            label="Długość geograficzna"
                            variant="outlined"
                            disabled={inputTypeAdress}
                            value={inputs.longitude}
                            onChange={handleChange}
                        />
                        <TextField
                            id="latitude"
                            name='latitude'
                            label="Szerokość geograficzna"
                            variant="outlined"
                            disabled={inputTypeAdress}
                            value={inputs.latitude}
                            onChange={handleChange}
                        />
                        <Typography variant="h5" color="text.secondary" component="p">
                            Bierząca wybrana lokalizacja
                        </Typography>

                        {/* ------------------- MAPA ----------------------- */}
                        <div className="outerWrapper">
                        {inputs.latitude && inputs.longitude && (
                            <div className="myMapWrapper">
                                <Map
                                    mapboxAccessToken={MAPBOX_TOKEN}
                                    initialViewState={viewport}
                                    mapStyle="mapbox://styles/mapbox/streets-v11"
                                    // class="myMap"
                                >
                                    <Marker
                                    longitude={inputs.longitude}
                                    latitude={inputs.latitude}
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
                            <DatePicker
                                label="Początek pomiaru"
                                // format="DD/MM/YYYY"
                                value={inputs.start}
                                onChange={handleStartDateChange}
                            />
                            <DatePicker
                                label="Koniec pomiaru"
                                value={inputs.end}
                                onChange={handleEndDateChange}
                            />
                        </LocalizationProvider>

                        <Typography variant="h5" color="text.secondary" component="p">
                            III. Dane techniczne
                        </Typography>
                        <TextField
                            id="nrOfLamps"
                            name='nrOfLamps'
                            label="Ilość lamp w instalacji"
                            variant="outlined"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            value={inputs.nrOfLamps}
                            onChange={handleChange}
                        />
                        <TextField
                            id="singleLampPower"
                            name='singleLampPower'
                            label="Moc pojednyńczej lampy"
                            variant="outlined"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            value={inputs.singleLampPower}
                            onChange={handleChange}
                        />

                        {/* const [name, setName] = React.useState('Cat in the Hat');                        <TextField */}
                        <TextField
                            id="observedPowerUsage"
                            name='observedPowerUsage'
                            label="Zaobserwowane rzeczywiste zużycie danych w danym okresie"
                            variant="outlined"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            value={inputs.observedPowerUsage}
                            onChange={handleChange}
                            // onChange={(event) => {
                            //     setName(event.target.value)
                            // }}
                        />

                        <Button
                            variant="contained"
                            onClick={(e) => {console.log(inputs)}}
                            endIcon={<SendIcon />}
                        >
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