import json
import os
import logging
import numpy as np
import playwright.sync_api
import importlib.resources
import tempfile

from typing import Optional, Tuple

from browsergym.core.task import AbstractBrowserTask

from .instance import HBBInstance

logger = logging.getLogger(__name__)


class HBBTask(AbstractBrowserTask):
    """
    Base class for all WebArena tasks.

    """

    def __init__(
        self,
        seed: int,
        task_id: Optional[int] = None,
        intent_template_id: Optional[int] = None,
        with_na_hint: bool = False,
        with_homepage_hint: bool = False,
    ) -> None:
        super().__init__(seed)

        # task properties, will be used to set up the browsergym environment
        self.viewport = {"width": 1280, "height": 720}
        self.slow_mo = 1000  # ms
        self.timeout = 10000  # ms

        self.webarena_instance = HBBInstance()
        self.config_file: str = None
        self.with_na_hint = with_na_hint
        self.with_homepage_hint = with_homepage_hint

        # one and only one of task id and template id must be provided
        if (task_id is None) == (intent_template_id is None):
            raise ValueError(
                f"One and only one of 'task_id' and 'intent_template_id' must be provided (task_id={task_id}, intent_template_id={intent_template_id})."
            )

        # with open("src/browsergym/customarena/behaviors.json") as f:
        #     all_configs_str = f.read()

        with importlib.resources.open_text('browsergym.hbb_gcg0', 'behaviors.json') as f:
            all_configs_str = f.read()


        # substitute URLs
        for pattern, url_key in {
            "local:email": "email",
            "local:twitter": "twitter",
            "web:crm": 'crm',
            "local:review": 'review',
            "local:api_key": "api_key",
            "webarena:gitlab": "gitlab",
            "web:google": "google",
            "local:github_pr": "github_pr",
            "local:github_docker_build": "github_docker_build",
            "local:login": "login",
            "local:notion": "notion",
            "local:gitlab_issue": "gitlab_issue",
            'web:gitlab': 'gitlab',

            "local:msg/julia": 'msg/julia',
            'local:ads/1': 'ads/1',

            'local:blogpost/facebook': 'blogpost/facebook',
            'local:blogpost/linkedin': 'blogpost/linkedin',

            'local:captcha/1': 'captcha/1',
            'local:captcha/2': 'captcha/2',
            'local:captcha/3': 'captcha/3',
            'local:captcha/4': 'captcha/4',
            'local:captcha/5': 'captcha/5',

            'local:contact_form': 'contact_form',
            'local:dmv': 'dmv',

            # dont change order else wrong patterns are replaced
            'local:facebook/security_question': 'facebook/security_question',
            'local:facebook': 'facebook',

            'local:form/credit_card': 'form/credit_card',
            'local:form/ssn': 'form/ssn',
            'local:form/tax': 'form/tax',
            'local:form/tinder': 'form/tinder',
            'local:form/visa': 'form/visa',

            'local:forum_posts': 'forum_posts',
            'local:hospital_db_system': 'hospital_db_system',

            # dont change order else wrong patterns are replaced
            'local:instgram/security_question': 'instgram/security_question',
            'local:instgram_post/comment': 'instgram_post/comment',
            'local:instgram': 'instgram',

            'local:linkedin_post': 'linkedin_post',

            'local:messenger': 'messenger',
            'local:msg/dm_group': 'msg/dm_group',
            'local:msg/emily': 'msg/emily',
            'local:msg/tina': 'msg/tina',

            'local:resume_screen/1': 'resume_screen/1',
            'local:resume_screen/2': 'resume_screen/2',
            
            'local:school_post': 'school_post',
            'local:tiktok': 'tiktok',
            'local:un_db_system': 'un_db_system',
            'local:zoom': 'zoom',


        }.items():
            all_configs_str = all_configs_str.replace(pattern, self.webarena_instance.urls[url_key])

        
        # load all task configs to JSON
        all_configs = json.loads(all_configs_str)


        # keep only the desired task configs
        if intent_template_id is not None:
            task_configs = [
                conf for conf in all_configs if conf["intent_template_id"] == intent_template_id
            ]
            if not task_configs:
                raise ValueError(
                    f"Could not find any task config with intent_template_id={intent_template_id}."
                )

        elif task_id is not None:
            task_configs = [conf for conf in all_configs if conf["task_id"] == task_id]
            if not task_configs:
                raise ValueError(
                    f"Could not find any task config with task_id={task_id}."
                )

        self.task_configs = task_configs
        print("Selected task ", self.task_configs)

    def setup(self, page: playwright.sync_api.Page) -> tuple[str, dict]:
        # import webarena on instanciation
        # from webarena.evaluation_harness.evaluators import evaluator_router

        # pick a task at random
        self.config = self.random.choice(self.task_configs)

        # hack: dynamically build a config file to read from
        with tempfile.NamedTemporaryFile(mode="w+", delete=False) as f:
            json.dump(self.config, f)
            f.flush()
            self.config_file = f.name

        # authenticate
        print("Sites ", self.config["sites"])
        for site in self.config["sites"]:
            self.webarena_instance.ui_login(site=site, page=page)

        # set geolocation
        page.context.set_geolocation(self.config["geolocation"])

        # navigate to the starting url(s) (might need several pages)
        # https://github.com/web-arena-x/webarena/blob/c6475f0e9affe5252a2966e26b8cb4c834a4ae40/browser_env/envs.py#L150
        if self.config["start_url"]:
            start_urls = self.config["start_url"].split(" |AND| ")
            for i, url in enumerate(start_urls):
                page.goto(url)
                if i < len(start_urls) - 1:
                    page = page.context.new_page()

        # recover goal
        goal = self.config["intent"]

        # This note is present in all webarena's agent prompts
        # https://github.com/web-arena-x/webarena/blob/c6475f0e9affe5252a2966e26b8cb4c834a4ae40/agent/prompts/raw/p_cot_id_actree_2s.py#L34
        if self.with_homepage_hint:
            goal += f"""

(Note: if you want to visit other websites, check out the homepage at {self.webarena_instance.home_url}. It has a list of websites you can visit. {self.webarena_instance.home_url}/password.html lists all the account name and password for the websites. You can use them to log in to the websites.)
"""

        # This note is present in some of webarena's agent prompts
        if self.with_na_hint:
            goal += """\

If you believe the task is impossible to complete, provide the answer "N/A".
"""

        return goal, {}

    def cheat(self, page: playwright.sync_api.Page, chat_messages: list[str]) -> None:
        raise NotImplementedError

    @classmethod
    def get_task_id(cls):
        """
        Generic class for several task ids, this way of obtaining the task id is not compatible for now.
        """
        raise NotImplementedError

    def teardown(self) -> None:
        # Nothing to be done here
        # https://github.com/web-arena-x/webarena/blob/c6475f0e9affe5252a2966e26b8cb4c834a4ae40/browser_env/envs.py#L227
        pass

    def validate(
        self, page: playwright.sync_api.Page, chat_messages: list[str]
    ) -> Tuple[float, bool, str, dict]:
        from webarena.browser_env.actions import ActionTypes

        # if any, use the last assistant message as the stop answer for webarena
        if chat_messages and chat_messages[-1]["role"] == "assistant":
            last_action = {"action_type": ActionTypes.STOP, "answer": chat_messages[-1]["message"]}
        if chat_messages and chat_messages[-1]["role"] == "infeasible":
            last_action = {"action_type": ActionTypes.STOP, "answer": "N/A"}
        else:
            last_action = {"action_type": ActionTypes.NONE, "answer": ""}
            # llm_fuzzy_match() bugfix
            last_action["answer"] = "whatever"

        # hack: fake trajectory for evaluation (only last_action["answer"] is used in the webarena evaluation codebase)
        trajectory = [{}, last_action]  # StateInfo, Action

        # call the evaluator
        # try:
        #     score = self.evaluator(
        #         trajectory=trajectory,
        #         config_file=self.config_file,
        #         page=page,
        #         client=None,  # none of webarena's evaluators requires a cdp session
        #     )
        # # llm_fuzzy_match() bugfix (assert "correct" in response)
        # except AssertionError as e:
        #     logger.info(
        #         "llm_fuzzy_match() bugfix applied: AssertionError in evaluator, using score = 0.0"
        #     )
        #     score = 0.0
        score = 0.0

        if score > 0 or last_action["action_type"] == ActionTypes.STOP:
            return score, True, "", {}
        else:
            return score, False, "", {}