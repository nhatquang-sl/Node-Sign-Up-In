import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

import { sendEmail } from '@services/email';
import User from '@database/models/user';

const handleRegister = async (request: Request, response: Response) => {
  const req: User = request.body;

  const errors = validateRequest(req);
  if (errors.length) return response.status(400).json({ errors });

  // Check for duplicate usernames in the db
  // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
  const duplicate = await User.findOne({ where: { emailAddress: req.emailAddress } });
  if (duplicate) return response.sendStatus(409); // Conflict

  req.emailConfirmed = false;
  // encrypt the password
  req.password = await bcrypt.hash(req.password, 10);
  req.securityStamp = uuid();
  req.refreshToken = jwt.sign(
    {
      emailAddress: req.emailAddress
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );
  console.log(req.id);
  // Create and store the new user
  const result = await User.create({
    emailAddress: req.emailAddress,
    firstName: req.firstName,
    lastName: req.lastName,
    password: req.password,
    emailConfirmed: false,
    refreshToken: req.refreshToken,
    securityStamp: req.securityStamp
  });
  console.log(result.id);
  await sendConfirmEmail(result);

  response.cookie('jwt', req.refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  // Create JWTs
  const accessToken = jwt.sign(
    { emailAddress: req.emailAddress, emailConfirmed: req.emailConfirmed },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '30s' }
  );
  response.status(201).json({
    accessToken,
    firstName: result.firstName,
    lastName: result.lastName,
    emailAddress: result.emailAddress,
    emailConfirmed: result.emailConfirmed
  });
};

const sendConfirmEmail = async (user: User) => {
  const emailActiveCode = Buffer.from(
    JSON.stringify({
      id: user.id,
      securityStamp: user.securityStamp,
      timestamp: new Date().getTime()
    })
  ).toString('base64');

  await sendEmail(
    user.emailAddress,
    'Welcome to QNN! Confirm Your Email',
    getActiveEmailMessage(`http://localhost:3500/auth/register-confirm/${emailActiveCode}`)
  );
};

const validateRequest = (req: User) => {
  let errors = [];

  if (!req.firstName) errors.push('First Name is required!');

  // Validate Email address
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(req.emailAddress))
    errors.push('Email Address is invalid!');

  // Validate Password
  if (!/[a-z]/.test(req.password)) errors.push('Password contains at least one lower character');
  if (!/[A-Z]/.test(req.password)) errors.push('Password contains at least one upper character');
  if (!/\d/.test(req.password)) errors.push('Password contains at least one digit character');
  if (!/[-+_!@#$%^&*.,?]/.test(req.password))
    errors.push('Password contains at least one special character');
  if (req.password?.length < 8) errors.push('Password contains at least 8 characters');

  return errors;
};

const getActiveEmailMessage = (
  activeLink: string
) => `<table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
<tbody>
  <tr>
    <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top">
    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
      <tbody>
        <tr>
          <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
          <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#294661!important">You're on your way!<br>
          Let's confirm your email address.</h2>

          <p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">By clicking on the following link, you are confirming your email address.</p>
          </td>
        </tr>
        <tr>
          <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
          <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%">
            <tbody>
              <tr>
                <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top">
                <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important">
                  <tbody>
                    <tr>
                      <td align="center" bgcolor="#348eda" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top">
                        <a href="${activeLink}" style="box-sizing:border-box;border-color:#348eda;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#348eda;border:solid 1px #348eda;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Confirm Email Address</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </td>
              </tr>
            </tbody>
          </table>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
  </tr>
</tbody>
</table>`;

export default handleRegister;
