from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('letter_tracker', views.index, name='letter_tracker'),
]
