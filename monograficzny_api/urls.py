from django.contrib import admin
from django.urls import path, include

from monograficzny_api import views

urlpatterns = [
    path('usage', views.usage_request),
    path('power', views.power_request)
]
