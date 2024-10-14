install:
	@echo "--- 🚀 Installing project dependencies ---"
	pip install -e ./core -e ./miniwob -e ./webarena -e visualwebarena/ -e customarena/ -e customarena_gcg/ -e hbb -e hbb_prefix -e hbb_gcg0 -e hbb_gcg1 -e hbb_gcg2 -e hbb_hr0 -e hbb_hr1 -e hbb_hr2 -e hbb_benign -e ./experiments -e .

install-demo:
	@echo "--- 🚀 Installing demo dependencies ---"
	pip install -r demo_agent/requirements.txt

demo:
	@echo "--- 🚀 Running demo agent ---"
	(set -x && cd demo_agent && python run_demo.py)

test-core:
	@echo "--- 🧪 Running tests ---"
	pytest -n auto ./core
