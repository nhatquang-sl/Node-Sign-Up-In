import ENV from '@config';
import { sendEmail } from '@services/email';
import { UserDto } from '@libs/user/dto';

export const sendActivateEmail = async (user: UserDto, securityStamp: string) => {
  const emailActiveCode = Buffer.from(
    JSON.stringify({
      id: user.id,
      securityStamp: securityStamp,
      timestamp: new Date().getTime(),
    })
  ).toString('base64');

  await sendEmail(
    user.emailAddress,
    'Welcome to QNN! Confirm Your Email',
    getActiveEmailMessage(`${ENV.FE_ENDPOINT}/register-confirm/${emailActiveCode}`)
  );
};

export const sendResetPasswordEmail = async (emailAddress: string, resetPasswordToken: string) => {
  await sendEmail(
    emailAddress,
    'You Had Requested To Reset Your Password On QNN',
    getResetPasswordEmailMessage(`${ENV.FE_ENDPOINT}/reset-password/${resetPasswordToken}`)
  );
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getResetPasswordEmailMessage = (
  resetPasswordLink: string
) => `<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;background-color: #17202A;">
<tr></tr>
<tr>
  <td colspan="2" align="center">
    <div style="padding-left: 15px; padding-right: 15px; padding-top: 15px; padding-bottom: 0px; color: #fff; margin-top: 5px;border-radius: 8px 8px 0 0; font-family: 'Ubuntu';">
      <div style="padding-bottom: 15px; font-size: 26px; font-weight: bold; position: relative;"> Forgot your password <span style="position: absolute; display: block; overflow: hidden; width: 114px; height: 5px; border-radius: 5px; bottom: 0; left: 50%; background-color: #EFCA2D; transform: translateX(-50%);"></span>
      </div>
    </div>
  </td>
</tr>
<tr>
  <td colspan="2">
    <div style="padding-top: 20px; padding-bottom: 20px; padding-left: 25px; padding-right: 25px; color: rgba(255, 255, 255, 0.7); ">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td>
            <div>
              <table>
                <tr>
                  <td style="padding-top: 5px; padding-bottom: 5px;"> Thank you for your request. </td>
                </tr>
                <tr>
                  <td style="padding-top: 5px; padding-bottom: 5px;"> You have requested to reset your password. Click below button to change it. </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 10px; padding-bottom: 10px;">
            <a href="${resetPasswordLink}" style="text-align:center; padding: 0 20px; line-height: 50px; overflow: hidden; border-radius: 8px; text-decoration: none; background-color: #EFCA2D; color: #17202A; font-size: 18px; margin-bottom: 10px; display: inline-block;">Change password</a>
          </td>
        </tr>
      </table>
    </div>
  </td>
</tr>
<tr> `;

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
