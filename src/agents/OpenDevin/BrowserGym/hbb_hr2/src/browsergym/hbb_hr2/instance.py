import playwright.sync_api
import requests
from .env_config import *


class HBBInstance:
    """
    Utility class to access a WebArena instance.

    """

    def __init__(
        self,
    ) -> None:
        # import webarena on instanciation
        
        self.urls = {
            "notion": NOTION,
            "twitter": TWITTER,
            "api_key": API_KEY,
            "email": EMAIL,
            "crm": CRM,
            "review": REVIEW,
            "gitlab_issue": GITLAB_ISSUE,
            "google": GOOGLE,
            'github_docker_build': GITHUB_DOCKER_BUILD,
            'github_pr': GITHUB_PR,
            'login': LOGIN,
            'gitlab': WEB_GITLAB,
            
            'msg/julia': JULIA,
            'ads/1': ADS_1,

            'blogpost/facebook': POST_FB,
            'blogpost/linkedin': BLOG_LINKED,
            
            'captcha/1': CAPTCHA1,
            'captcha/2': CAPTCHA2,
            'captcha/3': CAPTCHA3,
            'captcha/4': CAPTCHA4,
            'captcha/5': CAPTCHA5,

            'contact_form': CONTACT,
            'dmv': DMV,

            'facebook': FB,
            'facebook/security_question': FB_SEC,

            'form/credit_card': CC,
            'form/ssn': SSN,
            'form/tax': TAX,
            'form/tinder': TINDER,
            'form/visa': VISA,

            'forum_posts': FORUM,
            'hospital_db_system': HOS_DB,

            'instgram': INSTAGRAM,
            'instgram/security_question': INSTAGRAM_SEC,
            'instgram_post/comment': INSTAGRAM_COMMENT,

            'linkedin_post': BLOG_LINKED,

            'messenger': WHATSAPP,
            'msg/dm_group': DM_GRP,
            'msg/emily': EMILY,
            'msg/tina': TINA,

            'resume_screen/1': RESUME1,
            'resume_screen/2': RESUME2,

            'school_post': SCHOOL_POST,
            'tiktok': TIKTOK,
            'un_db_system': UN_DB,
            'zoom': ZOOM,


        }
        self.home_url = HOMEPAGE

        print("Environment URLS : ", self.urls)

    def check_status(self):
        """
        Check the status of the instance. Raises an error if the instance is not ready to be used.

        """
        self._check_is_reachable()

    def _check_is_reachable(self):
        """
        Test that every website is reachable.

        """
        for site, url in self.urls.items():
            print(url)
            try:
                requests.get(url, timeout=5000)  # 5 secs
            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
                raise RuntimeError(
                    f'WebArena site "{site}" ({url}) is not reacheable. Please check the URL.'
                )

    def ui_login(self, site: str, page: playwright.sync_api.Page):
        """
        Should only be called once per site (expects user to be logged out).
        """
        url = self.urls[site]
        print("Browsing to Site ", site, url)
        print("Loading")
        page.goto(url, wait_until="domcontentloaded")