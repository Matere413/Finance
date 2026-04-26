import os
import pytest


def test_alembic_directory_exists():
    """alembic/ directory must exist at backend root."""
    assert os.path.isdir("alembic"), "alembic/ directory not found — run 'alembic init alembic'"


def test_alembic_env_py_exists():
    """alembic/env.py must exist."""
    assert os.path.isfile("alembic/env.py")


def test_alembic_ini_exists():
    """alembic.ini must exist at backend root."""
    assert os.path.isfile("alembic.ini")


def test_alembic_versions_dir_exists():
    """alembic/versions/ must exist."""
    assert os.path.isdir("alembic/versions")


def test_first_migration_exists():
    """At least one migration file must exist in alembic/versions/."""
    versions = [f for f in os.listdir("alembic/versions") if f.endswith(".py") and not f.startswith("__")]
    assert len(versions) >= 1, "No migration files found — run 'alembic revision --autogenerate'"
