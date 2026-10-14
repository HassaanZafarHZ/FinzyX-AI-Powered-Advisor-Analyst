
import os
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_password_reset_email(to_email: str, reset_code: str) -> bool:
    """Send a password reset email using Gmail SMTP."""

    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT", "587")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    from_email = os.getenv("FROM_EMAIL", "noreply@finzyx.com")

    if not smtp_server or not smtp_user or not smtp_pass:
        print("Password reset email configuration is missing.")
        return False

    subject = "FinzyX Password Reset Code"
    body = f"""
Hello,

You requested a password reset for your FinzyX account.
Your 6-digit verification code is: {reset_code}

This code will expire in 1 minute.

If you did not request this, please ignore this email.

Thanks,
The FinzyX Team
"""

    try:
        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(
            smtp_server,
            int(smtp_port),
            timeout=10,
        ) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)

        return True

    except Exception as e:
        print(f"Failed to send password reset email: {e}")
        return False


def send_onboarding_email(to_email: str, name: str) -> bool:
    """Send a welcome email using Gmail SMTP."""

    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT", "587")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    from_email = os.getenv("FROM_EMAIL", "noreply@finzyx.com")

    if not smtp_server or not smtp_user or not smtp_pass:
        print("Welcome email configuration is missing.")
        return False

    subject = "Welcome to FinzyX!"
    body = f"""
Hello {name},

Welcome to FinzyX! We're thrilled to have you onboard.

Your account has been successfully created. You can now access
your personalized AI investment roadmap, stock screener, and
portfolio tracker.

Our AI Rahbar is here to help you navigate the Pakistan
Stock Exchange.

Happy Investing!
The FinzyX Team
"""

    try:
        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(
            smtp_server,
            int(smtp_port),
            timeout=10,
        ) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)

        return True

    except Exception as e:
        print(f"Failed to send onboarding email: {e}")
        return False


def send_signup_verification_email(
    to_email: str,
    code: str,
) -> bool:
    """Send signup verification email through Google Apps Script."""

    email_script_url = os.getenv("EMAIL_SCRIPT_URL")
    email_api_secret = os.getenv("EMAIL_API_SECRET")

    if not email_script_url or not email_api_secret:
        print("Signup email service configuration is missing.")
        return False

    subject = "FinzyX - Verify Your Email"
    body = f"""
Welcome to FinzyX!

Please use this 6-digit verification code to complete signup:

{code}

If you did not attempt to sign up for FinzyX,
please ignore this email.
"""

    try:
        response = requests.post(
            email_script_url,
            json={
                "token": email_api_secret,
                "to": to_email,
                "subject": subject,
                "body": body,
            },
            timeout=30,
        )

        response.raise_for_status()
        result = response.json()

        if result.get("success") is True:
            print("Signup verification email request accepted.")
            return True

        print("Email service did not confirm the request.")
        return False

    except requests.RequestException as e:
        print(f"Failed to send verification email: {e}")
        return False

    except ValueError as e:
        print(f"Invalid email service response: {e}")
        return False
