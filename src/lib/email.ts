import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetOTP(email: string, otp: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: "borisweteneyi1@gmail.com",
    subject: "Votre code de réinitialisation - TurtleGuide",
    html: `
      <div style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
        font-family: Arial, sans-serif;
        color: #1e293b;
      ">
        <h1 style="margin-bottom: 10px;">
          Réinitialisation de votre mot de passe
        </h1>

        <p>
          Vous avez demandé à réinitialiser votre mot de passe TurtleGuide.
        </p>

        <p>
          Voici votre code de vérification :
        </p>

        <div style="
          margin: 30px 0;
          padding: 20px;
          background: #f0fdf4;
          border-radius: 12px;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #16a34a;
        ">
          ${otp}
        </div>

        <p>
          Ce code est valable pendant <strong>5 minutes</strong>.
        </p>

        <p style="color: #64748b; font-size: 14px;">
          Si vous n'êtes pas à l'origine de cette demande,
          vous pouvez ignorer cet email.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />

        <p style="color: #94a3b8; font-size: 12px;">
          © 2026 TurtleGuide. Tous droits réservés.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Erreur d'envoi de l'email :", error);
    throw new Error("Impossible d'envoyer l'email");
  }

  return data;
}
