from flask_sqlalchemy import SQLAlchemy
from bcrypt import hashpw, checkpw, gensalt

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column("name", db.String, nullable=False, unique=True)
    __hash_password = db.Column("hash_password", db.String, nullable=False)

    @property
    def password(self):
        return self.__hash_password

    @password.setter
    def password(self, value: str):
        salt = gensalt()

        self.__hash_password = hashpw(value.encode("utf-8"), salt)

    def verify_password(self, password: str):
        return checkpw(password.encode("utf-8"), self.__hash_password)

    def __repr__(self) -> str:
        return "<User %r>" % self.name