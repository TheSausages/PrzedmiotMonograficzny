from django.db import models
from datetime import datetime
from sundata import Position


# class UsageRequest(models.Model):
#     power = models.IntegerField()
#     latitude = models.CharField(max_length=100)
#     longitude = models.CharField(max_length=100)
#     start_date = models.DateTimeField()
#     end_date = models.DateTimeField()
#
#     class Meta:
#         managed = False

def obj_dict(obj):
    if isinstance(obj, datetime):
        return obj.strftime("%m/%d/%Y'T'%H:%M:%S")
    else:
        return obj.__dict_

# DTO for api call
class UsageRequest:
    def __init__(self, power, latitude, longitude, start_date, end_date, lamp_number):
        self.power = power
        self.latitude = latitude
        self.longitude = longitude
        self.start_date = start_date
        self.end_date = end_date
        self.lamp_number = lamp_number

    def get_position(self):
        return Position(self.latitude, self.longitude)

    def get_start_date_as_datetime(self):
        return datetime.strptime(self.start_date, "%d-%m-%Y")

    def get_range_dates(self):
        start = datetime.strptime(self.start_date, "%d-%m-%Y").date()
        end = datetime.strptime(self.end_date, "%d-%m-%Y").date()
        return range((end - start).days + 1)

class SingleNightPowerUsageResponse:
    def __init__(self, power_usage, sunset, sunrise):
        self.power_usage = power_usage
        self.sunset = sunset
        self.sunrise = sunrise

    def __dict__(self):
        return {
            'power_usage': self.power_usage,
            'sunset': self.sunset.strftime("%m/%d/%YT%H:%M:%S"),
            'sunrise': self.sunrise.strftime("%m/%d/%YT%H:%M:%S")
        }

class PowerUsageResponse:
    def __init__(self):
        self.total_power = 0
        self.power_each_day = []

    def add_night_power_usage(self, single_night_power_usage, sunset, sunrise):
        self.total_power += single_night_power_usage
        self.power_each_day.append(SingleNightPowerUsageResponse(
            single_night_power_usage, sunset, sunrise
        ))

    def __dict__(self):
        return {
            'total_power': self.total_power,
            'power_each_night': [day.__dict__() for day in self.power_each_day]
        }

class PowerRequest:
    def __init__(self, usage, latitude, longitude, start_date, end_date, lamp_number):
        self.usage = usage
        self.latitude = latitude
        self.longitude = longitude
        self.start_date = start_date
        self.end_date = end_date
        self.lamp_number = lamp_number

    def get_position(self):
        return Position(self.latitude, self.longitude)

    def get_start_date_as_datetime(self):
        return datetime.strptime(self.start_date, "%d-%m-%Y")

    def get_range_dates(self):
        start = datetime.strptime(self.start_date, "%d-%m-%Y").date()
        end = datetime.strptime(self.end_date, "%d-%m-%Y").date()
        return range((end - start).days + 1)

class PowerResponse:
    def __init__(self):
        self.usages = []

    def add_single_night_usage(self, single_night_power_usage, sunset, sunrise):
        self.usages.append(SingleNightPowerUsageResponse(
            single_night_power_usage, sunset, sunrise
        ))

    def __dict__(self):
        return {
            'power_each_night': [day.__dict__() for day in self.usages]
        }