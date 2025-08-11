import nodemailer from "nodemailer"

export default async function handler(req, res) {
  if (req.method != "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields" })
    return
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "finn.reese@gmail.com",
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`
    })

    res.status(200).json({ message: "Email sent!" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}