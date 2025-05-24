import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv



app = Flask(__name__)
db = SQLAlchemy()
load_dotenv()


# Configuration class for Flask app
class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "SQLALCHEMY_DATABASE_URI"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS =os.environ.get(
        "SQLALCHEMY_TRACK_MODIFICATIONS")
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)

    # ✅ Email Configuration (Gmail SMTP )
    app.config['MAIL_SERVER']=os.environ.get("MAIL_SERVER")
    app.config['MAIL_PORT'] = os.environ.get("MAIL_PORT")
    app.config['MAIL_USERNAME'] = os.environ.get("MAIL_USERNAME")  # ✅ Gmail address
    app.config['MAIL_PASSWORD'] = os.environ.get("MAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("MAIL_DEFAULT_SENDER")
    app.config['MAIL_USE_TLS'] = os.environ.get("MAIL_USE_TLS")
    app.config['MAIL_USE_SSL'] = os.environ.get("MAIL_USE_SSL")
    app.config["MAIL_DEBUG"] = os.environ.get("MAIL_DEBUG")
   

def send_email(to_email, subject, body):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = os.environ.get("MAIL_DEFAULT_SENDER")
    msg['To'] = to_email
    msg.set_content(body)

           
    try:
     with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(os.environ.get("MAIL_USERNAME"), os.environ.get("MAIL_PASSWORD"))
        smtp.send_message(msg)
        print("✅ Email sent successfully to", to_email)
    except Exception as e:
     print("❌ Failed to send email:", e)

app.config.from_object(Config)



# ✅ Initialize JWT
jwt = JWTManager(app)

# ✅ Initialize the database with the app
db.init_app(app)
