# University Timetable API Setup Guide

### This readme.md file contains all the instructions to run this api

This documentation provides comprehensive information about the University Timetable API, which is designed to manage class schedules and related data for students, faculty, and administrative staff. The API offers endpoints for various functionalities, including user authentication, course management, timetable scheduling, room and resource booking, student enrollment, notifications, and alerts. It adheres to REST API design principles and emphasizes security, data integrity, and user-friendly interfaces.

With this documentation, developers can understand the available endpoints, their functionalities, request and response formats, and authentication requirements, enabling them to integrate the API effectively into their applications.

This api will contain endpoints for

- User Authentication
- Course Management
- Class Session Management
- Timetable Management
- Room and Resource Booking
- Student Enrollment
- Notification & Alert Management Management
- Student Actions (See enrolled courses, See their faculty time tables)

#### Created By: IT2118930

## CONTENT

- ### API Documentation Link
- ### Setup & Installation
- ### Running Unit and Integration Tests
- ### Starting server and running the API

## 1.API Documentation Link

API Documentation can be found on this link [University Timetable API Documentation]([https://documenter.getpostman.com/view/25158331/2sA35BbQ7h](https://.postman.co/workspace/My-Workspace~e89fc5b6-3be4-42ce-8f47-1b64ba6d4d90/collection/25158331-0c70d0cc-34e3-41f6-8362-773f0075b1ff?action=share&creator=25158331)).


## 2.Setup & Installation

- #### step 1 -> Clone the repository.
- #### step 2 -> Open the terminal and navigate to the "backend" directory
- #### step 3 -> In the terminal type "npm i". This will install all the packages need to run the API.

## 3.Running Unit and Integration Tests

- #### step 1 -> Testings should be run before start the server. So make sure that server is not running before start testing. Else it will cause an error saying that instance is running on port:4000
- #### step 2 -> Use the same cluster I included in the .env file. Because it contains some data that required to integration and unit testing. Else testing will fail.
- #### step 3 -> Open the terminal and navigate to the "backend" directory
- #### step 4 -> Then type `npm run test`. This will start the testing process. It may take 1-2 minutes.
- #### step 5 -> After running the tests you may see test results in console. It should indicate

| Test Results |
| ---------------------------------
| Test Suites: 5 passed, 5 total |
| Tests: 30 passed, 30 total |
| Snapshots: 0 total |
| Time: 60.135 s |
| Ran all test suites. |

- #### step 6 -> then press `ctrl+c` then close the terminal window.

## 4.Starting server and running the API

- #### step 1 -> Open new terminal window.Navigate to the backend directory.
- #### step 2 -> Type `npm run dev` to start server.
- #### step 3 -> Use the same database which used in .env it has some already added data.
- #### step 4 -> Use postman to test the endpoints which can be found inside the API documentation.

#### To register new faculty, student or admin accounts. you need to first log as an admin then use that access key to access those endpoints. These are credentials for an admin account

#### email: johndoe@gmail.com

#### password: john123
