import React, {useState, useEffect, useRef} from 'react';
import Radar from 'radar-sdk-js';

import Map, {MapRef, Marker} from "react-map-gl";
import './Measurement.css';
import "mapbox-gl/dist/mapbox-gl.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Grid from '@mui/material/Grid';
import {Fade, Typography} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";

const MAPBOX_TOKEN = "pk.eyJ1IjoicG9saXRlY2huaXg5OCIsImEiOiJjbGZ4cnMxNmowdHgxM3FvM2NodndtaHdiIn0.FwaEG3xKV59iMN9zgW-B7A"
const RADAR_PUBLISHABLE_KEY = "prj_test_pk_53339be127338176200d5ee01140449ca09219b4";

export interface MeasurementProps
{

}

const Measurement = (props: MeasurementProps) => {
    let navigate = useNavigate();
    const mapRef = useRef<MapRef | null>(null);

    // form
    const [inputs, setInputs] = useState({
        address: '',
        longitude: 50,
        latitude: 50,
        start: new Date(),
        end: new Date(),
        nrOfLamps: 0,
        singleLampPower: 0,
        observedPowerUsage: 0,
        zoom: 6.5,
        transitionDuration: 100,
    });

    const startCalc = (event: any) => {
        navigate('/report', {
            state: {
                power: Number(inputs.singleLampPower),
                usage: Number(inputs.observedPowerUsage),
                latitude: inputs.latitude,
                longitude: inputs.longitude,
                nr_lamps: Number(inputs.nrOfLamps),
                end_date: inputs.end,
                start_date: inputs.start
            }
        })
    }

    const handleChange = (event: any) => {
        event.preventDefault();

        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }

    const handleAddressChange = (event: any) => {
        event.preventDefault();

        const newAddress = event.target.value;

        Radar.geocode({
            query: newAddress
        }, function(err: any, result: any) {
            if (!err) {
                setInputs(values => ({
                    ...values,
                    address: newAddress,
                    latitude: result.addresses[0].latitude,
                    longitude: result.addresses[0].longitude
                }))
            } else {
                console.log(err);
            }
        });
    }

    const handleStartDateChange = (date: any) => {
        setInputs(values => ({...values, start: date}))
    };

    const handleEndDateChange = (date: any) => {
        setInputs(values => ({...values, end: date}))
    };

    // adress input
    const [inputTypeAdress, setInputType] = React.useState(true);
    const handleLocationInputChange = (
        event: React.MouseEvent<HTMLElement>,
        newInputType: string,
      ) => {
          setInputType(!inputTypeAdress);
      };

    //compute initial location and adress
    Radar.initialize(RADAR_PUBLISHABLE_KEY);

    //get initial location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log('Get initial location and address')
            Radar.reverseGeocode({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            }, function (err: any, result: any) {
                if (!err) {
                    setInputs(prevState => ({
                        ...prevState,
                        address: result.addresses[0].formattedAddress,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }));
                } else {
                    console.error(err)
                }
            });
        });
    }, []);

    // When inputing coordinates, update map and adress
    useEffect(() => {
        Radar.reverseGeocode({
            latitude: inputs.latitude,
            longitude: inputs.longitude
        }, function(err: any, result: any) {
            if (!err) {
                setInputs(prevState => ({
                    ...prevState,
                    address: result.addresses[0].formattedAddress
                }));
            } else {
                console.log(err);
            }
        });

        mapRef.current?.flyTo({
            center: [inputs.longitude, inputs.latitude],
            duration: 2000
        })
    }, [inputs.longitude, inputs.latitude])

    return (
        <div>
            <Grid container spacing={2} padding={5}>
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
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddressChange(e)
                                }
                            }}
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
                                        ref={mapRef}
                                        mapboxAccessToken={MAPBOX_TOKEN}
                                        initialViewState={inputs}
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
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Początek pomiaru"
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
                        />

                        <Button
                            variant="contained"
                            onClick={(e) => {startCalc(e)}}
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