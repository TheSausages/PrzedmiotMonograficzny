import React from 'react';
import Radar from 'radar-sdk-js';

export interface MeasurementProps
{

}

const Measurement = (props: MeasurementProps) => {
    const publishableKey = "prj_test_pk_53339be127338176200d5ee01140449ca09219b4";

  // Radar.initialize(publishableKey);
  Radar.initialize(publishableKey, {
    cacheLocationMinutes: 30
  });

  Radar.trackOnce(function(err: any, result: any) {
    if (!err) {
      // do something with result.location, result.events, result.user
      
      // ZWRACA BIERZACA LOKALIZACJE I ŚLE DO SERWERA...?
      console.log(result);
    }

//     Radar.getLocation(function(err, result) {
//     if (!err) {
//       // do something with result.location
      
//       // ZWRACA BIERZACA LOKALIZACJE
//       console.log(result);
//     }
//   });

//   // 20 jay st brooklyn ny
//   Radar.geocode({query: 'sołtysia 23c katowice'}, function(err, result) {
//     console.log('geocode adress')
//     if (!err) {
//       // do something with result.addresses

//       console.log(result);
//     } else {
//       console.log(err);
//     }
//   });

//   Radar.reverseGeocode({
//     latitude: 40.783826,
//     longitude: -73.975363
//   }, function(err, result) {
//     console.log('reverse geocode latitude and longitude')
//     if (!err) {
//       // do something with result.addresses

//       console.log(result);
//     } else {
//       console.log(err);
//     }
//   });

//   Radar.ipGeocode(function(err, result) {
//     console.log('reverse geocode ip')
//     if (!err) {
//       // do something with result.address

//       console.log(result);
//     } else {
//       console.log(err);
//     }
//   });

//   Radar.autocomplete({
//     query: 'krakow',
//     near: {
//       latitude: 40.783826,
//       longitude: -73.975363
//     },
//     limit: 10
//   }, function(err, result) {
//     console.log('autocomplete adress')
//     if (!err) {
//       // do something with result.addresses

//       console.log(result);
//     } else {
//       console.log(err);
//     }
//   });
  });

    return (
        <div>
            Measurement
        </div>
    )
}

export default Measurement;