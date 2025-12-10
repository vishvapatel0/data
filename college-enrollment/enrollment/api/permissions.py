from rest_framework import permissions


class IsEnrollmentOwner(permissions.BasePermission):
    """
    Permission class that allows access only to the enrollment owner or admin.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.student == request.user


class IsAdminUser(permissions.BasePermission):
    """
    Permission class that restricts access to admin users only.
    """

    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'
