-- CREATE DATABASE Clockify
USE Clockify

---create  user table 
CREATE TABLE tbl_user(
    user_id VARCHAR(300) PRIMARY KEY,
    firstname VARCHAR(MAX)  DEFAULT 'no firstname',
    middlename VARCHAR (MAX) DEFAULT 'no middlename',
    lastname VARCHAR (MAX) DEFAULT 'no lastname',
    identification_number VARCHAR(300)  UNIQUE,
    gender VARCHAR(MAX) DEFAULT 'no gender',
    marital_status VARCHAR(MAX) DEFAULT 'not applicable',
    date_of_birth DATETIME DEFAULT 0,
    email VARCHAR (300)   UNIQUE,
    phone_number INT DEFAULT 0,
    place_of_residence VARCHAR(MAX) DEFAULT 'no residence',
    course_of_study VARCHAR(MAX) DEFAULT 'not applicable',
    institution VARCHAR (MAX) DEFAULT 'not applicable',
    graduation_date DATETIME DEFAULT 0,
    employed_on DATETIME DEFAULT 0,
    role VARCHAR (MAX) DEFAULT 'user',
    password VARCHAR(MAX) DEFAULT 'no password',
    isWelcomed INT DEFAULT 0,
    isPasswordChange INT DEFAULT 0,
    isDeleted INT DEFAULT 0,
    position_id VARCHAR(300) FOREIGN KEY REFERENCES position (position_id),
    schedule_id  VARCHAR(300) FOREIGN KEY REFERENCES schedule(schedule_id)


)

SELECT * FROM tbl_user
---create posititons table 
CREATE TABLE position(
    position_id VARCHAR(300) PRIMARY KEY,
    position_description VARCHAR(MAX) DEFAULT 'no position',
    gross_salary INT  DEFAULT 0,


)

---create schedules table 

CREATE TABLE schedule(
    schedule_id VARCHAR(300) PRIMARY KEY,
    in_time TIME ,
    out_time TIME ,
     created_at DATETIME DEFAULT GETDATE()
    
)


CREATE TABLE employee_schedule(
     id VARCHAR(300) PRIMARY KEY,
     schedule_id VARCHAR(300) FOREIGN KEY REFERENCES schedule(schedule_id),
     user_id  VARCHAR(300)  FOREIGN KEY REFERENCES tbl_user(user_id)
)

 
---create employee skills table
CREATE TABLE employee_skill(
    id VARCHAR(300) PRIMARY KEY,
    language VARCHAR(MAX) DEFAULT 'no language',
    technical VARCHAR (MAX) DEFAULT 'no technicl skill',
    user_id VARCHAR(300)  FOREIGN KEY REFERENCES tbl_user (user_id)

)


---create photo table
CREATE TABLE photo(
    photo_id VARCHAR(300) PRIMARY KEY,
    photo_url VARCHAR(MAX)  DEFAULT 'no url',
    uploaded_on DATETIME  DEFAULT GETDATE(),
    user_id VARCHAR(300)  FOREIGN KEY REFERENCES tbl_user(user_id)

)


----create emergency contact table 
CREATE TABLE emergency_contact(
    id VARCHAR(300) PRIMARY KEY,
    person_name VARCHAR(MAX) DEFAULT 'no name',
    phone_number INT DEFAULT 'no number',
    relationship VARCHAR(MAX) DEFAULT 'no relationship',
    user_id  VARCHAR(300)  FOREIGN KEY REFERENCES tbl_user (user_id)
)
---------deductions table
CREATE TABLE deductions(
deduction_id VARCHAR(300) PRIMARY KEY,
description VARCHAR(300),
amount DECIMAL(10,2),
user_id VARCHAR(300) FOREIGN KEY REFERENCES tbl_user (user_id),
created_on DATETIME DEFAULT GETDATE()
)

---create cash advances table 
CREATE TABLE cash_advances(
    cash_advance_id  VARCHAR (300) PRIMARY KEY,
    user_id VARCHAR(300) FOREIGN KEY REFERENCES tbl_user (user_id),
    number_of_hours INT DEFAULT 0,
    created_on DATETIME DEFAULT GETDATE()
)


-----create overtime table
CREATE TABLE overtime (
    overtime_id VARCHAR(300) PRIMARY KEY,
    number_of_hours INT DEFAULT 0,
    rate_per_hours  DECIMAL (10,2) DEFAULT 0,
    created_on DATETIME DEFAULT GETDATE(),
    user_id VARCHAR (300)  FOREIGN KEY REFERENCES tbl_user (user_id)
)

------create payroll table 
CREATE TABLE payroll(
payroll_id VARCHAR(300) PRIMARY KEY ,
total_deductions DECIMAL(10,2) DEFAULT 0,
gross_salary DECIMAL(10,2) DEFAULT 0,
total_overtime DECIMAL (10,2) DEFAULT 0,
total_cash_advances DECIMAL(10,2) DEFAULT 0,
net_pay DECIMAL(10,2) DEFAULT 0,
user_id VARCHAR(300) FOREIGN KEY REFERENCES tbl_user(user_id),
created_on DATETIME DEFAULT GETDATE()
)

-----create table attendance
CREATE  TABLE attendance(
attendance_id VARCHAR (300) PRIMARY KEY,
date DATETIME DEFAULT GETDATE(),
time_in DATETIME,
time_out DATETIME,
reporting_state VARCHAR (300),
user_id VARCHAR(300) FOREIGN KEY REFERENCES tbl_user(user_id)

);

ALTER TABLE attendance
ADD CONSTRAINT unique_employee_date UNIQUE (user_id, date);
------create photo table 
CREATE TABLE photo(
    photo_id VARCHAR(300) PRIMARY KEY,
    photo_url VARCHAR(300) DEFAULT 'no photo' ,
    created_on DATETIME DEFAULT GETDATE(),
    user_id VARCHAR(300)  FOREIGN KEY REFERENCES tbl_user(user_id)
)