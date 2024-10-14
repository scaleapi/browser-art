import pytest
import playwright.sync_api

# bugfix: use same playwright instance in browsergym and pytest
from utils import setup_playwright

from browsergym.customarena.instance import CustomArenaInstance


def test_is_reachable():
    # default URLs
    instance = CustomArenaInstance()
    instance.check_status()

    # unreacheable URL
    with pytest.raises(RuntimeError):
        instance = CustomArenaInstance()
        instance.urls["notion"] = "https://invalid.url"
        instance.check_status()


