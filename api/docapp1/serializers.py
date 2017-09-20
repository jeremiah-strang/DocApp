from django.contrib.auth.models import User, Group
from rest_framework import serializers
from docapp1.models import UserUpload

class UserSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = User
    fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Group
    fields = ('url', 'name')

class UserUploadSerializer(serializers.Serializer):
  id = serializers.IntegerField(read_only=True)
  name = serializers.CharField(required=False, allow_blank=True, max_length=100)
  filePath = serializers.CharField(required=False, allow_blank=False, max_length=150)

  def create(self, validated_data):
    return UserUpload.objects.create(**validated_data)

  def update(self, instance, validated_data):
    instance.name = validated_data.get('name', instance.name)
    # instance.filePath = instance.name + '.pdf'
    instance.save()
    return instance