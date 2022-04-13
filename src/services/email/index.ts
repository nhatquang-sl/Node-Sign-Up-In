import nodeMailjet from 'node-mailjet';
const mailjet = nodeMailjet.connect(
  process.env.MJ_APIKEY_PUBLIC ?? '',
  process.env.MJ_APIKEY_PRIVATE ?? ''
);

const sendEmail = async (toEmail: string, subject: string, message: string) => {
  const msg = {
    to: toEmail, // Change to your recipient
    from: 'quang.sunlight@gmail.com', // Change to your verified sender
    subject: subject,
    text: message,
    html: message
  };

  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'quang.sunlight@gmail.com',
          Name: 'Quang Nguyen'
        },
        To: [
          {
            Email: toEmail
            // Name: req.body.name
          }
        ],
        Subject: subject,
        HTMLPart: message
      }
    ]
  });

  let response = await request;
  console.log(response);
};

export { sendEmail };
