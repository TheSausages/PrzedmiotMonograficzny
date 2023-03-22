from rest_framework import serializers
from django.core.serializers.json import Serializer
from models import UsageRequest, PowerUsage


# class UsageRequestSerializer(serializers.ModelSerializer):
#     class UsageRequest:
#         model = UsageRequest
#         fields = ['power', 'latitude', 'longitude', 'start_date', 'end_date']

# class PowerUsageSerializer(Serializer):
#     def get_dump_object(self, obj):
#         return {
#             'total_power': obj.total_power,
#             ''
#         }