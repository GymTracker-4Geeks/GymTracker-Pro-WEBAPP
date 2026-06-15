from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import current_app

class EmailService:

    @staticmethod
    def _client():
        return SendGridAPIClient(
            current_app.config["SENDGRID_API_KEY"]
        )

    @staticmethod
    def send_welcome_email(email, full_name):

        sg = EmailService._client()

        message = Mail(
            from_email="evoradavid17@gmail.com",
            to_emails=email,
            subject="Bienvenido a GymTracker Pro",
            html_content=f"""
            <h1>Bienvenido {full_name}</h1>
            <p>Tu cuenta ha sido creada correctamente.</p>
            """
        )

        sg.send(message)
    
    @staticmethod
    def send_token_password_email(email, token):
        pass_reset_url = f"http://localhost:3000/reset-password?token={token}"

        sg = EmailService._client()

        message = Mail(
            from_email="evoradavid17@gmail.com",
            to_emails=email,
            subject="Gym Tracker Password Reset",
            html_content=f"""
            <h1>Este es tu link para crear tu contraseña de nuevo!</h1>
            <p>{pass_reset_url}</p>
            """
        )

        sg.send(message)