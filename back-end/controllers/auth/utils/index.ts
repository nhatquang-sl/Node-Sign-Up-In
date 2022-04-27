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
    getActiveEmailMessage(`${ENV.APP_HOST}/auth/register-confirm/${emailActiveCode}`)
  );
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
