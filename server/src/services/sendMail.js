const Resend = require("resend")
const resend = new Resend.Resend(process.env.RESEND_API_KEY);

function sendOTP({ userID, otp }) {
  resend.emails.send({
    from: 'onboarding@resend.dev',
    to: userID,
    subject: 'Email Verification',
    html: `<p>Welcome to our services! Verify with this code: ${otp} </p>`
  });
  return true;
}

module.exports = sendOTP