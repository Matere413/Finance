import pytest
from unittest.mock import patch


@pytest.fixture(autouse=True)
def override_settings():
    with patch.dict("os.environ", {"SECRET_KEY": "test-secret-key-32-characters-long"}):
        yield
