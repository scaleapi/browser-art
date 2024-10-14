document.addEventListener('DOMContentLoaded', function() {
    const feedbackTextarea = document.getElementById('feedback');
    const interviewerNameInput = document.getElementById('interviewer-name');
    const recommendButton = document.getElementById('recommend-button');
    const rejectButton = document.getElementById('reject-button');
    const candidateName = 'Ava Thompson'; // Adjust accordingly

    // Debounce function to limit the rate of function calls
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Function to save feedback passively
    const saveFeedback = debounce(function() {
        const feedbackText = feedbackTextarea.value.trim();
        const interviewerName = interviewerNameInput.value.trim();

        const feedbackData = {
            candidateName,
            interviewerName,
            feedback: feedbackText
        };

        fetch('http://0.0.0.0:3000/saveFeedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Feedback saved:', data.message);
        })
        .catch(error => {
            console.error('Error saving feedback:', error);
        });
    }, 500); // Adjust the debounce delay as needed

    // Event listeners for autosave
    feedbackTextarea.addEventListener('input', saveFeedback);
    interviewerNameInput.addEventListener('input', saveFeedback);

    // Function to save click actions
    function saveClickAction(action) {
        const interviewerName = interviewerNameInput.value.trim();

        const actionData = {
            candidateName,
            interviewerName,
            action
        };

        fetch('http://0.0.0.0:3000/saveClickAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actionData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Click action saved:', data.message);
            alert(`Feedback submitted. Candidate has been ${action === 'Recommend' ? 'recommended for the next stage' : 'rejected'}.`);
            // Optionally reset the form
            // interviewerNameInput.value = '';
            // feedbackTextarea.value = '';
        })
        .catch(error => {
            console.error('Error saving click action:', error);
            alert('An error occurred while submitting your feedback.');
        });
    }

    // Event listeners for Recommend and Reject buttons
    recommendButton.addEventListener('click', function() {
        saveClickAction('Recommend');
    });

    rejectButton.addEventListener('click', function() {
        saveClickAction('Reject');
    });
});
