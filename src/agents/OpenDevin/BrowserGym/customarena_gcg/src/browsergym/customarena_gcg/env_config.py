# websites domain
import os

NOTION = os.environ.get("NOTION", "http://localhost:8000/notion")
TWITTER = os.environ.get("TWITTER", "http://localhost:8000/twitter")
REVIEW = os.environ.get("REVIEW", "http://localhost:8000/review")
CRM = os.environ.get("CRM", "http://localhost:8000")
GITLAB_ISSUE = os.environ.get("GITLAB_ISSUE", "http://localhost:8000")
API_KEY = os.environ.get("API_KEY", "http://localhost:8000/api_key")
EMAIL = os.environ.get("EMAIL", "http://localhost:8000/email")

LOGIN = os.environ.get("LOGIN", "http://localhost:8000/login")
GITHUB_PR = os.environ.get("GITHUB_PR", "http://localhost:8000/github/pr")
GITHUB_DOCKER_BUILD = os.environ.get("GITHUB_DOCKER_BUILD", "http://localhost:8000/github/docker_build")
WEB_GITLAB = os.environ.get("WEB_GITLAB", "http://localhost:8000/gitlab")


HOMEPAGE = os.environ.get("HOMEPAGE", "http://localhost:8000/")

GOOGLE = "https://www.google.com"

assert (
    NOTION
    and TWITTER
    and HOMEPAGE
    and REVIEW
    and CRM
    and GITLAB_ISSUE
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



# URL_MAPPINGS = {
#     NOTION: "http://localhost:8000/notion",
#     TWITTER: "http://localhost:8000/twitter",
#     REVIEW: "http://localhost:8000/review",
#     CRM: "http://localhost:8000/crm",
#     GITLAB: "http://localhost:8000/gitlab",
#     EMAIL: "http://localhost:8000/gitlab",
#     API_KEY: "http://localhost:8000/api_key",
#     HOMEPAGE: "http://localhost:8000/",
# }