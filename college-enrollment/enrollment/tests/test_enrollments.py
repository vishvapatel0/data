import pytest
from django.test import TestCase
from rest_framework.test import APIClient
from enrollment.api.models import User, Course, Enrollment


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def users(db):
    admin = User.objects.create_user(
        email='admin@example.com',
        password='admin123',
        full_name='Admin User',
        role='admin'
    )
    user1 = User.objects.create_user(
        email='user1@example.com',
        password='user123',
        full_name='Student One',
        role='student'
    )
    attacker = User.objects.create_user(
        email='attacker@example.com',
        password='attacker123',
        full_name='Test Account',
        role='student'
    )
    return {'admin': admin, 'user1': user1, 'attacker': attacker}


@pytest.fixture
def courses(db):
    course1 = Course.objects.create(
        code='CS101',
        name='Introduction to Computer Science',
        description='Fundamentals of programming',
        credits=3,
        capacity=30,
        instructor='Dr. Smith'
    )
    course2 = Course.objects.create(
        code='MATH201',
        name='Calculus II',
        description='Advanced calculus',
        credits=4,
        capacity=25,
        instructor='Dr. Johnson'
    )
    return {'cs101': course1, 'math201': course2}


@pytest.fixture
def enrollments(db, users, courses):
    enrollment1 = Enrollment.objects.create(
        student=users['user1'],
        course=courses['cs101'],
        status='active'
    )
    enrollment2 = Enrollment.objects.create(
        student=users['attacker'],
        course=courses['math201'],
        status='active'
    )
    return {'enrollment1': enrollment1, 'enrollment2': enrollment2}


def get_token(client, email, password):
    response = client.post('/api/auth/login/', {
        'email': email,
        'password': password
    }, format='json')
    return response.data.get('access')


@pytest.mark.django_db
class TestAuthentication:
    def test_login_success(self, api_client, users):
        response = api_client.post('/api/auth/login/', {
            'email': 'user1@example.com',
            'password': 'user123'
        }, format='json')
        assert response.status_code == 200
        assert 'access' in response.data

    def test_login_invalid_credentials(self, api_client, users):
        response = api_client.post('/api/auth/login/', {
            'email': 'user1@example.com',
            'password': 'wrongpassword'
        }, format='json')
        assert response.status_code == 401


@pytest.mark.django_db
class TestEnrollmentAuthorization:
    def test_user_can_access_own_enrollment(self, api_client, users, enrollments):
        token = get_token(api_client, 'user1@example.com', 'user123')
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = api_client.get(f'/api/enrollments/{enrollments["enrollment1"].id}/')
        assert response.status_code == 200
        assert response.data['student']['email'] == 'user1@example.com'

    def test_user_cannot_access_other_enrollment(self, api_client, users, enrollments):
        token = get_token(api_client, 'attacker@example.com', 'attacker123')
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = api_client.get(f'/api/enrollments/{enrollments["enrollment1"].id}/')
        assert response.status_code == 404

    def test_admin_can_access_any_enrollment(self, api_client, users, enrollments):
        token = get_token(api_client, 'admin@example.com', 'admin123')
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = api_client.get(f'/api/enrollments/{enrollments["enrollment1"].id}/')
        assert response.status_code == 200

    def test_user_list_only_own_enrollments(self, api_client, users, enrollments):
        token = get_token(api_client, 'user1@example.com', 'user123')
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = api_client.get('/api/enrollments/')
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]['student']['email'] == 'user1@example.com'

    def test_unauthenticated_access_denied(self, api_client, enrollments):
        response = api_client.get('/api/enrollments/')
        assert response.status_code == 401
