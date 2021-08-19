import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDMAIL_API_KEY);

export const sendEmail = async (recipient) => {
  const msg = {
    to: "yniyoo@gmail.com", // Change to your recipient
    from: "adhanamengisteab@gmail.com", // Change to your verified sender
    subject: "Test for Email API endpoint second text",
    //   text: 'and easy to do anywhere, even with Node.js',
    html: "<strong>Hello from somewhere and this is a test!.</strong>",
  };
  await sgMail.send(msg);
};
