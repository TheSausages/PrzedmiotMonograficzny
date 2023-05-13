import React, {useEffect, useState} from 'react';
import {PowerUsageResponse, PowerResponse} from "../../../data/Responses";
import {Line, XAxis, YAxis, LineChart, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import moment from 'moment';
import {
    Box,
    CircularProgress,
    Fade,
    Grid,
    Paper, styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import { useLocation } from "react-router-dom";

const ReportContainer = styled('div')({
    marginInline: '100px',
    marginTop: '50px'
})

export interface ReportProps
{
    power?: number,
    usage?: number,
    nr_lamps?: number,
    longitude?: number,
    latitude?: number,
    start_date?: Date,
    end_date?: Date
}

interface ChartObject {
    nightStart: moment.Moment
    nightEnd: moment.Moment
    predictedValue: number | string
    realValue: number | string
    dateRange: string
}

function formatDate(date: Date): string {
    return moment(date).format('DD-MM-YYYY')
}

const backendUrl = 'http://127.0.0.1:8000/monograficzny'
function makeRequest(endpoint: string, params: ReportProps): string {
    const searchParams = new URLSearchParams();
    searchParams.append("latitude", params.latitude!.toString());
    searchParams.append("longitude", params.longitude!.toString());
    searchParams.append("start_date", formatDate(params.start_date!));
    searchParams.append("end_date", formatDate(params.end_date!));
    searchParams.append("lamp_number", params.nr_lamps!.toString());

    if (endpoint === 'usage') {
        searchParams.append("power", params.power!.toString());
        return `${backendUrl}/${endpoint}?${searchParams.toString()}`
    }
    searchParams.append("usage", params.usage!.toString());

    return `${backendUrl}/${endpoint}?${searchParams.toString()}`
}

function mapToChartObject(usage: PowerUsageResponse, power: PowerResponse): ChartObject[] {
    let arr = []
    for(let i = 0; i < usage.power_each_night.length; i++) {
        let usage_i = usage.power_each_night[i]
        let power_i = power.power_each_night[i]
        let sunset = moment(usage_i.sunset, 'MM/DD/YYYYThh:mm:ss')
        let sunrise = moment(usage_i.sunrise, 'MM/DD/YYYYThh:mm:ss')

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

const Report = () => {

    const [powerUsage, setPowerUsage] = useState<PowerUsageResponse | undefined>(undefined)
    const [power, setPower] = useState<PowerResponse | undefined>(undefined)
    const [page, setPage] = useState<number>(0)
    const [perRow, setPerRow] = useState<number>(10)

    const props = useLocation().state as ReportProps

    useEffect(() => {
        if (props !== null) {
            Promise.all([
                fetch(makeRequest('usage', props)),
                fetch(makeRequest('power', props))
            ])
                .then(([usage, power]) => Promise.all([usage.json(), power.json()]))
                .then(([usage, power]) => {
                    setPowerUsage(usage)
                    setPower(power)
                })
        }
    }, [props])

    if (!props) {
        console.log("in")
        return <div>
            No data passed - No calculation possible!
        </div>
    }

    if (!power || !powerUsage) {
        return (
            <Fade in={true} timeout={500}>
                <Box sx={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div>Data Loading in Progress</div>
                    <div style={{ marginTop: '2rem' }}><CircularProgress size={'5rem'} /></div>
                </Box>
            </Fade>
        )
    }

    console.log(props)

    const mappedData = mapToChartObject(powerUsage, power)

    return (
        <ReportContainer>
            <Grid container spacing={3}>
                {/* First Row */}
                <Fade in={true} timeout={1000}>
                    <Grid item xs={9}>
                        <ResponsiveContainer height={400} width="100%">
                            <LineChart data={mappedData.map(chartObj => ({ ...chartObj, nightStart: chartObj.nightStart.format('YYYY-MM-DD') }))}>
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
                </Fade>

                <Fade in={true} timeout={1000}>
                    <Grid item xs={3} margin={"auto"}>
                        <Box style={{ textAlign: 'left' }}>
                            <Box style={{ borderBottom: 'solid black 1px', width: 'fit-content', marginBottom: '7px' }}>
                                <div>Basic Information</div>
                            </Box>
                            <div>Total Predicted: {powerUsage.total_power.toFixed(2)}</div>
                            <div>Total Used: {props.usage!.toFixed(2)}</div>
                        </Box>
                    </Grid>
                </Fade>

                {/* Second Row */}
                <Fade in={true} timeout={1000}>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Index</TableCell>
                                        <TableCell>Night Start</TableCell>
                                        <TableCell>Night End</TableCell>
                                        <TableCell>Real Usage</TableCell>
                                        <TableCell>Predicted Usage</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        mappedData
                                            .slice(page * perRow, (page + 1) * perRow)
                                            .map((data, index) => (
                                                <TableRow key={(page * perRow) + index}>
                                                    <TableCell>{(page * perRow) + index + 1}</TableCell>
                                                    <TableCell>{data.nightStart.format('YYYY-MM-DD hh:mm:ss')}</TableCell>
                                                    <TableCell>{data.nightEnd.format('YYYY-MM-DD hh:mm:ss')}</TableCell>
                                                    <TableCell>{data.realValue}</TableCell>
                                                    <TableCell>{data.predictedValue}</TableCell>
                                                </TableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                    </Grid>
                </Fade>
            </Grid>
        </ReportContainer>
    )
}

export default Report;