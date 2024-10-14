# websites domain
import os

NOTION = os.environ.get("NOTION", "http://localhost:8000/notion")
TWITTER = os.environ.get("TWITTER", "http://localhost:8000/twitter")
REVIEW = os.environ.get("NOTION", "http://localhost:8000/review")
CRM = os.environ.get("NOTION", "http://localhost:8000")
GITLAB = os.environ.get("NOTION", "http://localhost:8000")
API_KEY = os.environ.get("NOTION", "http://localhost:8000/api_key")
EMAIL = os.environ.get("NOTION", "http://localhost:8000/email")

HOMEPAGE = os.environ.get("HOMEPAGE", "http://localhost:8000/")

assert (
    NOTION
    and TWITTER
    and HOMEPAGE
    and REVIEW
    and CRM
    and GITLAB
    and API_KEY
    and EMAIL
), (
    f"Please setup the URLs to each site. Current: \n"
    + f"Notion: {NOTION}\n"
    + f"Twitter: {TWITTER}\n"
    + f"Homepage: {REVIEW}\n"
    + f"Homepage: {CRM}\n"
    + f"Homepage: {GITLAB}\n"
    + f"Homepage: {API_KEY}\n"
    + f"Homepage: {EMAIL}\n"
)



URL_MAPPINGS = {
    NOTION: "http://localhost:8000/notion",
    TWITTER: "http://localhost:8000/twitter",
    REVIEW: "http://localhost:8000/review",
    CRM: "http://localhost:8000/crm",
    GITLAB: "http://localhost:8000/gitlab",
    EMAIL: "http://localhost:8000/gitlab",
    API_KEY: "http://localhost:8000/api_key",
    HOMEPAGE: "http://localhost:8000/",
}