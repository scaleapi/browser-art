import os

llm_name = ""  # NOTE: this should be the suffix following "llm." in the corresponding config.toml section
agent_name = ""
for i in range(100):
    os.system(f"sh ../websites/experiment_opendevin.sh --behavior_id={i} --llm_name={llm_name} --agent_name={agent_name} --env_name=hbb")