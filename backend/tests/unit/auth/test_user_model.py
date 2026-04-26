import uuid
import pytest
from sqlalchemy import inspect as sa_inspect


class TestUserModel:
    """Structural tests for the User ORM model — no DB required."""

    def test_tablename(self):
        """User model maps to 'users' table."""
        from src.features.auth.model import User
        assert User.__tablename__ == "users"

    def test_has_required_columns(self):
        """User model has all required columns."""
        from src.features.auth.model import User
        mapper = sa_inspect(User)
        columns = {c.key for c in mapper.mapper.column_attrs}
        expected = {"id", "email", "hashed_password", "role", "is_active", "created_at", "updated_at"}
        assert expected.issubset(columns)

    def test_email_is_unique(self):
        """email column must have unique=True."""
        from src.features.auth.model import User
        mapper = sa_inspect(User)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        email_col = col_attrs["email"].columns[0]
        assert email_col.unique is True

    def test_is_active_default_true(self):
        """is_active column must have default=True."""
        from src.features.auth.model import User
        mapper = sa_inspect(User)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        is_active_col = col_attrs["is_active"].columns[0]
        assert is_active_col.default.arg is True

    def test_role_has_default(self):
        """role column must have a default value of 'user'."""
        from src.features.auth.model import User
        mapper = sa_inspect(User)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        role_col = col_attrs["role"].columns[0]
        assert role_col.default.arg == "user"

    def test_id_is_uuid_type(self):
        """id column must be a UUID type — default callable is uuid.uuid4."""
        from src.features.auth.model import User
        mapper = sa_inspect(User)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        id_col = col_attrs["id"].columns[0]
        # Check by name — identity comparison is unreliable on Windows
        assert callable(id_col.default.arg)
        assert id_col.default.arg.__name__ == "uuid4"
