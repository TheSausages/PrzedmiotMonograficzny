from datetime import timedelta

from django.http import HttpResponse
from sundata import SunData

from monograficzny_api.models import UsageRequest


def usage_request(request):
    if request.method == 'GET':
        # Get object from request
        usageReq = UsageRequest(
            int(request.GET.get('power', 12)),
            int(request.GET.get('latitude', 50)),
            int(request.GET.get('longitude', 50)),
            request.GET.get('start_date', '10-03-2022'),
            request.GET.get('end_date', '22-03-2022')
        )

        power_used = 0

        # Get the position
        position = usageReq.get_position()
        for nr_day in usageReq.get_range_dates():
            # Start where we want to check usage - we check sunset
            day_start = usageReq.get_start_date_as_datetime() + timedelta(days=nr_day)
            data_start = SunData(position, day_start)
            data_start.calculate_sun_data()
            sunset = data_start.sunset

            # End where we want to check usage - sunrise for the next day
            day_start = usageReq.get_start_date_as_datetime() + timedelta(days=nr_day + 1)
            data_start = SunData(position, day_start)
            data_start.calculate_sun_data()
            sunrise = data_start.sunrise

            print(sunset)
            print(sunrise)

            # Power used = power (kWh) * hours (total seconds between sunset -> sunrise divided by 3600)
            power_used += usageReq.power * (sunrise - sunset).total_seconds() / 3600

        return HttpResponse(power_used)

    return {
        "message": "An error"
    }