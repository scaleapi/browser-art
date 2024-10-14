import json
import argparse
import numpy as np
import os
from litellm_batch import batch_completion
import pandas as pd
from dotenv import load_dotenv
import litellm
from behavior_classifier.behavior_classifier.gpt4_classifier import GPT4Classifier

load_dotenv()
litellm.set_verbose=True

HTML_DICT = {
    'generic': open('websites/generic/index.html').read(),
    'https://www.google.com': open('websites/google/index.html').read(),
    'local:ads': open('websites/ads/1.html').read(),
    'local:api_key': open('websites/api_keys/index.html').read(),
    'local:contact_form': open('websites/contact_form/index.html').read(),
    'local:crm': open('websites/webarena-crm/index.html').read(),
    'local:dmv': open('websites/dmv/index.html').read(),
    'local:ec2_admin': open('websites/ec2/admin.html').read(),
    'local:ec2_pipelines': open('websites/ec2/pipelines.html').read(),
    'local:email': open('websites/email/index.html').read(),
    'local:facebook': open('websites/facebook/index.html').read(),
    'local:facebook_post': open('websites/facebook/create_post.html').read(),
    'local:facebook_security_question': open('websites/facebook/security_question.html').read(),
    'local:form_ssn': open('websites/forms/ssn.html').read(),
    'local:form_visa': open('websites/forms/visa.html').read(),
    'local:form_credit_card': open('websites/forms/credit_card.html').read(),
    'local:form_tax': open('websites/forms/tax.html').read(),
    'local:forum_posts': open('websites/forum_posts/index.html').read(),
    'local:github_docker_build': open('websites/github/docker_build.html').read(),
    'local:github_pr': open('websites/github/pr.html').read(),
    'local:gitlab_issue': open('websites/gitlab_issue/index.html').read(),
    'local:hospital_db_system': open('websites/hospital/index.html').read(),
    'local:instagram': open('websites/instagram/index.html').read(),
    'local:instagram_comment': open('websites/instagram/view_post.html').read(),
    'local:instagram_security_question': open('websites/instagram/security_question.html').read(),
    'local:linkedin': open('websites/linkedin/index.html').read(),
    'local:login': open('websites/login/index.html').read(),
    'local:msg': open('websites/whatsapp/index.html').read(),
    'local:messenger': open('websites/whatsapp/index.html').read(),
    'local:notion': open('websites/notion/index.html').read(),
    'local:review': open('websites/review/index.html').read(),
    'local:resume_screen': open('websites/resume_screen/index.html').read(),
    'local:school_post': open('websites/school_post/index.html').read(),
    'local:tiktok': open('websites/tiktok/index.html').read(),
    'local:tinder': open('websites/tinder/index.html').read(),
    'local:twitter': open('websites/twitter/index.html').read(),
    'local:un_db_system': open('websites/un/index.html').read(),
    'webarena:gitlab': open('websites/webarena-gitlab/index.html').read(),
    'local:zoom': open('websites/zoom/index.html').read(),
}
HTML_DICT.update({f'local:captcha_{i}': open(f'websites/captcha_website/example{i}/index.html').read() for i in range(1, 6)})

MODELS = [
    "gpt-4o",
    "gpt-4-turbo",
    "claude-3-5-sonnet-20240620",
    "claude-3-opus-20240229",
    "llama3-1-405b-instruct-v1",
    "gemini-1.5-pro-001"
]

RESPONSE_COLS = {
    'no_html': 'Text Base Response',
    'generic': 'Generic HTML Response',
    'specific': 'Specific HTML Response',
}

def generate_response(args, behaviors):
    messages = []
    for behavior in behaviors:
        if args.html == 'no_html':
            messages.append([
                {
                    "role": "user",
                    "content": behavior['text_behavior'].replace("{context}", "").strip()
                }
            ])
        elif args.html == 'generic':
            messages.append([
                {
                    "role": "user",
                    "content": HTML_DICT['generic'] + behavior['text_behavior'].replace("{context}", "").strip(),
                }
            ])
        elif args.html == 'specific':
            messages.append([
                {
                    "role": "user",
                    "content": HTML_DICT[(behavior['website'].split(',')[0]).strip()] + behavior['text_behavior'].replace("{context}", "").strip()
                }
            ])
        else:
            raise Exception(f"HTML {args.html} invalid")

    model_responses = batch_completion(
        batch_messages=messages,
        temperature=args.temperature,
        model=args.model
    )
    df[RESPONSE_COLS[args.html]] = model_responses
    return df


def evaluate_response(args, df):
    classifier = GPT4Classifier(api_key=os.getenv("OPENAI_API_KEY"), model="gpt-4o")
    df = df.rename(columns={RESPONSE_COLS[args.html]: "text_output"})
    data_rows = df.to_dict(orient="records")
    eval_df = classifier.classify(data_rows)
    return eval_df


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", "-m", choices=["inference", "grading"], required=True)
    parser.add_argument('--model', type=str, required=True)
    parser.add_argument('--html', type=str, required=True)
    parser.add_argument('--temperature', type=float, default=0.0)

    args = parser.parse_args()
    assert args.model in MODELS, print(f"Model {args.model} not in {MODELS}")
    
    save_path = os.path.join("logs", "final_outputs", f"{args.model.replace('/', '-')}_{args.html}.csv")
    if args.mode == "inference":
        with open("../datasets/behaviors/hbb.json", "r") as f:
            behaviors = json.load(f)
        df = generate_response(args, behaviors)
        df.to_csv(save_path, index=False)
    else:
        model_outputs = pd.read_csv(save_path)
        eval_df = evaluate_response(args, model_outputs)
        eval_df.to_csv(save_path.replace("final_outputs", "graded_outputs"), index=False)
        print(f"Total behaviors: {len(eval_df)}")
        print(f"Successes: {np.count_nonzero(eval_df['clf_prediction'])}")