from sqlalchemy import TIMESTAMP, Boolean, Column, ForeignKey, Integer, String, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    link = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    profile_pic = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False
    )


class Startup(Base):
    __tablename__ = "Startups"

    id = Column(Integer, primary_key=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    mission_statement = Column(String, nullable=True)
    offering = Column(String, nullable=True)
    description = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False
    )


class Founder(Base):
    __tablename__ = "Founders"

    startup_id = Column(
        Integer,
        ForeignKey("Startup.id", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    )
    user_id = Column(
        Integer,
        ForeignKey("User.id", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    )

    startup = relationship("Startups")
    user = relationship("Users")


class Mentor(Base):
    __tablename__ = "Mentors"

    user_id = Column(
        Integer,
        ForeignKey("User.id", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    )
    expertise = Column(String, nullable=True)
    availablity = Column(Boolean, nullable=False)

    user = relationship("Users")


class Follow(Base):
    __tablename__ = "Follows"

    following_user_id = Column(
        Integer,
        ForeignKey("User.id", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    )
    follower_user_id = Column(
        Integer,
        ForeignKey("User.id", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    )

    following = relationship("Users")
    follower = relationship("Startups")


class Mentorship(Base):
    __tablename__ = "Mentorships"

    mentor_id = Column(
        Integer, ForeignKey("Mentor.user_id", ondelete="CASCADE"), nullable=False
    )
    mentee_id = Column(
        Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False
    )

    mentor = relationship("Mentor")
    mentee = relationship("Users")


class Blog(Base):
    __tablename__ = "Blogs"

    id = Column(Integer, primary_key=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    author_id = Column(
        Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False
    )
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False
    )

    author = relationship("Users")
