const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
const minimist = require("minimist"); // Import minimist

const app = express();

// Parse command-line arguments
const args = minimist(process.argv.slice(2));
const port = args.port || 3000;
const behaviorId = args.behavior_id || 0;
const llmName = args.llm_name || "gpt-4o";
const agentName = args.agent_name || "open-devin";

app.use(bodyParser.json());
app.use(cors()); // Use CORS
app.use(express.static(path.join(__dirname, "..", "whatsapp")));

// Helper function to generate unique IDs
const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

app.post("/saveTweet", (req, res) => {
  const tweetText = req.body.tweetText;

  const fileName = `twitter_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.txt`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.appendFile(filePath, tweetText + "\n", (err) => {
    if (err) {
      console.error("Error saving tweet:", err);
      res.status(500).json({ message: "Error saving tweet" });
    } else {
      console.log("Tweet saved successfully");
      res.status(200).json({ message: "Tweet saved successfully" });
    }
  });
});

app.post("/saveReview", (req, res) => {
  const reviewText = req.body.reviewText;

  const fileName = `review_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.txt`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.appendFile(filePath, reviewText + "\n", (err) => {
    if (err) {
      console.error("Error saving reviews:", err);
      res.status(500).json({ message: "Error saving tweet" });
    } else {
      console.log("Review saved successfully");
      res.status(200).json({ message: "Tweet saved successfully" });
    }
  });
});

// Endpoint to handle login attempts
app.post("/saveLogin", (req, res) => {
  const { username, password } = req.body;

  const fileName = `login_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.txt`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  if (username && password) {
    const logEntry = `Username: ${username}, Password: ${password}\n`;

    // Append the login details to the logins.txt file
    fs.appendFile(filePath, logEntry, (err) => {
      if (err) {
        console.error("Error saving login attempt:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("Login attempt logged");
    });
  } else {
    res.status(400).send("Bad Request: Username and Password required");
  }
});

app.post("/saveEmail", (req, res) => {
  const emailDetails = req.body;
  const emailId = emailDetails.id || generateId();

  // Assign the generated or existing ID to the email details
  emailDetails.id = emailId;

  const fileName = `email_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  // Read the existing emails from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let emails = data ? JSON.parse(data) : [];

    // Check if email with this ID already exists
    const existingEmailIndex = emails.findIndex(
      (email) => email.id === emailId
    );

    if (existingEmailIndex !== -1) {
      // Update existing email
      emails[existingEmailIndex] = emailDetails;
    } else {
      // Add new email
      emails.push(emailDetails);
    }

    // Save the updated emails back to the file
    fs.writeFile(filePath, JSON.stringify(emails, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: "Email saved successfully", id: emailId });
    });
  });
});

// Endpoint to handle logging issue details
app.post("/gitlabIssue", (req, res) => {
  const issueDetails = req.body;

  // Path to the file where issue logs will be saved
  const fileName = `gitlab_issue_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  // Only save the latest issue details in a single JSON object
  const issue = {
    issue_title: issueDetails.title || "",
    issue_body: issueDetails.body || "",
  };

  // Write the latest issue details to the file
  fs.writeFile(filePath, JSON.stringify(issue, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ message: "Issue details updated successfully" });
  });
});
// Endpoint to save LinkedIn post
app.post("/saveLinkedinPost", (req, res) => {
  const postDetails = req.body;
  const postId = postDetails.id || generateId();

  // Assign the generated or existing ID to the post details
  postDetails.id = postId;

  const fileName = `linkedin_posts_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  // Read the existing posts from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading posts file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let posts = data ? JSON.parse(data) : [];

    // Check if post with this ID already exists
    const existingPostIndex = posts.findIndex((post) => post.id === postId);

    if (existingPostIndex !== -1) {
      // Update existing post
      posts[existingPostIndex] = postDetails;
    } else {
      // Add new post
      posts.push(postDetails);
    }

    // Save the updated posts back to the file
    fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing posts file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: "LinkedIn post saved successfully", id: postId });
    });
  });
});

// Endpoint to save draft post
app.post("/saveLinkedinDraftPost", (req, res) => {
  const draftPostDetails = req.body;

  const fileName = `linkedin_draft_post_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  // Save the draft post details to the file
  fs.writeFile(
    filePath,
    JSON.stringify(draftPostDetails, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing draft post file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: "LinkedIn draft post saved successfully" });
    }
  );
});

// Endpoint to get draft post
app.get("/getLinkedinDraftPost", (req, res) => {
  const fileName = `linkedin_draft_post_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading draft post file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data) {
      const draftPostDetails = JSON.parse(data);
      res.json(draftPostDetails);
    } else {
      res.json({});
    }
  });
});

// Endpoint to delete draft post
app.delete("/deleteLinkedinDraftPost", (req, res) => {
  const fileName = `linkedin_draft_post_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error deleting draft post file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ message: "LinkedIn draft post deleted successfully" });
  });
});

// Endpoint to save draft comment
app.post("/saveLinkedinDraftComment", (req, res) => {
  const draftCommentDetails = req.body;
  const postId = draftCommentDetails.postId;

  const fileName = `linkedin_draft_comment_${postId}_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  // Save the draft comment to the file
  fs.writeFile(
    filePath,
    JSON.stringify(draftCommentDetails, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing draft comment file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: "LinkedIn draft comment saved successfully" });
    }
  );
});

// Endpoint to get draft comment
app.get("/getLinkedinDraftComment", (req, res) => {
  const postId = req.query.postId;

  const fileName = `linkedin_draft_comment_${postId}_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading draft comment file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data) {
      const draftCommentDetails = JSON.parse(data);
      res.json(draftCommentDetails);
    } else {
      res.json({});
    }
  });
});

// Endpoint to delete draft comment
app.delete("/deleteLinkedinDraftComment", (req, res) => {
  const postId = req.query.postId;

  const fileName = `linkedin_draft_comment_${postId}_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error deleting draft comment file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ message: "LinkedIn draft comment deleted successfully" });
  });
});

// Endpoint to save draft messages
app.post("/saveDraftMessage", (req, res) => {
  const draftData = req.body;

  const fileName = `draft_user_${draftData.userId}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.appendFile(filePath, tweetText + '\n', (err) => {
    if (err) {
        console.error('Error saving text message:', err);
        res.status(500).json({ message: 'Error saving text message' });
    } else {
        console.log('Text message saved successfully');
        res.status(200).json({ message: 'Text message saved successfully' });
    }
  });
});


// Endpoint to get a draft message
app.get("/getDraftMessage", (req, res) => {
  const userId = req.query.userId;

  const fileName = `draft_user_${userId}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.json({ draftMessage: "" });
      } else {
        console.error("Error reading draft message file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    const draftData = JSON.parse(data);
    res.json({ draftMessage: draftData.draftMessage });
  });
});

// Endpoint to delete a draft message
app.post("/deleteDraftMessage", (req, res) => {
  const userId = req.body.userId;

  const fileName = `draft_user_${userId}.json`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.json({ message: "Draft message deleted" });
      } else {
        console.error("Error deleting draft message file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    res.json({ message: "Draft message deleted" });
  });
});


// Endpoint to save Instagram login attempt
app.post("/saveInstagramLogin", (req, res) => {
  const { username, password } = req.body;

  const fileName = `instagram-login_behaviorID=${behaviorId}_llm=${llmName}_agent=${agentName}.txt`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  if (username && password) {
    const logEntry = `Username: ${username}\nPassword: ${password}\n\n`;

    fs.appendFile(filePath, logEntry, (err) => {
      if (err) {
        console.error("Error saving login attempt:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("Login attempt logged");
    });
  } else {
    res.status(400).send("Bad Request: Username and Password required");
  }
});

// Endpoint to save Facebook login attempt
app.post("/saveFacebookLogin", (req, res) => {
  const { username, password } = req.body;

  const fileName = `facebook-login_behaviorID=${behaviorId}_llm=${llmName}_agent=${agentName}.txt`;
  const filePath = path.join(__dirname, "saved_logs", fileName);

  if (username && password) {
    const logEntry = `Username: ${username}\nPassword: ${password}\n\n`;

    fs.appendFile(filePath, logEntry, (err) => {
      if (err) {
        console.error("Error saving login attempt:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("Login attempt logged");
    });
  } else {
    res.status(400).send("Bad Request: Username and Password required");
  }
});

// Endpoint to log ad clicks
app.post('/logAdClick', (req, res) => {
    const { adTitle, action } = req.body;
    const timestamp = new Date().toISOString();

    const logEntry = {
        id: generateId(),
        timestamp,
        adTitle,
        action
    };

    const fileName = `ad_clicks_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
    const filePath = path.join(__dirname, 'saved_logs', fileName);

    // Read existing log file or initialize an empty array
    fs.readFile(filePath, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            try {
                logs = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
            }
        }

        logs.push(logEntry);

        fs.writeFile(filePath, JSON.stringify(logs, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving log:', writeErr);
                res.status(500).json({ message: 'Error saving log' });
            } else {
                console.log('Ad click logged successfully');
                res.status(200).json({ message: 'Ad click logged successfully' });
            }
        });
    });
});

// Endpoint to save feedback passively
app.post('/saveFeedback', (req, res) => {
    const { candidateName, interviewerName, feedback } = req.body;
    const timestamp = new Date().toISOString();

    const logEntry = {
        id: generateId(),
        timestamp,
        candidateName,
        interviewerName,
        feedback
    };

    const fileName = `feedback_candidate_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
    const filePath = path.join(__dirname, 'saved_logs', fileName);

    // Read existing log file or initialize an empty array
    fs.readFile(filePath, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            try {
                logs = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
            }
        }

        // Remove any existing entry by this interviewer
        // logs = logs.filter(entry => entry.interviewerName !== interviewerName);

        // Add the new feedback entry
        logs.push(logEntry);

        fs.writeFile(filePath, JSON.stringify(logs, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving feedback:', writeErr);
                res.status(500).json({ message: 'Error saving feedback' });
            } else {
                console.log('Feedback saved successfully');
                res.status(200).json({ message: 'Feedback saved successfully' });
            }
        });
    });
});

// Endpoint to save click actions
app.post('/saveClickAction', (req, res) => {
    const { candidateName, interviewerName, action } = req.body;
    const timestamp = new Date().toISOString();

    const logEntry = {
        id: generateId(),
        timestamp,
        candidateName,
        interviewerName,
        action
    };

    const fileName = `feedback_candidate_behaviorID=${behaviorId},llm=${llmName},agent=${agentName}.json`;
    const filePath = path.join(__dirname, 'saved_logs', fileName);

    // Read existing log file or initialize an empty array
    fs.readFile(filePath, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            try {
                logs = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
            }
        }

        logs.push(logEntry);

        fs.writeFile(filePath, JSON.stringify(logs, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving click action:', writeErr);
                res.status(500).json({ message: 'Error saving click action' });
            } else {
                console.log('Click action saved successfully');
                res.status(200).json({ message: 'Click action saved successfully' });
            }
        });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
