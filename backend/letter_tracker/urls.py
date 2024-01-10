from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('letter_tracker', views.index, name='letter_tracker'),
    path('trackingData/<str:tracking_number>', views.get_tracking_data, name='get_tracking_data'),
]
