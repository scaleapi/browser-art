document.addEventListener('DOMContentLoaded', function () {
    // Function to generate unique IDs
    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Debounce function to limit the rate of function calls
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Function to add event listeners to Like buttons
    function addLikeButtonListener(button, postDetails) {
        button.addEventListener('click', function () {
            postDetails.likes++;
            button.textContent = 'Like (' + postDetails.likes + ')';

            // Save updated postDetails to server
            saveLinkedinPostToServer(postDetails);
        });
    }

    // Function to add event listeners to Comment sections
    function addCommentSectionListeners(post, postDetails) {
        var commentInput = post.querySelector('.comment-input');
        var commentSubmit = post.querySelector('.comment-submit');
        var commentsList = post.querySelector('.comments-list');

        if (commentSubmit && commentInput && commentsList) {
            // Load saved draft comment for this post
            loadDraftCommentFromServer(postDetails.id, commentInput);

            // Add input event listener to auto-save comment content
            var debouncedSaveDraftComment = debounce(function () {
                var commentText = commentInput.value;
                saveDraftCommentToServer(postDetails.id, commentText);
            }, 500);

            commentInput.addEventListener('input', debouncedSaveDraftComment);

            commentSubmit.addEventListener('click', function () {
                var commentText = commentInput.value.trim();
                if (commentText !== '') {
                    var comment = document.createElement('p');
                    comment.textContent = commentText;
                    commentsList.appendChild(comment);
                    commentInput.value = '';

                    // Add comment to postDetails.comments
                    postDetails.comments.push(commentText);

                    // Save updated postDetails to server
                    saveLinkedinPostToServer(postDetails);

                    // Delete the draft comment from the server
                    deleteDraftCommentFromServer(postDetails.id);
                } else {
                    alert('Please enter a comment.');
                }
            });
        }
    }

    // Function to save LinkedIn post to server
    function saveLinkedinPostToServer(postDetails) {
        fetch('http://0.0.0.0:3000/saveLinkedinPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postDetails)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            // Update the post id with the one from the server if necessary
            postDetails.id = data.id;
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to save draft post to server
    function saveDraftPostToServer(content) {
        var draftPostDetails = {
            id: 'draft',
            content: content,
            timestamp: new Date().toISOString()
        };

        fetch('http://0.0.0.0:3000/saveLinkedinDraftPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(draftPostDetails)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response for draft post:', data);
        })
        .catch(error => console.error('Error saving draft post:', error));
    }

    // Function to delete draft post from server
    function deleteDraftPostFromServer() {
        fetch('http://0.0.0.0:3000/deleteLinkedinDraftPost', {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response for deleting draft post:', data);
        })
        .catch(error => console.error('Error deleting draft post:', error));
    }

    // Function to save draft comment to server
    function saveDraftCommentToServer(postId, commentText) {
        var draftCommentDetails = {
            postId: postId,
            commentText: commentText,
            timestamp: new Date().toISOString()
        };

        fetch('http://0.0.0.0:3000/saveLinkedinDraftComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(draftCommentDetails)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response for draft comment:', data);
        })
        .catch(error => console.error('Error saving draft comment:', error));
    }

    // Function to delete draft comment from server
    function deleteDraftCommentFromServer(postId) {
        fetch(`http://0.0.0.0:3000/deleteLinkedinDraftComment?postId=${encodeURIComponent(postId)}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response for deleting draft comment:', data);
        })
        .catch(error => console.error('Error deleting draft comment:', error));
    }

    // Function to load draft post content from server
    function loadDraftPostFromServer() {
        fetch('http://0.0.0.0:3000/getLinkedinDraftPost')
            .then(response => response.json())
            .then(data => {
                if (data.content) {
                    postContentTextarea.value = data.content;
                    console.log('Loaded LinkedIn post content from server:', data.content);
                }
            })
            .catch(error => console.error('Error loading draft post from server:', error));
    }

    // Function to load draft comment from server
    function loadDraftCommentFromServer(postId, commentInput) {
        fetch(`http://0.0.0.0:3000/getLinkedinDraftComment?postId=${encodeURIComponent(postId)}`)
            .then(response => response.json())
            .then(data => {
                if (data.commentText) {
                    commentInput.value = data.commentText;
                    console.log(`Loaded draft comment for post ${postId}:`, data.commentText);
                }
            })
            .catch(error => console.error('Error loading draft comment from server:', error));
    }

    // Debounced save function for draft post content
    var debouncedSaveDraftPostToServer = debounce(function () {
        var content = postContentTextarea.value;
        saveDraftPostToServer(content);
    }, 500);

    // Get the post-content textarea
    var postContentTextarea = document.getElementById('post-content');

    // Load saved post content from server
    loadDraftPostFromServer();

    // Add input event listener to auto-save post content
    postContentTextarea.addEventListener('input', debouncedSaveDraftPostToServer);

    // Add event listeners to existing posts on page load
    document.querySelectorAll('.post').forEach(function (post) {
        var postDetails = post.postDetails || {
            id: generateId(),
            content: post.querySelector('.post-content p').textContent,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: []
        };
        post.postDetails = postDetails;

        addLikeButtonListener(post.querySelector('.like-button'), postDetails);
        addCommentSectionListeners(post, postDetails);
    });

    // Event listener for the Post button
    document.getElementById('post-button').addEventListener('click', function () {
        var content = postContentTextarea.value;
        if (content.trim() !== '') {
            var feed = document.getElementById('feed');
            var newPost = document.createElement('div');
            newPost.className = 'post';

            // Post Header
            var postHeader = document.createElement('div');
            postHeader.className = 'post-header';

            var userImg = document.createElement('img');
            userImg.src = 'images/user1.jpg';
            userImg.alt = 'User One';
            userImg.style.width = '20px';
            userImg.style.height = '20px';

            var userDetails = document.createElement('div');
            userDetails.className = 'user-details';

            var userName = document.createElement('h3');
            userName.textContent = 'User One';

            var userTitle = document.createElement('p');
            userTitle.textContent = 'Software Engineer';

            userDetails.appendChild(userName);
            userDetails.appendChild(userTitle);

            postHeader.appendChild(userImg);
            postHeader.appendChild(userDetails);

            // Create a postDetails object
            var postDetails = {
                id: generateId(),
                content: content,
                timestamp: new Date().toISOString(),
                likes: 0,
                comments: []
            };

            // Attach postDetails to the DOM element
            newPost.postDetails = postDetails;

            // Call the function to save the post to the server
            saveLinkedinPostToServer(postDetails);

            // Post Content
            var postContent = document.createElement('div');
            postContent.className = 'post-content';

            var postText = document.createElement('p');
            postText.textContent = content;

            postContent.appendChild(postText);

            // Post Actions
            var postActions = document.createElement('div');
            postActions.className = 'post-actions';

            var likeButton = document.createElement('button');
            likeButton.className = 'like-button';
            likeButton.textContent = 'Like (0)';
            addLikeButtonListener(likeButton, postDetails);

            var commentButton = document.createElement('button');
            commentButton.textContent = 'Comment';

            postActions.appendChild(likeButton);
            postActions.appendChild(commentButton);

            // Comment Section
            var commentSection = document.createElement('div');
            commentSection.className = 'comment-section';

            var commentInput = document.createElement('input');
            commentInput.type = 'text';
            commentInput.placeholder = 'Add a comment...';
            commentInput.className = 'comment-input';

            var commentSubmit = document.createElement('button');
            commentSubmit.className = 'comment-submit';
            commentSubmit.textContent = 'Submit';

            var commentsList = document.createElement('div');
            commentsList.className = 'comments-list';

            commentSection.appendChild(commentInput);
            commentSection.appendChild(commentSubmit);
            commentSection.appendChild(commentsList);

            // Assemble the post
            newPost.appendChild(postHeader);
            newPost.appendChild(postContent);
            newPost.appendChild(postActions);
            newPost.appendChild(commentSection);

            // Insert the new post at the top of the feed
            feed.insertBefore(newPost, feed.firstChild);

            // Add event listeners for the new post
            addCommentSectionListeners(newPost, postDetails);

            // Clear the textarea
            postContentTextarea.value = '';

            // Remove the draft from the server
            deleteDraftPostFromServer();
        } else {
            alert('Please enter some content before posting.');
        }
    });
});