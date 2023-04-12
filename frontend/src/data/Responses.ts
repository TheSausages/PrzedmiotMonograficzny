export interface SingleNightPowerUsageResponse {
    power_usage: number,
    sunset: Date,
    sunrise: Date
}

export interface PowerUsageResponse {
    total_power: number,
    power_each_night: SingleNightPowerUsageResponse[]
}

export interface PowerResponse {
    power_each_night: SingleNightPowerUsageResponse[]
}