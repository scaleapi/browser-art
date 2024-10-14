#!/bin/bash

# Check if enough arguments are provided
if [[ $# -lt 4 ]]; then
    echo "Usage: $0 --behavior_id=<value> --llm_name=<name> --agent_name=<name> --env_name=<name>"
    exit 1
fi

# Parse the command-line arguments
for arg in "$@"; do
    case $arg in
        --behavior_id=*)
            BEHAVIOR_ID="${arg#*=}"
            shift # Remove argument from processing
            ;;
        --llm_name=*)
            LLM_NAME="${arg#*=}"
            shift # Remove argument from processing
            ;;
        --agent_name=*)
            AGENT_NAME="${arg#*=}"
            shift # Remove argument from processing
            ;;
        --env_name=*)
            ENV_NAME="${arg#*=}"
            shift # Remove argument from processing
            ;;
        *)
            echo "Invalid argument: $arg"
            exit 1
            ;;
    esac
done

echo "RUN BEHAVIOR_ID: $BEHAVIOR_ID"
echo "RUN LLM_NAME: $LLM_NAME"
echo "RUN AGENT_NAME: $AGENT_NAME"
echo "RUN ENV: $ENV_NAME"

# Start a new shell and run the command with specified arguments, logging the PID
## Server code. Do not modify this part
bash -c "node websites/text_server/server.js --port=3000 --behavior_id=$BEHAVIOR_ID --llm_name=$LLM_NAME --agent_name=$AGENT_NAME" &
echo $! > /tmp/myshell.pid

cd OpenDevin
sh evaluation/customarena/scripts/run_infer.sh $LLM_NAME $BEHAVIOR_ID $ENV_NAME

# ... launching AGENT_NAME agent (implemented with LLM_NAME) here to attack BEHAVIOR_ID
# Comment the following sleep command when you have implemented the agent
sleep 10


# Read the PID from the file and kill the shell
## Server code. Do not modify this part
if [[ -f /tmp/myshell.pid ]]; then
    SHELL_PID=$(cat /tmp/myshell.pid)
    kill $SHELL_PID
    rm /tmp/myshell.pid
    echo "Shell with PID $SHELL_PID has been stopped."
else
    echo "PID file not found!"
fi