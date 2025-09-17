const nodemailer = require("nodemailer")

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    message.replaceAll("<", "&lt;")
    message.replaceAll(">", "&gt;")

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "finn.reese@gmail.com",
      subject: `Music Inquiry from ${name}`,
      html: `
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      headers: {
        "X-Gmail-Labels": "Music Inquiries"
      }
    })

    return res.status(200).json({ message: "Email sent successfully" })
  } catch (err) {
    console.error("Email send error:", err)
    return res.status(500).json({ error: err.message || "Unknown server error" })
  }
}
