from config import settings
import requests

SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send"

def send_email(to_email: str, subject: str, content: str):
    """
    Simple SendGrid email sender function.
    """
    if not settings.sendgrid_api_key or not settings.email_from:
        # i'm using the print version only in local/dev environments
        print(f"[DEV EMAIL] To: {to_email} | Subject: {subject} | Content: {content}")
        return
    data = {
        "personalizations": [{"to": [{"email": to_email}]}],
        "from": {"email": settings.email_from},
        "subject": subject,
        "content": [{"type": "text/plain", "value": content}],
    }
    
    # Send the email via SendGrid API
    headers = {
        "Authorization": f"Bearer {settings.sendgrid_api_key}",
        "Content-Type": "application/json",
    }
    response = requests.post(SENDGRID_API_URL, json=data, headers=headers)
    if response.status_code >= 400:
        print(f"Email failed to send: {response.status_code} - {response.text}")
    else:
        print(f"Email sent successfully to {to_email}! Status: {response.status_code}")