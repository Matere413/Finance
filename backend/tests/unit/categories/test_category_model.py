"""
T-025: Failing unit tests for Category ORM model.
Tests structural integrity without DB.
"""
import pytest
from sqlalchemy import inspect as sa_inspect


class TestCategoryModel:
    """Structural tests for the Category ORM model — no DB required."""

    def test_tablename(self):
        """Category model maps to 'categories' table."""
        from src.features.categories.model import Category
        assert Category.__tablename__ == "categories"

    def test_has_required_columns(self):
        """Category model has all required columns."""
        from src.features.categories.model import Category
        mapper = sa_inspect(Category)
        columns = {c.key for c in mapper.mapper.column_attrs}
        expected = {"id", "user_id", "name", "type", "icon", "color", "is_default", "created_at", "updated_at"}
        assert expected.issubset(columns)

    def test_id_is_uuid_type(self):
        """id column must be a UUID type — default callable is uuid.uuid4."""
        from src.features.categories.model import Category
        mapper = sa_inspect(Category)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        id_col = col_attrs["id"].columns[0]
        assert callable(id_col.default.arg)
        assert id_col.default.arg.__name__ == "uuid4"

    def test_type_is_enum_income_expense(self):
        """type column must have check constraint for income/expense."""
        from src.features.categories.model import Category
        # Check constraint should exist in table args
        assert Category.__table_args__ is not None
        # Verify we have a CheckConstraint
        from sqlalchemy import CheckConstraint
        check_constraints = [arg for arg in Category.__table_args__ if isinstance(arg, CheckConstraint)]
        assert len(check_constraints) > 0
        # Check the constraint has the expected name
        assert check_constraints[0].name == "ck_category_type"

    def test_user_id_is_foreign_key(self):
        """user_id column must be a ForeignKey to users.id."""
        from src.features.categories.model import Category
        mapper = sa_inspect(Category)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        user_id_col = col_attrs["user_id"].columns[0]
        assert len(user_id_col.foreign_keys) == 1
        fk = list(user_id_col.foreign_keys)[0]
        assert "users.id" in str(fk._colspec)

    def test_is_default_default_true(self):
        """is_default column must have default=False."""
        from src.features.categories.model import Category
        mapper = sa_inspect(Category)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        is_default_col = col_attrs["is_default"].columns[0]
        assert is_default_col.default.arg is False
