import React, {useEffect, useState} from 'react';
import {PowerUsageResponse} from "../../../data/PowerUsage";
import {PowerResponse} from "../../../data/Power";
import {Line, XAxis, YAxis, LineChart, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import moment from 'moment';
import {
    Grid,
    Paper, styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";

const ReportContainer = styled('div')({
    padding: '100px'
})

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
    nightStart: string
    nightEnd: string
    predictedValue: number | string
    realValue: number | string
    dateRange: string
}

function formatDate(date: Date): string {
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
            nightStart: sunset,
            nightEnd: sunrise,
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
    const [page, setPage] = useState<number>(0)
    const [perRow, setPerRow] = useState<number>(10)

    useEffect(() => {
        Promise.all([
            fetch(`http://127.0.0.1:8000/monograficzny/usage?power=${props.power}&latitude=${props.latitude}&longitude=${props.longitude}&start_date=${formatDate(props.start_date)}&end_date=${formatDate(props.end_date)}&lamp_number=${props.nr_lamps}`),
            fetch(`http://127.0.0.1:8000/monograficzny/power?usage=${props.usage}&latitude=${props.latitude}&longitude=${props.longitude}&start_date=${formatDate(props.start_date)}&end_date=${formatDate(props.end_date)}&lamp_number=${props.nr_lamps}`)
        ])
            .then(([usage, power]) => Promise.all([usage.json(), power.json()]))
            .then(([usage, power]) => {
                setPowerUsage(usage)
                setPower(power)
            })
    }, [])

    if (!power || !powerUsage) {
        return <div>No Response Yet</div>
    }

    const mappedData = mapToChartObject(powerUsage, power)

    return (
        <ReportContainer>
            <Grid container spacing={3}>
                {/* First Row */}
                <Grid item xs={9}>
                    <ResponsiveContainer height={400} width="100%">
                        <LineChart data={mappedData}>
                            <XAxis name="Night Start" dataKey="nightStart"/>
                            <YAxis/>
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Line name="Predicted Values" type="monotone" dataKey="predictedValue" stroke="#8884d8" />
                            <Line name="Actual Values" type="monotone" dataKey="realValue" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>

                <Grid item xs={3} margin={"auto"}>
                    <div style={{textAlign: 'left'}}>
                        <div>Total Predicted: {powerUsage.total_power.toFixed(2)}</div>
                        <div>Total Used: {props.usage.toFixed(2)}</div>
                    </div>
                </Grid>

                {/* Second Row */}
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Index</TableCell>
                                    <TableCell>Night Start</TableCell>
                                    <TableCell>Night End</TableCell>
                                    <TableCell>Real Value</TableCell>
                                    <TableCell>Predicted Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    mappedData
                                        .slice(page * perRow, (page + 1) * perRow)
                                        .map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{data.nightStart}</TableCell>
                                                <TableCell>{data.nightEnd}</TableCell>
                                                <TableCell>{data.realValue}</TableCell>
                                                <TableCell>{data.predictedValue}</TableCell>
                                            </TableRow>
                                        ))
                                }
                            </TableBody>
                        </Table>
                        <TableFooter>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={mappedData.length}
                                rowsPerPage={perRow}
                                page={page}
                                onPageChange={(event, page) => setPage(page)}
                                onRowsPerPageChange={(event) => {
                                    setPerRow(parseInt(event.target.value, 10));
                                    setPage(0)
                                }}
                            />
                        </TableFooter>
                    </TableContainer>
                </Grid>
            </Grid>
        </ReportContainer>
    )
}

export default Report;