## Installation

This repo uses `poetry` to manage packages instead of `conda`. Please install poetry first by doing 
```
pip install poetry
```

In each subfolder of this repo, you will need to create an virtual env because we are implementing different agents from different companies and organizations (they may use very diverse packages). We do not want to install everything into one virtual env or conda so a dependency issue from agent A breaks something in agent B. 


## Run Experiments

To activate the virtual env created by `poetry`, you can add `poetry run` to any command line you wish to refer to the current virtual env. For example
```
poetry run bash run.sh
```

You can also open a new bash for that virtual env by doing 
```
poetry shell
```


## OpenDevin

To run OpenDevin on our own websites and behaviors, we need to integrate them into an environment in BrowserGym (`OpenDevin/BrowserGym`). It is integrated as `customarena`.

1. Install Docker Desktop
2. `cd OpenDevin/BrowserGym`
3. `make install`
4. Follow the installation instructions [here](https://github.com/OpenDevin/OpenDevin/blob/main/Development.md) to install requirements for OpenDevin. Recommended to create a conda environment. **Note**: before building OpenDevin, please ensure `virtualenvs.create` is set to "false" when `poetry config --list` is run. If not, run `poetry config virtualenvs.create false`. This will direct poetry to install dependencies in the conda environment and not create a new virtual environment.
5. Create `config.toml` inside `OpenDevin`. An example config is given below.
    ```
    [core]
    workspace_base="./workspace"
    persist_sandbox=false
    max_iterations = 100
    cache_dir = "/tmp/cache"
    ssh_hostname = "localhost"
    use_host_network=false

    [llm.gpt]
    model="gpt-4o"
    api_key="API-KEY"
    embedding_model=""
    ```

### Batch Experiment Running

1. Host websites locally using `python -m http.server -d websites 8000`. Docker containers will be able to access these.
2. Run evals, such as by using [a batch file](utils/batch_experiment_opendevin.py).
3. Alternatively, run the bash file directly:
    ```
    sh websites/experiment_opendevin.sh --behavior_id=0 --llm_name=claude_opus --agent_name=openhands_claude_opus --env_name=hbb
    ```
    The `behavior_id` is the index of the behavior in the corresponding data json of the environment (eg. `OpenDevin/BrowserGym/customarena_gcg/src/browsergym/customarena_gcg/behaviors.json`)


### Results Aggregation and Evaluation

Use the corresponding notebooks inside `notebooks/` to aggregate agent logs and run the attack-success classifier.