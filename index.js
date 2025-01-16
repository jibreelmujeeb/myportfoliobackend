const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { fullName, email, organization, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jibreelmujeeb@gmail.com", 
      pass: "rnebdyrooswujhgu",  
    },
  });


  const recipientMailOptions = {
    from: email, 
    to: "jibreelmujeeb@gmail.com",  
    subject: `Contact Form Submission from ${fullName}`,
    text: `Full Name: ${fullName}\nEmail: ${email}\nOrganization: ${organization}\nMessage: ${message}`,
  };


  const userMailOptions = {
    from: "jibreelmujeeb@gmail.com", 
    to: email, 
    subject: "Thank you for Reaching Out!",
    text: `Dear ${fullName},\n\nI hope this email finds you well. Thank you for reaching out to me through the contact form on my portfolio. I appreciate the time you took to connect with me, and I'm excited to respond to your inquiry.

I have received your message and will do my best to get back to you as soon as possible. Your interest means a lot to me, and I'm looking forward to discussing the matter further.

In the meantime, if there are any additional details or specific information you would like me to consider in my response, please feel free to let me know.

Thank you once again for getting in touch. I value your interest and am eager to connect with you soon.\n\nBest regards,  
    \n Dev/Analyst:mujeeb Itan olu`,
  };

  try {
   
    await transporter.sendMail(recipientMailOptions);

  
    await transporter.sendMail(userMailOptions);

    res.status(200).send("Emails sent successfully");
  } catch (error) {
    res.status(500).send("Error sending email");
    
  }
});

const PORT = 5000;
app.listen(PORT, () => {
});
