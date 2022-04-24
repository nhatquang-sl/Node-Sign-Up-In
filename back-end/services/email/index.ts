import ENV from '@config';
import nodeMailjet from 'node-mailjet';

const mailjet = nodeMailjet.connect(ENV.MJ_APIKEY_PUBLIC, ENV.MJ_APIKEY_PRIVATE);

const sendEmail = async (toEmail: string, subject: string, message: string) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'quang.sunlight@gmail.com',
          Name: 'Quang Nguyen',
        },
        To: [
          {
            Email: toEmail,
            // Name: req.body.name
          },
        ],
        Subject: subject,
        HTMLPart: message,
      },
    ],
  });

  let response = await request;
  console.log(response);
};

export { sendEmail };
