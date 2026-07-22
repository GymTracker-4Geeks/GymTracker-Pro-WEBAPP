import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import current_app

class EmailService:

    @staticmethod
    def _frontend():
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        return frontend_url

    @staticmethod
    def _client():
        return SendGridAPIClient(
            current_app.config["SENDGRID_API_KEY"]
        )
    
    @staticmethod
    def _email():
        EMAIL_SENDGRID = os.getenv("EMAIL_SENDGRID") 
        return EMAIL_SENDGRID

    @staticmethod
    def send_welcome_email(email, full_name):
        sg = EmailService._client()

        message = Mail(
            from_email=EmailService._email(),
            to_emails=email,
            subject="🎉 Welcome to GymTracker Pro",
            html_content=f"""
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #111827; color: #f9fafb; border-radius: 12px;">
                <h1 style="color: #ef4444; margin-bottom: 8px;">
                    Welcome to GymTracker Pro 💪
                </h1>

                <p style="font-size:16px;">
                    Hi <strong>{full_name}</strong>,
                </p>

                <p style="line-height:1.6;">
                    Your account has been successfully created and you're now ready to start tracking your workouts, monitor your progress and achieve your fitness goals.
                </p>

                <div style="margin:32px 0;">
                    <a
                        href="{EmailService._frontend()}"
                        style="
                            background:#ef4444;
                            color:#ffffff;
                            padding:14px 28px;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:bold;
                            display:inline-block;
                        "
                    >
                        Login to GymTracker Pro
                    </a>
                </div>

                <p style="color:#9ca3af;font-size:14px;">
                    Thank you for choosing GymTracker Pro.
                    We wish you great workouts! 🚀
                </p>

                <hr style="border:none;border-top:1px solid #374151;margin:32px 0;">

                <p style="font-size:12px;color:#6b7280;">
                    This email was sent automatically by GymTracker Pro.
                </p>
            </div>
            """
        )

        sg.send(message)
    
    @staticmethod
    def send_token_password_email(email, token):
        pass_reset_url = f"{EmailService._frontend()}/auth/reset-password?token={token}"

        sg = EmailService._client()

        message = Mail(
            from_email=EmailService._email(),
            to_emails=email,
            subject="🔒 Reset your GymTracker Pro password",
            html_content=f"""
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #111827; color: #f9fafb; border-radius: 12px;">

                <h1 style="color:#ef4444; margin-bottom:8px;">
                    Password Reset Request
                </h1>

                <p style="font-size:16px;">
                    We received a request to reset your GymTracker Pro password.
                </p>

                <p style="line-height:1.6;">
                    Click the button below to create a new password.
                </p>

                <div style="margin:32px 0;">
                    <a
                        href="{pass_reset_url}"
                        style="
                            background:#ef4444;
                            color:white;
                            padding:14px 28px;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:bold;
                            display:inline-block;
                        "
                    >
                        Reset Password
                    </a>
                </div>

                <p style="line-height:1.6;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>

                <p style="
                    word-break:break-all;
                    background:#1f2937;
                    padding:12px;
                    border-radius:8px;
                    color:#d1d5db;
                    font-size:14px;
                ">
                    {pass_reset_url}
                </p>

                <p style="margin-top:24px;color:#fca5a5;">
                    If you didn't request a password reset, you can safely ignore this email.
                </p>

                <hr style="border:none;border-top:1px solid #374151;margin:32px 0;">

                <p style="font-size:12px;color:#6b7280;">
                    This password reset link was generated automatically by GymTracker Pro.
                </p>

            </div>
            """
        )

        sg.send(message)