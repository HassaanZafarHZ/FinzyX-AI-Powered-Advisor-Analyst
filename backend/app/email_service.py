import os

def send_password_reset_email(to_email: str, reset_code: str):
    """
    Sends a password reset email.
    If SMTP_SERVER is configured in .env, it uses smtplib.
    Otherwise, it acts as a mock and prints the code to the terminal for easy development.
    """
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT", 587)
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    from_email = os.getenv("FROM_EMAIL", "noreply@finzyx.com")

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

    if not smtp_server or not smtp_user or not smtp_pass:
        # Mock mode
        print("\n" + "="*50)
        print("📧 MOCK EMAIL DISPATCHED (No SMTP Configured)")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        print("="*50 + "\n")
        return True

    # Real SMTP mode
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, int(smtp_port), timeout=10)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_onboarding_email(to_email: str, name: str):
    """
    Sends a welcome/onboarding email when a user successfully creates an account.
    """
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT", 587)
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    from_email = os.getenv("FROM_EMAIL", "noreply@finzyx.com")

    subject = "Welcome to FinzyX!"
    body = f"""
    Hello {name},
    
    Welcome to FinzyX! We're thrilled to have you onboard.
    
    Your account has been successfully created. You can now access your personalized AI investment roadmap, stock screener, and portfolio tracker.
    
    If you have any questions, our AI Rahbar is always here to help you navigate the Pakistan Stock Exchange.
    
    Happy Investing!
    The FinzyX Team
    """

    if not smtp_server or not smtp_user or not smtp_pass:
        print("\n" + "="*50)
        print("📧 MOCK WELCOME EMAIL DISPATCHED")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        print("="*50 + "\n")
        return True

    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, int(smtp_port), timeout=10)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send onboarding email: {e}")
        return False

def send_signup_verification_email(to_email: str, code: str):
    """
    Sends a 6-digit OTP code to verify the user's email during signup.
    """
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT", 587)
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    from_email = os.getenv("FROM_EMAIL", "noreply@finzyx.com")

    subject = "FinzyX - Verify Your Email"
    body = f"""
    Welcome to FinzyX!
    
    Please use the following 6-digit verification code to complete your signup:
    {code}
    
    If you did not attempt to sign up for FinzyX, please ignore this email.
    """

    if not smtp_server or not smtp_user or not smtp_pass:
        print("\n" + "="*50)
        print("📧 MOCK SIGNUP VERIFICATION EMAIL DISPATCHED")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        print("="*50 + "\n")
        return True

    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, int(smtp_port), timeout=10)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send verification email: {e}")
        return False
