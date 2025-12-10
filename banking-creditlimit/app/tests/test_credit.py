import pytest


class TestCreditLimit:
    def test_get_credit_limit(self, client, user_token):
        response = client.get(
            "/credit/limit",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["current_limit"] == 5000.0
        assert data["email"] == "user1@example.com"

    def test_request_credit_increase_user(self, client, user_token, db):
        response = client.post(
            "/credit/increase",
            headers={"Authorization": f"Bearer {user_token}"},
            json={"new_limit": 10000}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["requested_limit"] == 10000
        assert data["previous_limit"] == 5000.0
        assert data["status"] == "approved"

    def test_request_credit_increase_attacker(self, client, attacker_token, db):
        response = client.post(
            "/credit/increase",
            headers={"Authorization": f"Bearer {attacker_token}"},
            json={"new_limit": 50000}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["requested_limit"] == 50000
        assert data["status"] == "approved"

    def test_request_credit_increase_invalid_limit(self, client, user_token):
        response = client.post(
            "/credit/increase",
            headers={"Authorization": f"Bearer {user_token}"},
            json={"new_limit": 1000}
        )
        assert response.status_code == 400

    def test_request_credit_increase_exceeds_max(self, client, user_token):
        response = client.post(
            "/credit/increase",
            headers={"Authorization": f"Bearer {user_token}"},
            json={"new_limit": 200000}
        )
        assert response.status_code == 400

    def test_get_credit_history(self, client, user_token, db):
        client.post(
            "/credit/increase",
            headers={"Authorization": f"Bearer {user_token}"},
            json={"new_limit": 8000}
        )
        
        response = client.get(
            "/credit/history",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

    def test_unauthenticated_access(self, client):
        response = client.get("/credit/limit")
        assert response.status_code == 403

    def test_admin_credit_limit(self, client, admin_token):
        response = client.get(
            "/credit/limit",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["current_limit"] == 50000.0
