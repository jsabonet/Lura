from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.triangulation_status, name='triangulation_status'),
    path('locate/', views.triangulation_locate, name='triangulation_locate'),
    path('test/', views.triangulation_test, name='triangulation_test'),
]
