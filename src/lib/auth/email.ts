import nodemailer from "nodemailer"; 

const transporter = nodemailer.createTransport({ 
  host: process.env.SMTP_HOST, 
  port: Number(process.env.SMTP_PORT), 
  secure: Number(process.env.SMTP_PORT) === 465, 
  auth: { 
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASSWORD, 
  }, 
}); 

export async function sendSignupVerificationLink(email: string, url: string) { 
  try { 
    const data = await transporter.sendMail({ 
      to: email, 
      from: process.env.EMAIL_FROM!, 
      subject: "Vérifiez votre adresse email - TurtleGuide", 
      html: ` 
      <!DOCTYPE html> 
      <html lang="fr"> 
        <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, Helvetica, sans-serif;"> 
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 40px 0;"> 
            <tr> 
              <td align="center"> 
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow: hidden;"> 
                  <tr> 
                    <td style="background-color:#16a34a; padding: 24px 40px;"> 
                      <span style="color:#ffffff; font-size: 20px; font-weight: bold;">TurtleGuide</span> 
                    </td> 
                  </tr> 
                  <tr> 
                    <td style="padding: 40px;"> 
                      <h1 style="margin: 0 0 16px 0; font-size: 22px; color:#1e293b;"> 
                        Bienvenue sur TurtleGuide 🐢 
                      </h1> 
                      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color:#1e293b;"> 
                        Cliquez sur le bouton ci-dessous pour confirmer votre adresse email : 
                      </p> 
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"> 
                        <tr> 
                          <td align="center" style="padding: 8px 0 24px 0;"> 
                            <a href="${url}" style=" 
                              display:inline-block; 
                              padding: 14px 32px; 
                              background-color:#16a34a; 
                              color:#ffffff; 
                              text-decoration:none; 
                              font-weight:bold; 
                              border-radius: 8px; 
                              font-size: 15px; 
                            "> 
                              Vérifier mon email 
                            </a> 
                          </td> 
                        </tr> 
                      </table> 
                      <p style="margin: 0; font-size: 13px; line-height: 1.6; color:#64748b;"> 
                        Ce lien est valable pendant 1 heure. Si le bouton ne fonctionne pas, copiez ce lien : <br/> 
                        <span style="color:#16a34a; word-break: break-all;">${url}</span> 
                      </p> 
                    </td> 
                  </tr> 
                </table> 
              </td> 
            </tr> 
          </table> 
        </body> 
      </html> 
      `, 
    }); 
    return data; 
  } catch (error) { 
    console.error("Erreur d'envoi de l'email :", error); 
    throw new Error("Impossible d'envoyer l'email"); 
  } 
} 
export async function sendPasswordResetOTP(email: string, otp: string) { 
  try { 
    const data = await transporter.sendMail({ 
      to: email, 
      from: process.env.EMAIL_FROM!, 
      subject: "Votre code de réinitialisation - TurtleGuide", 
      html: ` 
      <!DOCTYPE html> 
      <html lang="fr"> 
        <head> 
          <meta charset="utf-8" /> 
          <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
          <title>Réinitialisation de mot de passe</title> 
        </head> 
        <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, Helvetica, sans-serif;"> 
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 40px 0;"> 
            <tr> 
              <td align="center"> 
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);"> 
                  
                  <!-- Header --> 
                  <tr> 
                    <td style="background-color:#16a34a; padding: 24px 40px;"> 
                      <span style="color:#ffffff; font-size: 20px; font-weight: bold;">TurtleGuide</span> 
                    </td> 
                  </tr> 

                  <!-- Body --> 
                  <tr> 
                    <td style="padding: 40px;"> 
                      <h1 style="margin: 0 0 16px 0; font-size: 22px; color:#1e293b;"> 
                        Réinitialisation de votre mot de passe 
                      </h1> 

                      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color:#1e293b;"> 
                        Vous avez demandé à réinitialiser votre mot de passe TurtleGuide. Voici votre code de vérification : 
                      </p> 

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"> 
                        <tr> 
                          <td align="center" style="padding: 24px 0;"> 
                            <div style=" 
                              display:inline-block; 
                              padding: 16px 32px; 
                              background-color:#f0fdf4; 
                              border: 1px solid #bbf7d0; 
                              border-radius: 12px; 
                              font-size: 32px; 
                              font-weight: bold; 
                              letter-spacing: 8px; 
                              color:#16a34a; 
                            "> 
                              ${otp} 
                            </div> 
                          </td> 
                        </tr> 
                      </table> 

                      <p style="margin: 16px 0; font-size: 15px; line-height: 1.6; color:#1e293b;"> 
                        Ce code est valable pendant <strong>5 minutes</strong>. 
                      </p> 

                      <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.6; color:#64748b;"> 
                        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. 
                      </p> 
                    </td> 
                  </tr> 

                  <!-- Footer --> 
                  <tr> 
                    <td style="padding: 24px 40px; background-color:#f8fafc; border-top: 1px solid #e2e8f0;"> 
                      <p style="margin:0; font-size: 12px; color:#94a3b8; text-align:center;"> 
                        © 2026 TurtleGuide. Tous droits réservés. 
                      </p> 
                    </td> 
                  </tr> 

                </table> 
              </td> 
            </tr> 
          </table> 
        </body> 
      </html> 
      `, 
    }); 

    return data; 
  } catch (error) { 
    console.error("Erreur d'envoi de l'email :", error); 
    throw new Error("Impossible d'envoyer l'email"); 
  } 
} 
