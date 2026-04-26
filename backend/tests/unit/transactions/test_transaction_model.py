"""
T-029: Failing unit tests for Transaction ORM model.
Tests structural integrity without DB.
"""
import pytest
from sqlalchemy import inspect as sa_inspect, Numeric


class TestTransactionModel:
    """Structural tests for the Transaction ORM model — no DB required."""

    def test_tablename(self):
        """Transaction model maps to 'transactions' table."""
        from src.features.transactions.model import Transaction
        assert Transaction.__tablename__ == "transactions"

    def test_has_required_columns(self):
        """Transaction model has all required columns."""
        from src.features.transactions.model import Transaction
        mapper = sa_inspect(Transaction)
        columns = {c.key for c in mapper.mapper.column_attrs}
        expected = {"id", "user_id", "category_id", "amount", "type", "description", "transaction_date", "created_at", "updated_at"}
        assert expected.issubset(columns)

    def test_id_is_uuid_type(self):
        """id column must be a UUID type — default callable is uuid.uuid4."""
        from src.features.transactions.model import Transaction
        mapper = sa_inspect(Transaction)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        id_col = col_attrs["id"].columns[0]
        assert callable(id_col.default.arg)
        assert id_col.default.arg.__name__ == "uuid4"

    def test_amount_is_numeric(self):
        """amount column must be Numeric type."""
        from src.features.transactions.model import Transaction
        mapper = sa_inspect(Transaction)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        amount_col = col_attrs["amount"].columns[0]
        assert isinstance(amount_col.type, Numeric)

    def test_user_id_is_foreign_key(self):
        """user_id column must be a ForeignKey to users.id."""
        from src.features.transactions.model import Transaction
        mapper = sa_inspect(Transaction)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        user_id_col = col_attrs["user_id"].columns[0]
        assert len(user_id_col.foreign_keys) == 1
        fk = list(user_id_col.foreign_keys)[0]
        assert "users.id" in str(fk._colspec)

    def test_category_id_is_foreign_key_nullable(self):
        """category_id column must be a ForeignKey to categories.id and nullable."""
        from src.features.transactions.model import Transaction
        mapper = sa_inspect(Transaction)
        col_attrs = {c.key: c for c in mapper.mapper.column_attrs}
        category_id_col = col_attrs["category_id"].columns[0]
        assert category_id_col.nullable is True
        assert len(category_id_col.foreign_keys) == 1
        fk = list(category_id_col.foreign_keys)[0]
        assert "categories.id" in str(fk._colspec)

    def test_type_is_enum_income_expense(self):
        """type column must have check constraint for income/expense."""
        from src.features.transactions.model import Transaction
        from sqlalchemy import CheckConstraint
        # Check constraint should exist in table args
        assert Transaction.__table_args__ is not None
        check_constraints = [arg for arg in Transaction.__table_args__ if isinstance(arg, CheckConstraint)]
        assert len(check_constraints) > 0
        # Check at least one constraint has the expected name
        assert any(c.name == "ck_transaction_type" for c in check_constraints)
