
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Resend Configuration
const RESEND_API_KEY = "re_4XNF46kg_8Hbe4hAwE2j2Wkpn62iQ22SM";
const RESEND_API_URL = "https://api.resend.com/emails";

app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Core Corp <onboarding@resend.dev>",
        to: ["corecorpco@gmail.com"],
        subject: `New Inquiry from ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #d47512; border-radius: 8px;">
            <h2 style="color: #d47512;">Consultation Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Service:</strong> ${service}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
        `
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ success: true, data });
    } else {
      res.status(response.status).json({ success: false, error: data });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
