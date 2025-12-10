import pytest


class TestWalletAccess:
    """Tests for wallet access patterns."""

    def test_user_can_access_own_wallet(self, client, user1_token):
        """User should be able to access their own wallet."""
        response = client.get(
            "/wallets/2",
            headers={"Authorization": f"Bearer {user1_token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 2
        assert data["owner_id"] == 2

    def test_user_can_view_own_transactions(self, client, user1_token):
        """User should be able to view their own transactions."""
        response = client.get(
            "/wallets/2/transactions",
            headers={"Authorization": f"Bearer {user1_token}"},
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_user_can_access_other_wallet(self, client, attacker_token):
        """Test accessing another user's wallet."""
        response = client.get(
            "/wallets/1",
            headers={"Authorization": f"Bearer {attacker_token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["balance"] == 10000.0

    def test_user_can_view_other_transactions(self, client, attacker_token):
        """Test accessing another user's transactions."""
        response = client.get(
            "/wallets/1/transactions",
            headers={"Authorization": f"Bearer {attacker_token}"},
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_user_can_transfer_from_other_wallet(self, client, attacker_token):
        """Test transferring from another user's wallet."""
        response = client.post(
            "/wallets/1/transfer",
            headers={"Authorization": f"Bearer {attacker_token}"},
            json={
                "recipient_wallet_id": 3,
                "amount": 100.0,
                "description": "Test transfer",
            },
        )
        assert response.status_code == 200

        response = client.get(
            "/wallets/3",
            headers={"Authorization": f"Bearer {attacker_token}"},
        )
        data = response.json()
        assert data["balance"] == 150.0

    def test_unauthenticated_access_denied(self, client, seeded_db):
        """Unauthenticated requests should be denied."""
        response = client.get("/wallets/1")
        assert response.status_code == 401

    def test_list_own_wallets(self, client, user1_token):
        """User should only see their own wallets in the list."""
        response = client.get(
            "/wallets/",
            headers={"Authorization": f"Bearer {user1_token}"},
        )
        assert response.status_code == 200
        wallets = response.json()
        assert len(wallets) == 1
        assert wallets[0]["owner_id"] == 2


class TestAuthentication:
    """Tests for authentication endpoints."""

    def test_login_success(self, client, seeded_db):
        """Valid credentials should return a token."""
        response = client.post(
            "/auth/login",
            json={"email": "user1@example.com", "password": "user123"},
        )
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_login_invalid_password(self, client, seeded_db):
        """Invalid password should be rejected."""
        response = client.post(
            "/auth/login",
            json={"email": "user1@example.com", "password": "wrongpassword"},
        )
        assert response.status_code == 401

    def test_login_invalid_email(self, client, seeded_db):
        """Non-existent email should be rejected."""
        response = client.post(
            "/auth/login",
            json={"email": "nonexistent@example.com", "password": "password"},
        )
        assert response.status_code == 401

    def test_get_current_user(self, client, user1_token):
        """Should return current user profile."""
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {user1_token}"},
        )
        assert response.status_code == 200
        assert response.json()["email"] == "user1@example.com"
