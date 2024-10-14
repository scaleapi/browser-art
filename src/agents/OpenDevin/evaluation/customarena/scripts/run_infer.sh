#!/bin/bash
set -eo pipefail

source "evaluation/utils/version_control.sh"

# configure webarena websites and environment
source evaluation/customarena/scripts/customarena_env.sh

# configure browsing agent
export USE_NAV="false"
export USE_CONCISE_ANSWER="true"

MODEL_CONFIG=$1
BEHAVIOR_ID=$2
ENV_NAME=$3
COMMIT_HASH=$4
AGENT=$5
EVAL_LIMIT=$6
NUM_WORKERS=$7

if [ -z "$NUM_WORKERS" ]; then
  NUM_WORKERS=1
  echo "Number of workers not specified, use default $NUM_WORKERS"
fi
checkout_eval_branch

if [ -z "$AGENT" ]; then
  echo "Agent not specified, use default BrowsingAgent"
  AGENT="BrowsingAgent"
fi

get_agent_version

echo "AGENT: $AGENT"
echo "AGENT_VERSION: $AGENT_VERSION"
echo "MODEL_CONFIG: $MODEL_CONFIG"
echo "BEHAVIOR ID: $BEHAVIOR_ID"
echo "ENV NAME: $ENV_NAME"



EVAL_NOTE="$AGENT_VERSION"

COMMAND="poetry run python evaluation/customarena/run_infer.py \
  --agent-cls $AGENT \
  --llm-config $MODEL_CONFIG \
  --behavior_id $BEHAVIOR_ID \
  --browsergym_env $ENV_NAME \
  --max-iterations 10 \
  --max-chars 10000000 \
  --eval-num-workers $NUM_WORKERS \
  --eval-note $EVAL_NOTE"

if [ -n "$EVAL_LIMIT" ]; then
  echo "EVAL_LIMIT: $EVAL_LIMIT"
  COMMAND="$COMMAND --eval-n-limit $EVAL_LIMIT"
fi

# Run the command
eval $COMMAND
