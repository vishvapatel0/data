from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer
from .permissions import IsEnrollmentOwner


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for browsing available courses.
    All authenticated users can view courses.
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing enrollments with proper authorization.
    Students can only access their own enrollments.
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsEnrollmentOwner]

    def get_queryset(self):
        """
        Filter enrollments to only return the current user's enrollments.
        Admins can see all enrollments.
        """
        user = self.request.user
        if user.role == 'admin':
            return Enrollment.objects.all()
        return Enrollment.objects.filter(student=user)

    def perform_create(self, serializer):
        """
        Create enrollment with the current user as the student.
        This prevents users from creating enrollments for others.
        """
        course = serializer.validated_data['course']
        
        existing = Enrollment.objects.filter(
            student=self.request.user, 
            course=course,
            status='active'
        ).exists()
        
        if existing:
            raise serializers.ValidationError("Already enrolled in this course")
        
        active_count = course.enrollments.filter(status='active').count()
        if active_count >= course.capacity:
            raise serializers.ValidationError("Course is full")
        
        serializer.save(student=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Drop a course (soft delete by changing status).
        """
        enrollment = self.get_object()
        enrollment.status = 'dropped'
        enrollment.save()
        return Response({'message': 'Course dropped successfully'}, status=status.HTTP_200_OK)
