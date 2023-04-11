import React from 'react';
import {Route, Routes} from 'react-router-dom';
import { home_path, measurement_path, report_path } from '../../UrlUtilities/Paths';
import Home from './subcomponents/Home';
import Measurement from './subcomponents/Measurement';
import Report from './subcomponents/Report';

export interface ContentProps
{

}

const Content = (props: ContentProps) => {
    return (
        <main>
            <Routes>
                <Route path={measurement_path} element={<Measurement/>} />
                <Route path={report_path} element={<Report
                    power={20} usage={5176.666666666667} latitude={51.1052862455}
                    longitude={17.055921443} start_date={new Date(2023,2, 1)}
                    nr_lamps={2} end_date={new Date(2023,2,31)}
                />} />
                <Route path={home_path} element={<Home/>} />
            </Routes>
        </main>
    )
}

export default Content;