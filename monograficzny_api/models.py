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

# DTO for api call
class UsageRequest:
    def __init__(self, power, latitude, longitude, start_date, end_date):
        self.power = power
        self.latitude = latitude
        self.longitude = longitude
        self.start_date = start_date
        self.end_date = end_date

    def get_position(self):
        return Position(self.latitude, self.longitude)

    def get_start_date_as_datetime(self):
        return datetime.strptime(self.start_date, "%d-%m-%Y")

    def get_range_dates(self):
        start = datetime.strptime(self.start_date, "%d-%m-%Y").date()
        end = datetime.strptime(self.end_date, "%d-%m-%Y").date()
        return range((end - start).days + 1)
