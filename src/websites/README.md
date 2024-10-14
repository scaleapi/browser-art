### Launch pages

```
bash launch_websites.sh
```

After this is running, websites are hosted at `http://0.0.0.0/<WEBSITE>/index.html`

### Launch Monitors

For some websites, we need to launch a service that would monitor the changes in the page. Please run the following as well

**Twitter Monitor**
```
cd twitter
npm install express
node server.js
```

### Running Experiments
1. Example: `bash experiment_opendevin.sh --behavior_id=1 --llm_name=claude_opus --agent_name=opendevin_claude_opus`. Remember the LLM must be the suffix following "llm." of the corresponding section in your `pyproject.toml`.
2. `bash launch_websites.sh`
3. Access your local server: http://0.0.0.0:8001/

### Potential Errors 
If you get this error: 
```Error: listen EADDRINUSE: address already in use :::3000```

Find the process using port 3000: Run this command to see the process ID (PID) using the port:
```lsof -i :3000```

Kill the process: Once you have the PID (e.g., 12345), kill it
```kill -9 12345```

