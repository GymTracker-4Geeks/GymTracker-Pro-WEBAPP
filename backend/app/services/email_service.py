from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import current_app
from config import Config

class EmailService:

    @staticmethod
    def send_welcome_email(email, full_name):

        message = Mail(
            from_email="noreply@gymtrackerpro.com",
            to_emails=email,
            subject="Bienvenido a GymTracker Pro",
            html_content=f"""
            <h1>Bienvenido {full_name}</h1>
            <p>Tu cuenta ha sido creada correctamente.</p>
            """
        )

        sg = SendGridAPIClient(current_app.config.from_object(Config.SENDGRID_API_KEY))

        sg.send(message)
    
    @staticmethod
    def send_token_password_email(email, token):

        message = Mail(
            from_email="noreply@gymtrackerpro.com",
            to_emails=email,
            subject="Gym Tracker Password Reset",
            html_content=f"""
            <h1>Este es tu link para crear tu contraseña de nuevo!</h1>
            <p>{token}</p>
            """
        )