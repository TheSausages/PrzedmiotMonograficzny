import React, { useState, useEffect }  from 'react';
import Radar from 'radar-sdk-js';

import Map, { Marker } from "react-map-gl";
import './Measurement.css';
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoicG9saXRlY2huaXg5OCIsImEiOiJjbGZ4cnMxNmowdHgxM3FvM2NodndtaHdiIn0.FwaEG3xKV59iMN9zgW-B7A"

export interface MeasurementProps
{

}

const Measurement = (props: MeasurementProps) => {
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

    return (
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
      );
}

export default Measurement;