from rest_framework import serializers
from .models import User, Course, Enrollment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role']


class CourseSerializer(serializers.ModelSerializer):
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'description', 'credits', 'capacity', 'instructor', 'enrolled_count']

    def get_enrolled_count(self, obj):
        return obj.enrollments.filter(status='active').count()


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source='course', write_only=True
    )
    student = UserSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'course_id', 'enrolled_at', 'grade', 'status']
        read_only_fields = ['student', 'enrolled_at', 'grade']
