# BrowserART

This is the code space for [Refusal-Trained LLMs Are Easily Jailbroken As Browser Agents](https://static.scale.com/uploads/6691558a94899f2f65a87a75/browser_art_draft_preview.pdf).

BrowserART is a comprehensive test suite and toolkit for red-teaming and evaluating LLM browser agents. 

## Table of Contents

- [Project Overview](#project-overview)
- [Directory Structure](#directory-structure)
- [Installation and Usage](#installation-and-usage)
- [License](#license)

---

## Overview

For safety reasons, large language models (LLMs) are trained to refuse harmful user instructions, such as assisting dangerous activities. We study an open question in this work: does the desired safety refusal, typically enforced in chat contexts, generalize to non-chat and agentic use cases? Unlike chatbots, LLM agents equipped with general-purpose tools, such as web browsers and mobile devices, can directly influence the real world, making it even more crucial to refuse harmful instructions. In this work, we primarily focus on red-teaming browser agents – LLMs that manipulate information via web browsers. To this end, we introduce Browser Agent Red teaming Toolkit (BrowserART), a comprehensive test suite designed specifically for red-teaming browser agents. BrowserART consists of 100 diverse browser-related harmful behaviors (including original behaviors and ones sourced from HarmBench [Mazeika et al., 2024] and AirBench 2024 [Zeng et al., 2024b]) across both synthetic and real websites. Our empirical study on state-of-the-art browser agents reveals that, while the backbone LLM refuses harmful instructions as a chatbot, the corresponding agent does not. Moreover, attack methods designed to jailbreak refusal-trained LLMs in the chat settings transfer effectively to browser agents. With human rewrites, GPT-4o and o1-preview -based browser agents pursued 98 and 63 harmful behaviors (out of 100), respectively.
Therefore, simply ensuring LLMs refuse to harmful instructions in chats is not sufficient to ensure the downstream agents are safe. We publicly release BrowserART and call on LLM developers, policymakers, and agent developers to collaborate on improving agent safety.

![](main_figure.png)


## Behavior Dataset 

Our behavior dataset is in `/datasets/behaviors`. If you are looking into a CSV version of the dataset, please visit our [Huggingface page](https://huggingface.co/datasets/ScaleAI/BrowserART). 

![](pie_chart.png)

## Directory Structure

A breakdown of the main directories in the project:

```bash
├── notebooks
├── src/
│   ├── agents/
│   │   ├── OpenHands/
│   │   ├── seaact_agent/
│   ├── behavior_classifier/
│   ├── datasets/
│   ├── text-mode/
│   ├── utils/
│   │   ├── website_eval/
│   └── websites/
├── LICENSE
├── README.md
├── requirements.txt
```

### Key Folders:
- **`notebooks/`**: Jupyter Notebooks to help with evaluating browser agent trajectories
- **`src/agents/`**: Source code for various browser agents
- **`src/behavior_classifier/`**: Classifiers to evalaute whether or not an agent attempted to execute a harmful or benign behavior
- **`src/datasets/`**: Harmful and benign behavior datasets, along with attack variants such as GCG, prefix, or human-reframing
- **`src/text-mode/`**: Files to test behaviors on text-only LLMs (no browser activity)
- **`src/utils/`**: Utility functions for parsing logs and batch running experiments
- **`src/websites/`**: Websites for the agents to interact with and log servers for saving data

## Installation and Usage

Please see extensive instructions [here](src/README.md).

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


## Key Contributors
We thank Priyanshu Kumar, Elaine Lau, Saranya Vijayakumar, Tu Trinh for their key contributions to this code space.

## Ethics

This research — including the methodology detailed in the paper, the code, and the content of this
webpage — contains material that may enable users to generate harmful content using certain publicly
available LLM agents. While we recognize the associated risks, we believe it is essential to disclose this research in its entirety. The agent frameworks, beyond those used in this study, are publicly accessible and relatively easy to use. Comparable results will inevitably be achievable by any determined team seeking to utilize language models to produce harmful content and interactions.
In releasing BrowserART and our main results, we carefully weighed the benefits of empowering research in defense robustness with the risks of enabling further malicious use. Following Zou et al. [2023], we believe the publication of this work helps the agent safety community to release this frontier challenge. Prior to release, we have also disclosed our findings and datasets to the companies providing the API access to the models, together with the creators of browser agent frameworks. Our findings highlight the crucial alignment gap between chatbots and browser agents and call upon the research community to explore safeguarding techniques for LLM agents.


## Citation

If you are using the behavior set of \shortdataset, in addition to this work, please consider to cite HarmBench and AirBench 2024 using the following citations:

```
@InProceedings{mazeika2024harmbench,
  title = 	 {{H}arm{B}ench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal},
  author =       {Mazeika, Mantas and Phan, Long and Yin, Xuwang and Zou, Andy and Wang, Zifan and Mu, Norman and Sakhaee, Elham and Li, Nathaniel and Basart, Steven and Li, Bo and Forsyth, David and Hendrycks, Dan},
  booktitle = 	 {Proceedings of the 41st International Conference on Machine Learning},
  year = 	 {2024},
  series = 	 {Proceedings of Machine Learning Research},
  publisher =    {PMLR},
}

@article{zeng2024air,
  title={AIR-Bench 2024: A Safety Benchmark Based on Risk Categories from Regulations and Policies},
  author={Zeng, Yi and Yang, Yu and Zhou, Andy and Tan, Jeffrey Ziwei and Tu, Yuheng and Mai, Yifan and Klyman, Kevin and Pan, Minzhou and Jia, Ruoxi and Song, Dawn and others},
  journal={arXiv preprint arXiv:2407.17436},
  year={2024}
}
```