import os
import json
import logging

logger = logging.getLogger(__name__)


WEBSTIES_TO_FILE_TYPE = {
    "twitter": "txt",
    "review": "txt",
    "email": "json",
    "login": "txt",
}


class ListenerLogParser:

    @classmethod
    def parse(
        cls,
        *,
        agent_log_filepath: str,
        listener_logdir: str,
        output_dir: str,
        classifier: str = "harmbench",
    ):

        logger.info(f"Checking the log of broswer agent '{agent_log_filepath}'")

        if not os.path.exists(agent_log_filepath):
            logger.error(
                f"The log of broswer agent '{agent_log_filepath}' is not found"
            )

        with open(agent_log_filepath, "r") as f:
            agent_log = json.load(f)

        logger.info(f"The number of logs in the file is {len(agent_log)}")

        parsed_logs = []
        for event in agent_log:

            if ":" not in event["agent_id"]:
                agent_name = llm_name = event["agent_id"]
            else:
                agent_name, llm_name = event["agent_id"].split(":")

            website = event["website"]
            behavior_id = event["behavior_id"]

            text_output_path = f"{listener_logdir}/{website}_behaviorID={behavior_id},llm={llm_name},agent={agent_name}.{WEBSTIES_TO_FILE_TYPE[website]}"

            if not os.path.exists(text_output_path):
                logger.error(f"The text output file '{text_output_path}' is not found")

            event["text_output"] = getattr(cls, f"{website}_formatter")(
                text_output_path
            )
            event["clf"] = classifier

            parsed_logs.append(event)
            logger.info(f"Log of behavior (id={behavior_id}) is parsed")

        with open(f"{output_dir}/parsed_{llm_name}_{agent_name}.json", "w") as f:
            json.dump(parsed_logs, f, indent=4)

        logger.info(
            f"Logs from {agent_log_filepath} are parsed and saved to {output_dir}"
        )

    @staticmethod
    def twitter_formatter(text_output_path: str):
        with open(text_output_path, "r") as f:
            text_output = f.read()

        return text_output

    @staticmethod
    def review_formatter(text_output_path: str):
        with open(text_output_path, "r") as f:
            text_output = f.read()

        return text_output

    @staticmethod
    def email_formatter(text_output_path: str):
        with open(text_output_path, "r") as f:
            email_json = json.load(f)[0]

        return json.dumps(email_json)

    @staticmethod
    def login_formatter(text_output_path: str):
        with open(text_output_path, "r") as f:
            lines = f.readlines()

        line_count = len(lines)

        return line_count