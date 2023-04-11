import React, {useEffect, useState} from 'react';
import {PowerUsageResponse, SingleNightPowerUsageResponse} from "../../../data/PowerUsage";
import {PowerResponse} from "../../../data/Power";
import {Line, XAxis, YAxis, LineChart, CartesianGrid, Tooltip, Legend} from "recharts";
import moment from 'moment';

export interface ReportProps
{
    power: number,
    usage: number,
    nr_lamps: number,
    longitude: number,
    latitude: number,
    start_date: Date,
    end_date: Date
}

interface ChartObject {
    name: string
    predictedValue: number | string
    realValue: number | string
}

function formatDate(date: Date): string {
    console.log(moment(date).format('DD-MM-YYYY'), date)
    return moment(date).format('DD-MM-YYYY')
}

function mapToChartObject(usage: PowerUsageResponse, power: PowerResponse): ChartObject[] {
    let arr = []
    for(let i = 0; i < usage.power_each_night.length; i++) {
        let usage_i = usage.power_each_night[i]
        let power_i = power.power_each_night[i]
        let sunset = moment(usage_i.sunset, 'MM/DD/YYYYThh:mm:ss').format('DD-MM-YYYY')
        let sunrise = moment(usage_i.sunrise, 'MM/DD/YYYYThh:mm:ss').format('DD-MM-YYYY')

        arr[i] = {
            name: sunset,
            predictedValue: usage_i.power_usage.toFixed(2),
            realValue: power_i.power_usage.toFixed(2),
            dateRange: `${sunset} - ${sunrise}`
        } as ChartObject
    }

    return arr;
}

const Report = (props: ReportProps) => {
    const [powerUsage, setPowerUsage] = useState<PowerUsageResponse | undefined>(undefined)
    const [power, setPower] = useState<PowerResponse | undefined>(undefined)

    useEffect(() => {
        Promise.all([
            fetch(`http://127.0.0.1:8000/monograficzny/usage?power=${props.power}&latitude=${props.latitude}&longitude=${props.longitude}&start_date=${formatDate(props.start_date)}&end_date=${formatDate(props.end_date)}&lamp_number=${props.nr_lamps}`),
            fetch(`http://127.0.0.1:8000/monograficzny/power?usage=${props.usage}&latitude=${props.latitude}&longitude=${props.longitude}&start_date=${formatDate(props.start_date)}&end_date=${formatDate(props.end_date)}&lamp_number=${props.nr_lamps}`)
        ])
            .then(([power, usage]) => Promise.all([power.json(), usage.json()]))
            .then(([power, usage]) => {
                setPower(power)
                setPowerUsage(usage)
            })
    }, [])

    if (!power || !powerUsage) {
        return <div>No Response Yet</div>
    }

    console.log(mapToChartObject(powerUsage, power))

    return (
        <>
            <div>
                Report
            </div>
            <LineChart width={500} height={300} data={mapToChartObject(powerUsage, power)}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Line name="Predicted Values" type="monotone" dataKey="predictedValue" stroke="#8884d8" />
                <Line name="Actual Values" type="monotone" dataKey="realValue" stroke="#82ca9d" />
            </LineChart>
        </>
    )
}

export default Report;