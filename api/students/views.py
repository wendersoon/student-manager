from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from django.shortcuts import get_object_or_404

from .serializers import StudentSeralizer
from .models import Student


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSeralizer
    pagination_class = PageNumberPagination
    http_method_names = ['get', 'post', 'patch', 'delete']

    def list(self, request):
        students = self.get_queryset()
        page = self.paginate_queryset(students)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        pass

    def retrieve(self, request, pk=None):
        pass

    def update(self, request, pk=None):
        pass

    def partial_update(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass
    
