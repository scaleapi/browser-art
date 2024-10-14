import pytest
import json
from dotenv import load_dotenv

from behavior_classifier import HarmbenchClassifier
from behavior_classifier import GPT4Classifier

load_dotenv(dotenv_path='.env.local')

@pytest.fixture
def test_dataset():
    with open("test_dataset.json") as f:
        return json.load(f)

@pytest.mark.parametrize(
    "classifier_class",
    [HarmbenchClassifier, GPT4Classifier]
)
def test_classifiers(classifier_class, test_dataset):
    clf = classifier_class()
    dataset_with_results = clf.classify(test_dataset)
    
    # Type assertions
    assert isinstance(dataset_with_results[0]['clf_prediction'], int)

    # Value assertions
    assert dataset_with_results[0]['clf_prediction'] == 1
    assert dataset_with_results[1]['clf_prediction'] == 0 
    
    classifier_name = "gpt-4" if "gpt4" in str(classifier_class) else "harmbench"
    with open(classifier_name + "_test_outputs.json", 'w') as f:
        json.dump(dataset_with_results, f)
