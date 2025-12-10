from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, default='student')
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        app_label = 'api'


class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    credits = models.IntegerField(default=3)
    capacity = models.IntegerField(default=30)
    instructor = models.CharField(max_length=100)

    class Meta:
        app_label = 'api'

    def __str__(self):
        return f"{self.code}: {self.name}"


class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    grade = models.CharField(max_length=2, null=True, blank=True)
    status = models.CharField(max_length=20, default='active')

    class Meta:
        app_label = 'api'
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.email} - {self.course.code}"
