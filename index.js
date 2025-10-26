const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // Ensure dotenv is installed: npm install dotenv

const app = express();
app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added { extended: true } for best practice


const user = process.env.USER; // Your Gmail address from .env (e.g., jibreelmujeeb@gmail.com)
const pass = process.env.PASS; // Your App Password from .env
console.log(pass ? "PASS loaded" : "PASS missing", user ? "USER loaded" : "USER missing");


app.post("/send-email", async (req, res) => {
  const { fullName, email, organization, message } = req.body;

  // 1. Create the Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user, // The email account sending the mail (jibreelmujeeb@gmail.com)
      pass: pass, // The App Password (crucial fix)
    },
  });

  // 2. Mail Options for the Recipient (You)
  const recipientMailOptions = {
    from: user, // <--- FIXED: Must be the authenticated user to pass Gmail security
    to: "jibreelmujeeb@gmail.com", // Your email address
    replyTo: email, // <--- ADDED: To easily reply to the user who filled the form
    subject: `Contact Form Submission from ${fullName}`,
    text: `Full Name: ${fullName}\nEmail: ${email}\nOrganization: ${organization}\nMessage: ${message}`,
  };

  // 3. Mail Options for the User (Auto-Reply)
  const userMailOptions = {
    from: user, // <--- CONSISTENCY: Better to use the 'user' variable
    to: email, // The user's email address
    subject: "Thank you for Reaching Out!",
    text: `Dear ${fullName},\n\nI hope this email finds you well. Thank you for reaching out to me through the contact form on my portfolio. I appreciate the time you took to connect with me, and I'm excited to respond to your inquiry.

I have received your message and will do my best to get back to you as soon as possible. Your interest means a lot to me, and I'm looking forward to discussing the matter further.

In the meantime, if there are any additional details or specific information you would like me to consider in my response, please feel free to let me know.

Thank you once again for getting in touch. I value your interest and am eager to connect with you soon.\n\nBest regards,
Dev/Analyst:mujeeb Itan olu`,
  };

  try {
    // Send email to you
    await transporter.sendMail(recipientMailOptions);
    // Send auto-reply to the user
    await transporter.sendMail(userMailOptions);

    res.status(200).send("Emails sent successfully");
  } catch (error) {
    console.error("Error sending email:", error); // Use console.error for errors
    // Log detailed error information to help debug
    if (error.responseCode === 535) {
        res.status(500).send("Error sending email: Authentication failed (Did you use an App Password?)");
    } else {
        res.status(500).send("Error sending email");
    }
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server RUNNING on port ${PORT}`);
});