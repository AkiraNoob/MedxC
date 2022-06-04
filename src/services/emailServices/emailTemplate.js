const resetPasswordTemplate = (digitCode) => {
  const subject = 'MedX Account - Reset Password';
  const html = `<!doctype html>
  <html>
  
  <head>
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Simple Call To Action</title>
  <style>
  @media only screen and (max-width: 620px) {
    table[class=body] h1 {
      font-size: 28px !important;
      margin-bottom: 10px !important;
    }
  
    table[class=body] p,
  table[class=body] ul,
  table[class=body] ol,
  table[class=body] td,
  table[class=body] span,
  table[class=body] a {
      font-size: 16px !important;
    }
  
    table[class=body] .wrapper,
  table[class=body] .article {
      padding: 10px !important;
    }
  
    table[class=body] .content {
      padding: 0 !important;
    }
  
    table[class=body] .container {
      padding: 0 !important;
      width: 100% !important;
    }
  
    table[class=body] .main {
      border-left-width: 0 !important;
      border-radius: 0 !important;
      border-right-width: 0 !important;
    }
  
    table[class=body] .btn table {
      width: 100% !important;
    }
  
    table[class=body] .btn a {
      width: 100% !important;
    }
  
    table[class=body] .img-responsive {
      height: auto !important;
      max-width: 100% !important;
      width: auto !important;
    }
  }
  @media all {
    .ExternalClass {
      width: 100%;
    }
  
    .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
      line-height: 100%;
    }
  
    .apple-link a {
      color: inherit !important;
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      text-decoration: none !important;
    }
  }
  </style></head>
  
  <body class style="background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%; border-radius: 9999px;" width="100%" bgcolor="#eaebed">
          <tr>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
              <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; max-width: 580px; padding: 10px; width: 580px; height: 580px; display: flex; justify-content: center; align-items: center; Margin: 0 auto 0;" width="580" height="580" valign="top">
  
                  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 30px 10px 10px;">
                      <!-- START CENTERED WHITE CONTAINER -->
                      <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 10px; width: 100%;" width="100%">
                          <!-- START MAIN CONTENT AREA -->
                          <tr>
                              <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                                  <div class="header" style="padding: 10px 0 20px;">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                                          <tr>
                                              <td class="align-center" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                                                  <a href="https://medx.vn" style="color: #50AF50; text-decoration: underline;">
                                                      <img src="https://res.cloudinary.com/akiramedx/image/upload/v1649608489/home-logo_kkvsgl.png" height="100" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;"></a>
                                              </td>
                                          </tr>
                                      </table>
                                  </div>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                                      <tr>
                                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                                              <h2 style="color: #06090f; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; text-align: center; margin-bottom: 15px;">Quên mật khẩu</h2>
                                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; text-align: center; margin-bottom: 35px;">
                                                Chúng tôi nhận được yêu cầu đổi mật khẩu từ bạn. Vui lòng nhập code phía dưới để tiếp tục đổi mật khẩu
                                              </p>
                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; min-width: 100%; width: 100%;" width="100%">
                                                  <tbody>
                                                      <tr>
                                                        <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto; margin: 0 auto;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="font-family: sans-serif; font-size: 20px; font-weight: bold; vertical-align: top; border-radius: 5px; text-align: center; " valign="top" align="center"> 
                                                                            ${digitCode}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto; margin: 0 auto;">
                                                              <tbody>
                                                                  <p>Nếu bạn không thực hiện hành động trên; vui lòng <b>không nhập code</b></p>
                                                              </tbody>
                                                          </table>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
  
                          <!-- END MAIN CONTENT AREA -->
                      </table>
  
                      <!-- START FOOTER -->
                      <div class="footer" style="clear: both; margin-top: 20px; text-align: center; width: 100%;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                              <tr>
                                  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 0; padding-top: 0; margin: 0 auto; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                                      <img src="https://res.cloudinary.com/akiramedx/image/upload/v1649608489/home-logo_kkvsgl.png" height="40" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;">
                                      <p style="font-family: sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #9a9ea6; text-align: center; font-size: 1rem;" class="apple-link">MedX - Nền tảng học tập y khoa toàn diện</p>
                                  </td>
                              </tr>
                              <tr>
                                  <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 0; padding-top: 0; margin: 0 auto; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                                      <p style="font-family: sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #9a9ea6; font-size: 12px; text-align: center;">
                                          Sở hữu bởi <a href="https://medx.vn" target="_blank" style="color: #9a9ea6; font-size: 12px; text-align: center; text-decoration: none;">MedX</a>.
                                      </p>
                                  </td>
                              </tr>
                          </table>
                      </div>
                      <!-- END FOOTER -->
  
                      <!-- END CENTERED WHITE CONTAINER -->
                  </div>
              </td>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          </tr>
      </table>
  </body>
  
  </html>`;

  return {
    subject,
    html,
  };
};

const verifyEmailTemplate = (digitCode) => {
  const subject = 'MedX Account - Verify Your Email Address';
  const html = `<!doctype html>
  <html>
  
  <head>
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Simple Call To Action</title>
  <style>
  @media only screen and (max-width: 620px) {
    table[class=body] h1 {
      font-size: 28px !important;
      margin-bottom: 10px !important;
    }
  
    table[class=body] p,
  table[class=body] ul,
  table[class=body] ol,
  table[class=body] td,
  table[class=body] span,
  table[class=body] a {
      font-size: 16px !important;
    }
  
    table[class=body] .wrapper,
  table[class=body] .article {
      padding: 10px !important;
    }
  
    table[class=body] .content {
      padding: 0 !important;
    }
  
    table[class=body] .container {
      padding: 0 !important;
      width: 100% !important;
    }
  
    table[class=body] .main {
      border-left-width: 0 !important;
      border-radius: 0 !important;
      border-right-width: 0 !important;
    }
  
    table[class=body] .btn table {
      width: 100% !important;
    }
  
    table[class=body] .btn a {
      width: 100% !important;
    }
  
    table[class=body] .img-responsive {
      height: auto !important;
      max-width: 100% !important;
      width: auto !important;
    }
  }
  @media all {
    .ExternalClass {
      width: 100%;
    }
  
    .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
      line-height: 100%;
    }
  
    .apple-link a {
      color: inherit !important;
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      text-decoration: none !important;
    }
  
    .btn-primary table td:hover {
      background-color: #408A40 !important;
    }
  
    .btn-primary a:hover {
      background-color: #408A40 !important;
      border-color: #408A40 !important;
    }
  }
  </style></head>
  
  <body class style="background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%; border-radius: 9999px;" width="100%" bgcolor="#eaebed">
          <tr>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
              <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; max-width: 580px; padding: 10px; width: 580px; height: 580px; display: flex; justify-content: center; align-items: center; Margin: 0 auto 0;" width="580" height="580" valign="top">
  
                  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 30px 10px 10px;">
                      <!-- START CENTERED WHITE CONTAINER -->
                      <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 10px; width: 100%;" width="100%">
                          <!-- START MAIN CONTENT AREA -->
                          <tr>
                              <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                                  <div class="header" style="padding: 10px 0 20px;">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                                          <tr>
                                              <td class="align-center" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                                                  <a href="https://medx.vn" style="color: #50AF50; text-decoration: underline;">
                                                      <img src="https://res.cloudinary.com/akiramedx/image/upload/v1649608489/home-logo_kkvsgl.png" height="100" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;"></a>
                                              </td>
                                          </tr>
                                      </table>
                                  </div>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                                      <tr>
                                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                                              <h2 style="color: #06090f; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; text-align: center; margin-bottom: 15px;">Xác thực tài khoản
                                                  email của bạn</h2>
                                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; text-align: center; margin-bottom: 35px;"> Vui lòng sử dụng mã phía dưới để xác nhận rằng bạn muốn sử dụng email này để đăng ký tài khoản tại
                                                  <a href="https://medx.vn" target="_blank" style="color: #50AF50; text-decoration: underline;">MedX</a>.
                                              </p>
                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; min-width: 100%; width: 100%;" width="100%">
                                                  <tbody>
                                                      <tr>
                                                          <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto; margin: 0 auto;">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style="font-family: sans-serif; font-size: 20px; font-weight: bold; vertical-align: top; border-radius: 5px; text-align: center; " valign="top" align="center"> 
                                                                              ${digitCode}
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
                                  </table>
                              </td>
                          </tr>
  
                          <!-- END MAIN CONTENT AREA -->
                      </table>
  
                      <!-- START FOOTER -->
                      <div class="footer" style="clear: both; margin-top: 20px; text-align: center; width: 100%;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                              <tr>
                                  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 0; padding-top: 0; margin: 0 auto; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                                      <img src="https://res.cloudinary.com/akiramedx/image/upload/v1649608489/home-logo_kkvsgl.png" height="40" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;">
                                      <p style="font-family: sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #9a9ea6; text-align: center; font-size: 1rem;" class="apple-link">MedX - Nền tảng học tập y khoa toàn diện</p>
                                  </td>
                              </tr>
                              <tr>
                                  <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 0; padding-top: 0; margin: 0 auto; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                                      <p style="font-family: sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #9a9ea6; font-size: 12px; text-align: center;">
                                          Sở hữu bởi <a href="https://medx.vn" target="_blank" style="color: #9a9ea6; font-size: 12px; text-align: center; text-decoration: none;">MedX</a>.
                                      </p>
                                  </td>
                              </tr>
                          </table>
                      </div>
                      <!-- END FOOTER -->
  
                      <!-- END CENTERED WHITE CONTAINER -->
                  </div>
              </td>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          </tr>
      </table>
  </body>
  
  </html>`;

  return {
    subject,
    html,
  };
};

const resendCodeTemplate = (digitCode) => {
  const subject = 'MedX Account - Resend Code';
  const html = `<!doctype html>
  <html>
  
  <head>
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Simple Call To Action</title>
  <style>
  @media only screen and (max-width: 620px) {
    table[class=body] h1 {
      font-size: 28px !important;
      margin-bottom: 10px !important;
    }
  
    table[class=body] p,
  table[class=body] ul,
  table[class=body] ol,
  table[class=body] td,
  table[class=body] span,
  table[class=body] a {
      font-size: 16px !important;
    }
  
    table[class=body] .wrapper,
  table[class=body] .article {
      padding: 10px !important;
    }
  
    table[class=body] .content {
      padding: 0 !important;
    }
  
    table[class=body] .container {
      padding: 0 !important;
      width: 100% !important;
    }
  
    table[class=body] .main {
      border-left-width: 0 !important;
      border-radius: 0 !important;
      border-right-width: 0 !important;
    }
  
    table[class=body] .btn table {
      width: 100% !important;
    }
  
    table[class=body] .btn a {
      width: 100% !important;
    }
  
    table[class=body] .img-responsive {
      height: auto !important;
      max-width: 100% !important;
      width: auto !important;
    }
  }
  @media all {
    .ExternalClass {
      width: 100%;
    }
  
    .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
      line-height: 100%;
    }
  
    .apple-link a {
      color: inherit !important;
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      text-decoration: none !important;
    }
  
    .btn-primary table td:hover {
      background-color: #408A40 !important;
    }
  
    .btn-primary a:hover {
      background-color: #408A40 !important;
      border-color: #408A40 !important;
    }
  }
  </style></head>
  
  <body class style="background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%; border-radius: 9999px;" width="100%" bgcolor="#eaebed">
          <tr>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
              <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; max-width: 580px; padding: 10px; width: 580px; height: 580px; display: flex; justify-content: center; align-items: center; Margin: 0 auto 0;" width="580" height="580" valign="top">
  
                  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 30px 10px 10px;">
                      <!-- START CENTERED WHITE CONTAINER -->
                      <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 10px; width: 100%;" width="100%">
                          <!-- START MAIN CONTENT AREA -->
                          <tr>
                              <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                                  <div class="header" style="padding: 10px 0 20px;">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                                          <tr>
                                              <td class="align-center" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                                                  <a href="https://medx.vn" style="color: #50AF50; text-decoration: underline;">
                                                      <img src="https://res.cloudinary.com/akiramedx/image/upload/v1649608489/home-logo_kkvsgl.png" height="100" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;"></a>
                                              </td>
                                          </tr>
                                      </table>
                                  </div>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                                      <tr>
                                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                                              <h2 style="color: #06090f; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; text-align: center; margin-bottom: 15px;">Gửi lại mã</h2>
                                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; text-align: center; margin-bottom: 35px;"> Vui lòng sử dụng mã phía dưới để xác nhận rằng bạn muốn sử dụng email này để đăng ký tài khoản tại
                                                  <a href="https://medx.vn" target="_blank" style="color: #50AF50; text-decoration: underline;">MedX</a>.
                                              </p>
                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; min-width: 100%; width: 100%;" width="100%">
                                                  <tbody>
                                                      <tr>
                                                          <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto; margin: 0 auto;">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style="font-family: sans-serif; font-size: 20px; font-weight: bold; vertical-align: top; border-radius: 5px; text-align: center; " valign="top" align="center"> 
                                                                              ${digitCode}
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
                                  </table>
                              </td>
                          </tr>
  
                          <!-- END MAIN CONTENT AREA -->
                      </table>
  
                      <!-- START FOOTER -->
                      <div class="footer" style="clear: both; margin-top: 20px; text-align: center; width: 100%;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                              <tr>
                                  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 0; padding-top: 0; margin: 0 auto; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                                      <img src="https://res.cloudinary.com/akiramedx/image/upload/v1649608489/home-logo_kkvsgl.png" height="40" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;">
                                      <p style="font-family: sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #9a9ea6; text-align: center; font-size: 1rem;" class="apple-link">MedX - Nền tảng học tập y khoa toàn diện</p>
                                  </td>
                              </tr>
                              <tr>
                                  <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 0; padding-top: 0; margin: 0 auto; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                                      <p style="font-family: sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #9a9ea6; font-size: 12px; text-align: center;">
                                          Sở hữu bởi <a href="https://medx.vn" target="_blank" style="color: #9a9ea6; font-size: 12px; text-align: center; text-decoration: none;">MedX</a>.
                                      </p>
                                  </td>
                              </tr>
                          </table>
                      </div>
                      <!-- END FOOTER -->
  
                      <!-- END CENTERED WHITE CONTAINER -->
                  </div>
              </td>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          </tr>
      </table>
  </body>
  
  </html>`;

  return {
    subject,
    html,
  };
};

module.exports = {
  resetPasswordTemplate,
  verifyEmailTemplate,
  resendCodeTemplate,
};
