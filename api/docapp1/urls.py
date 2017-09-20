from django.conf.urls import url
from docapp1 import views

urlpatterns = [
    url(r'^useruploads/$', views.user_upload_list),
    url(r'^useruploads/(?P<pk>[0-9]+)/$', views.user_upload_detail),
]