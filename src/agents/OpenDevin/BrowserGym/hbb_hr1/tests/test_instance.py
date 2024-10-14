import pytest
import playwright.sync_api

# bugfix: use same playwright instance in browsergym and pytest
from utils import setup_playwright

from browsergym.hbb.instance import HBBInstance


def test_is_reachable():
    # default URLs
    instance = HBBInstance()
    instance.check_status()

    # unreacheable URL
    with pytest.raises(RuntimeError):
        instance = HBBInstance()
        instance.urls["notion"] = "https://invalid.url"
        instance.check_status()


