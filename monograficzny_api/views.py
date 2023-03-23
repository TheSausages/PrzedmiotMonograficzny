from datetime import timedelta
from django.http import JsonResponse
from sundata import SunData

from monograficzny_api.models import UsageRequest, PowerUsageResponse, PowerRequest, PowerResponse


def usage_request(request):
    if request.method == 'GET':
        # Get object from request
        usageReq = UsageRequest(
            float(request.GET.get('power', 12)),
            float(request.GET.get('latitude', 50)),
            float(request.GET.get('longitude', 50)),
            request.GET.get('start_date', '10-03-2022'),
            request.GET.get('end_date', '22-03-2022')
        )

        powers = PowerUsageResponse()

        # Get the position
        position = usageReq.get_position()
        for nr_day in usageReq.get_range_dates():
            # Start where we want to check usage - we check sunset
            day_start = usageReq.get_start_date_as_datetime() + timedelta(days=nr_day)
            data_start = SunData(position, day_start)
            data_start.calculate_sun_data()
            sunset = data_start.sunset

            # End where we want to check usage - sunrise for the next day
            day_end = usageReq.get_start_date_as_datetime() + timedelta(days=nr_day + 1)
            sunrise = None
            if day_end == usageReq.end_date:
                sunrise = usageReq.end_date
            else:
                data_end = SunData(position, day_end)
                data_end.calculate_sun_data()
                sunrise = data_end.sunrise

            # Power used = power (kWh) * hours (total seconds between sunset -> sunrise divided by 3600)
            day_power_usage = usageReq.power * (sunrise - sunset).total_seconds() / 3600

            powers.add_night_power_usage(day_power_usage, sunset, sunrise)

        return JsonResponse(powers.__dict__())

    return {
        "message": "An error when calculating power usage"
    }

def power_request(request):
    if request.method == 'GET':
        # Get object from request
        powerReq = PowerRequest(
            float(request.GET.get('usage', 100)),
            float(request.GET.get('latitude', 50)),
            float(request.GET.get('longitude', 50)),
            request.GET.get('start_date', '10-03-2022'),
            request.GET.get('end_date', '22-03-2022')
        )

        # Get the position
        position = powerReq.get_position()

        # hours of light in the whole timespan
        hours = 0
        for nr_day in powerReq.get_range_dates():
            # Start where we want to check usage - we check sunset
            day_start = powerReq.get_start_date_as_datetime() + timedelta(days=nr_day)
            data_start = SunData(position, day_start)
            data_start.calculate_sun_data()
            sunset = data_start.sunset

            # End where we want to check usage - sunrise for the next day
            day_end = powerReq.get_start_date_as_datetime() + timedelta(days=nr_day + 1)
            sunrise = None
            if day_end == powerReq.end_date:
                sunrise = powerReq.end_date
            else:
                data_end = SunData(position, day_end)
                data_end.calculate_sun_data()
                sunrise = data_end.sunrise

            hours += ((sunrise - sunset).total_seconds() / 3600)

        return JsonResponse(PowerResponse(powerReq.usage / hours).__dict__())


    return {
        "message": "An error when calculating power of a lamp"
    }