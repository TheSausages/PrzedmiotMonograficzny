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
                <Route path={report_path} element={<Report/>} />
                <Route path={home_path} element={<Home/>} />
            </Routes>
        </main>
    )
}

export default Content;