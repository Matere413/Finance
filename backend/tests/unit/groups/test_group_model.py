"""
T-041: Failing unit tests for Group ORM models.
Tests structural integrity without DB.
"""
import pytest
from sqlalchemy import inspect as sa_inspect


class TestGroupModel:
    """Structural tests for the Group ORM model — no DB required."""

    def test_tablename(self):
        """Group model maps to 'groups' table."""
        from src.features.groups.model import Group
        assert Group.__tablename__ == "groups"

    def test_has_required_columns(self):
        """Group model has all required columns."""
        from src.features.groups.model import Group
        mapper = sa_inspect(Group)
        columns = {c.key for c in mapper.mapper.column_attrs}
        expected = {"id", "name", "description", "created_by", "created_at", "updated_at"}
        assert expected.issubset(columns)

    def test_id_is_uuid_type(self):
        """id column must be a UUID type — default callable is uuid.uuid4."""
        from src.features.groups.model import Group
        mapper = sa_inspect(Group)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        id_col = col_attrs["id"].columns[0]
        assert callable(id_col.default.arg)
        assert id_col.default.arg.__name__ == "uuid4"

    def test_created_by_is_foreign_key(self):
        """created_by column must be a ForeignKey to users.id."""
        from src.features.groups.model import Group
        mapper = sa_inspect(Group)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        created_by_col = col_attrs["created_by"].columns[0]
        assert len(created_by_col.foreign_keys) == 1
        fk = list(created_by_col.foreign_keys)[0]
        assert "users.id" in str(fk._colspec)


class TestGroupMembershipModel:
    """Structural tests for the GroupMembership ORM model — no DB required."""

    def test_tablename(self):
        """GroupMembership model maps to 'group_memberships' table."""
        from src.features.groups.model import GroupMembership
        assert GroupMembership.__tablename__ == "group_memberships"

    def test_has_required_columns(self):
        """GroupMembership model has all required columns."""
        from src.features.groups.model import GroupMembership
        mapper = sa_inspect(GroupMembership)
        columns = {c.key for c in mapper.mapper.column_attrs}
        expected = {"id", "group_id", "user_id", "role", "joined_at"}
        assert expected.issubset(columns)

    def test_group_id_is_foreign_key(self):
        """group_id column must be a ForeignKey to groups.id."""
        from src.features.groups.model import GroupMembership
        mapper = sa_inspect(GroupMembership)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        group_id_col = col_attrs["group_id"].columns[0]
        assert len(group_id_col.foreign_keys) == 1
        fk = list(group_id_col.foreign_keys)[0]
        assert "groups.id" in str(fk._colspec)

    def test_user_id_is_foreign_key(self):
        """user_id column must be a ForeignKey to users.id."""
        from src.features.groups.model import GroupMembership
        mapper = sa_inspect(GroupMembership)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        user_id_col = col_attrs["user_id"].columns[0]
        assert len(user_id_col.foreign_keys) == 1
        fk = list(user_id_col.foreign_keys)[0]
        assert "users.id" in str(fk._colspec)
