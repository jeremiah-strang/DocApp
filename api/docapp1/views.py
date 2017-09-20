from django.core.files.base import ContentFile
from django.contrib.auth.models import User, Group
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from docapp.settings import USER_UPLOADS_FOLDER
from docapp1.models import UserUpload, UploadFileForm
from docapp1.serializers import UserSerializer, GroupSerializer
from docapp1.serializers import UserUploadSerializer
from rest_framework import viewsets
from rest_framework.parsers import JSONParser, FileUploadParser
from rest_framework.renderers import JSONRenderer

import os
import base64
from wand.image import Image

class UserViewSet(viewsets.ModelViewSet):
  """
  API endpoint that allows users to be viewed or edited.
  """
  queryset = User.objects.all().order_by('-date_joined')
  serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
  """
  API endpoint that allows groups to be viewed or edited.
  """
  queryset = Group.objects.all()
  serializer_class = GroupSerializer

@csrf_exempt
def user_upload_list(request):
  if request.method == 'GET':
    userUploads = UserUpload.objects.all()
    serializer = UserUploadSerializer(userUploads, many=True)
    return JsonResponse(serializer.data, safe=False)

  elif request.method == 'POST':
    # file = request.POST.get('file') # request.FILES['file']
    file = request.FILES['file']
    pdfPath = os.path.join(USER_UPLOADS_FOLDER, file.name)
    pngPath = pdfPath.replace('.pdf', '.png')
    fout = open(pdfPath, 'wb+')
    file_content = ContentFile(file.read())
    # Iterate through the chunks.
    for chunk in file_content.chunks():
        fout.write(chunk)
    fout.close()
    # numPages = 0
    toDelete = []
    with Image(filename=pdfPath, resolution=100) as img:
      # numPages = len(img.sequence)
      for i, page in enumerate(img.sequence):
        converted = Image(image=page)
        converted = converted.convert('png')
        fName = pngPath.replace('.png', '-p' + str(i) + '.png')
        converted.save(filename=fName)
        toDelete.append(fName)
      # with img.convert('png') as converted:
      #   converted.save(filename=pngPath)
    # toDelete = None
    # if numPages > 1:
    #   toDelete = []
    #   for i in range(numPages):
    #     toDelete.append(pngPath.replace('.png', '-' + str(i) + '.png'))
    #   pngPath = pngPath.replace('.png', '-0.png')
    # else:
    #   toDelete = [pngPath]
    encoded_string = base64.b64encode(open(toDelete[0], 'rb').read())
    res = HttpResponse(encoded_string, content_type='image/png', status=200)
    os.remove(pdfPath)
    for fPath in toDelete:
      os.remove(fPath)
    return res

@csrf_exempt
def user_upload_detail(request, pk):
  """
  Retrieve, update or delete a user upload.
  """
  try:
    userUpload = UserUpload.objects.get(pk=pk)
  except UserUpload.DoesNotExist:
    return HttpResponse(status=404)

  if request.method == 'GET':
    serializer = UserUploadSerializer(userUpload)
    return JsonResponse(serializer.data)

  elif request.method == 'PUT':
    data = JSONParser().parse(request)
    serializer = UserUploadSerializer(userUpload, data=data)
    if serializer.is_valid():
      serializer.save()
      return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=400)

  elif request.method == 'DELETE':
    userUpload.delete()
    return HttpResponse(status=204)