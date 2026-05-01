import { Resend } from 'resend';

async function testEmail() {
  const resend = new Resend('re_6diKbyFS_PufJ1Xtx2NRQu9duV48coA2s');

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'rajyalaxmi1981@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    console.log("✅ Email sent successfully!", data);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

testEmail();
