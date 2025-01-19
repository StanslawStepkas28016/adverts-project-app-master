-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2025-01-04 23:43:19.922

-- tables
-- Table: Advert
CREATE TABLE Advert
(
    IdAdvert    int IDENTITY (1,1) NOT NULL,
    Description varchar(500)       NOT NULL,
    WaitTime    int                NOT NULL,
    Price       money              NOT NULL,
    IdType      int                NOT NULL,
    CONSTRAINT Advert_pk PRIMARY KEY (IdAdvert)
);

-- Table: Role
CREATE TABLE Role
(
    IdRole int        NOT NULL,
    Name   varchar(5) NOT NULL,
    CONSTRAINT Role_pk PRIMARY KEY (IdRole)
);

-- Table: Skill
CREATE TABLE Skill
(
    IdSkill int         NOT NULL,
    Name    varchar(50) NOT NULL,
    CONSTRAINT Skill_pk PRIMARY KEY (IdSkill)
);

-- Table: Status
CREATE TABLE Status
(
    IdStatus int        NOT NULL,
    Name     varchar(8) NOT NULL,
    CONSTRAINT Status_pk PRIMARY KEY (IdStatus)
);

-- Table: Type
CREATE TABLE Type
(
    IdType int         NOT NULL,
    Name   varchar(30) NOT NULL,
    CONSTRAINT Type_pk PRIMARY KEY (IdType)
);

-- Table: User
CREATE TABLE "User"
(
    IdUser       int IDENTITY (1,1) NOT NULL,
    FirstName    varchar(50)        NOT NULL,
    LastName     varchar(50)        NOT NULL,
    PhoneNumber  char(9)            NOT NULL,
    Login        varchar(50)        NOT NULL,
    Password     varchar(150)       NOT NULL,
    IdRole       int                NOT NULL,
    CONSTRAINT User_pk PRIMARY KEY (IdUser)
);

-- Table: UserAdvert
CREATE TABLE UserAdvert
(
    IdUser   int NOT NULL,
    IdAdvert int NOT NULL,
    IdStatus int NOT NULL,
    CONSTRAINT UserAdvert_pk PRIMARY KEY (IdUser, IdAdvert)
);

-- Table: UserSkill
CREATE TABLE UserSkill
(
    IdUser  int NOT NULL,
    IdSkill int NOT NULL,
    CONSTRAINT UserSkill_pk PRIMARY KEY (IdUser, IdSkill)
);

-- foreign keys
-- Reference: Advert_AdvertType (table: Advert)
ALTER TABLE Advert
    ADD CONSTRAINT Advert_AdvertType
        FOREIGN KEY (IdType)
            REFERENCES Type (IdType);

-- Reference: UserAdvert_Advert (table: UserAdvert)
ALTER TABLE UserAdvert
    ADD CONSTRAINT UserAdvert_Advert
        FOREIGN KEY (IdAdvert)
            REFERENCES Advert (IdAdvert);

-- Reference: UserAdvert_Status (table: UserAdvert)
ALTER TABLE UserAdvert
    ADD CONSTRAINT UserAdvert_Status
        FOREIGN KEY (IdStatus)
            REFERENCES Status (IdStatus);

-- Reference: UserAdvert_User (table: UserAdvert)
ALTER TABLE UserAdvert
    ADD CONSTRAINT UserAdvert_User
        FOREIGN KEY (IdUser)
            REFERENCES "User" (IdUser);

-- Reference: UserSkill_Skill (table: UserSkill)
ALTER TABLE UserSkill
    ADD CONSTRAINT UserSkill_Skill
        FOREIGN KEY (IdSkill)
            REFERENCES Skill (IdSkill);

-- Reference: UserSkill_User (table: UserSkill)
ALTER TABLE UserSkill
    ADD CONSTRAINT UserSkill_User
        FOREIGN KEY (IdUser)
            REFERENCES "User" (IdUser);

-- Reference: User_Role (table: User)
ALTER TABLE "User"
    ADD CONSTRAINT User_Role
        FOREIGN KEY (IdRole)
            REFERENCES Role (IdRole);

-- End of file.