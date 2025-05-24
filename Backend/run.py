from flask import Flask
from models.Config import Config, db
# from models.Config import send_email
from flask_migrate import Migrate
from controllers.Categories_controllers import auth as categories_auth
from controllers.Product_controllers import auth as product_auth
from controllers.User_controllers import auth as user_auth
from controllers.ShoppingCard_controllers import auth as shoppingcard_auth
from controllers.Payment_controllers import auth as payment_auth
from controllers.Order_controllers import auth as order_auth
from controllers.RetrunControllers import auth as return_auth
from controllers.Email_controllers import auth as email_auth 
from flask_jwt_extended import JWTManager
from flask_cors import CORS
# from flask_migrate import Migrate
migrate = Migrate()  # Define globally
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
    
    JWTManager(app)
    # Initialize the database
    db.init_app(app)
    migrate = Migrate(app, db) # Initialize the migration engine
    
    
    # Register the blueprints
    app.register_blueprint(categories_auth, url_prefix='/categories')
    app.register_blueprint(product_auth, url_prefix='/product')
    app.register_blueprint(user_auth, url_prefix='/user')
    app.register_blueprint(shoppingcard_auth, url_prefix='/shoppingcard')
    app.register_blueprint(payment_auth, url_prefix='/payment')
    app.register_blueprint(order_auth, url_prefix='/order')
    app.register_blueprint(return_auth, url_prefix='/return')
    app.register_blueprint(email_auth, url_prefix='/email')

    # Create tables automatically
    with app.app_context():
    #  db.drop_all()
     db.create_all()  # Creates all tables that do not already exist



    return app

if __name__ == "__main__":
    try:
        app = create_app()
        app.run(host="0.0.0.0", port=5000, debug=True)
    except Exception as e:
        print(f"Failed to start application: {str(e)}")
        exit(1)
