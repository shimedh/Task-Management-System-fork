-- Create Users table
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(255),
    hashedpassword VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(100),
	profilePicUrl VARCHAR(255)
);
-- Drop table Users

----------------------------------------------------------------------------
-- Create Tasks table
CREATE TABLE Tasks (
    task_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(MAX),
    created_at DATE,
    due_date DATE,
    priority VARCHAR(50),
    status VARCHAR(50),
    assigned_to INT,
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id) ON DELETE CASCADE
);
--drop table Tasks
-------------------------------------------------------------------------------------------------------------------------
-- Create Comments table

CREATE TABLE Comments (
    comment_id INT IDENTITY(1,1) PRIMARY KEY,
    task_id INT,
    user_id INT,
    timestamp DATE,
    content VARCHAR(MAX),
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) 
);
--drop table Comments
---------------------------------------------------------------------------------------------------------------------------
-- Create Notifications table

CREATE TABLE Notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    timestamp DATE,
    content VARCHAR(MAX),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
--drop table Notifications
---------------------------------------------------------------------------------------------------------------------------

				--INSERTING DATA	 
	 INSERT INTO Users (username, hashedpassword, email, role,profilePicUrl) 
	 VALUES ('kibet', '1234', 'kibet@gmail.com', 'teammate', 'https://taskminderimagestore.blob.core.windows.net/imagestore/1689622966897-IMG-20201224-WA0005.jpg' )
	--------------------------------------------------------------
-- Insert data into Tasks table
INSERT INTO Tasks (title, description, created_at, due_date, priority, status, assigned_to)
VALUES ('MERN', 'use mongodb', '2023-07-01', '2023-07-30', 'medium', 'in progress', 1),
       ('SERN', 'use sql server', '2023-07-02', '2023-07-25', 'high', 'in progress', 2),
       ('API', 'use rest api', '2023-07-03', '2023-08-12', 'low', 'completed', 3);
	   --------------------------------------------------------------------
-- Insert data into Comments table   [NOT INSERTED DATA]
INSERT INTO Comments (task_id, user_id, timestamp, content)
VALUES (1, 2, '2023-07-05 10:15:00', 'good job'),
       (1, 3, '2023-07-06 09:30:00', 'do a correction'),
       (1, 1, '2023-07-07 14:45:00', 'amaizing');

-- Insert data into Notifications table  [NOT INSERTED DATA]
INSERT INTO Notifications (user_id, timestamp, content)
VALUES (1, '2023-07-05 12:30:00', 'deadline is close'),
       (2, '2023-07-06 15:00:00', 'you have new task'),
       (3, '2023-07-07 16:45:00', 'your task has been viewed');

		----------------------------------------------------------------------

	   --stored procedure
	   CREATE PROCEDURE GetCommentDetails
    @taskID INT
AS
BEGIN
    SELECT 
        C.comment_id,
        C.task_id,
        C.user_id,
        U.username,
        C.timestamp,
        C.content,
        T.title
    FROM 
        Comments C
    INNER JOIN 
        Users U ON C.user_id = U.user_id
    INNER JOIN 
        Tasks T ON C.task_id = T.task_id
    WHERE 
        C.task_id = @taskID;
END;


EXEC GetCommentDetails @taskID = 2;
		-------------------------------------------------------------------------------------------------------------

				--GetUserNotifications

CREATE PROCEDURE GetUserNotifications
    @userID INT
AS
BEGIN
    SELECT
        N.notification_id,
        N.user_id,
        N.timestamp,
        N.content,
        U.username
    FROM
        Notifications N
    INNER JOIN
        Users U ON N.user_id = U.user_id
    WHERE
        N.user_id = @userID;
END;

EXEC GetUserNotifications @userID = 2;


			-----------------------------------------------------------------------------------------------------------


					--GET TASK DETAILS

CREATE PROCEDURE GetTaskDetails
AS
BEGIN
    SELECT 
        T.task_id,
        T.title,
        T.description,
        T.created_at,
        T.due_date,
        T.priority,
        T.status,
        U.username,
        U.email,
        U.role
    FROM 
        Tasks T
    INNER JOIN 
        Users U ON T.assigned_to = U.user_id;
END;

--execute
EXEC GetTaskDetails;

		------------------------------------------------------------------------------------------------

CREATE PROCEDURE GetSingleTaskDetails
    @taskID INT
AS
BEGIN
    SELECT 
        T.task_id,
        T.title,
        T.description,
        T.created_at,
        T.due_date,
        T.priority,
        T.status,
        U.username,
        U.email,
        U.role
    FROM 
        Tasks T
    INNER JOIN 
        Users U ON T.assigned_to = U.user_id
    WHERE 
        T.task_id = @taskID;
END;


EXEC GetSingleTaskDetails @taskID = 61;

					-----------------------------------------------------------------------------------------------------


															 --QUERIES

	 --  Retrieve all users:
SELECT * FROM Users;
 -- Retrieve all tasks:

SELECT * FROM Tasks;

-- Retrieve all comments:

SELECT * FROM Comments;

	--Retrieve all notifications:
SELECT * FROM Notifications;
	--Retrieve tasks assigned to a specific user:

SELECT * FROM Tasks WHERE assigned_to = 2;
	--Retrieve comments for a specific task (e.g., task_id = 1):

SELECT * FROM Comments WHERE task_id = 1;
	--Retrieve notifications for a specific user (e.g., user_id = 1):

SELECT * FROM Notifications WHERE user_id = 1;

						------------------------------------------------------------------------------------------
Update users set profilePicUrl = 'url' where user_id=19
--Update the status of a task:

UPDATE Tasks SET status = 'completed' WHERE task_id = 2;
--Delete a specific comment :

DELETE FROM Comments WHERE comment_id = 3;
--Delete all notifications for a specific user:

DELETE FROM Notifications WHERE user_id = 2;


EXEC GetSingleTaskDetails @taskID = 61

	------------------------------------------------------------------------------------------