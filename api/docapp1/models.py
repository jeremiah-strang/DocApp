from django import forms
from django.db import models

class UploadFileForm(forms.Form):
  name = forms.CharField(max_length=50)
  file = forms.FileField()

class UserUpload(models.Model):
  created = models.DateTimeField(auto_now_add=True)
  name = models.CharField(max_length=100, blank=True, default='')
  filePath = models.CharField(max_length=150, blank=True, default='')

  class Meta:
    ordering = ('created',)