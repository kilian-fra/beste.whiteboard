## Overview of Requirements

This document provides a high-level overview of the functional requirements for the system. These requirements have been identified 
based on the driving forces and motivation behind the development or modification of the system. The following table summarizes the 
main requirements:

|Requirement ID | Description|
|---------------|------------|
|FR1 | The system shall provide a user-friendly interface for end users.|
|FR2	| The system shall be scalable and able to handle increasing amounts of data and users.|
|FR3	| The system shall be able to integrate with other systems and tools.|
|FR4	| The system shall be secure and protect the data of the users.|
|FR5	| The system shall be reliable and available to users at all times.|
|FR6	| The system shall provide real-time collaboration capabilities.|
|FR7	| The system shall provide reporting and analytics capabilities.|
|FR8	| The system shall support multiple languages.|

These requirements have been extracted from more detailed requirements documents, which can be found at 
[Online Whiteboard Anforderungen](../OnlineWhiteboardAnforderungen.pdf "")

## Quality Goals

Priority | Quality Goal | Scenarios
---------|--------------|----------
1	| Security	|- Confidentiality: Sensitive user data should not be accessible to unauthorized parties.<br>- Integrity: Data should not be tampered with or modified without authorization.<br>- Availability: The system should be available and accessible for authorized users.<br>- Authentication and Authorization: Only authorized users should be able to access the system and perform actions according to their roles and permissions.
2	| Performance	|- Responsiveness: The system should respond to user actions quickly and provide timely feedback.<br>- Scalability: The system should be able to handle increasing amounts of data and users without sacrificing performance.<br>- Resource utilization: The system should use resources efficiently and not waste system resources such as memory, CPU, or network bandwidth.<br>- Stability: The system should be stable and perform reliably without unexpected crashes or downtime.
3	| Usability	|- Ease of use: The system should be easy to use for both novice and experienced users.<br>- Consistency: The system should be consistent in its design and behavior, to reduce the learning curve for users.<br>- Accessibility: The system should be accessible to users with disabilities, following relevant accessibility standards.<br>- User feedback: The system should provide clear and timely feedback to users, informing them about the status of their actions and any errors or issues that arise.

## Stakeholders

Role/Name | Contact	| Expectations
----------|---------|-------------
Product Owner | Milena Zachow | Needs to approve architecture decisions and ensure they align with business goals
Development Team | Nis Berger, Paul Kuhnt, Kilian Franke, Christian Renè Duus, Marcel Baer, Nico Dölger | Need clear and concise documentation of architecture and code to develop and maintain the system
Scrum Master | tba | Ensure architecture supports Agile development process
Operations Team	| N/A | Needs to understand the architecture to deploy and maintain the system in production
QA Team| Nis Berger, Paul Kuhnt, Kilian Franke, Christian Renè Duus, Marcel Baer, Nico Dölger | Needs to understand the architecture to create comprehensive test plans
Business Stakeholders | Milena Zachow | eed to know how the architecture supports business processes and goals
External Consultants| Milena Zachow | Need to be convinced that the architecture is sound and meets industry best practices
Regulators | Milena Zachow | Need to ensure that the system complies with relevant regulations and standards

## Architecture constraints

Constraint | Explanation
-----------|------------
Platform | The system must be compatible with both Linux server and Windows 10 and 11 clients.
Real-time database | The system must be designed to use a real-time database for efficient data management.
Frontend framework | The frontend must be developed using Konva for efficient rendering and interactivity.
Data protection | The GDPR must be complied with
to be continued | ...

## System Scope and Context

### Communication partners:

##### The system communicates with the following partners:

    Clients running on Windows 10 and 11
    Linux server hosting the system
    Real-time database for storing and retrieving data
    Konva library for rendering the frontend interface

### Interfaces:

##### The system has the following interfaces:

    Graphical User Interface (GUI) for users to interact with the system
    Network interface for communication between clients and server
    Database interface for storing and retrieving data
    Konva interface for rendering the frontend interface

## Business Context

Communication Partner | Inputs | Outputs
----------------------|--------|--------
Users | Digitale Post-its, Drawings, text, images, chat messages | Saved whiteboard, export to other applications, feedback from other users
Administrators | User accounts, access rights | 	Configuration of the system, security
Moderators | Moderated content, session management | Collaborative work, content moderation

## Technical Context

System Name | Communication Partner | Channel | Input | Output
------------|-----------------------|---------|-------|-------
Online-Whiteboard | User's device | HTTPS | Mouse clicks, keyboard input | Visual updates (post-its, drawings, text, images)
Online-Whiteboard | User's device | WebSockets | Real-time collaboration updates | Real-time collaboration updates
Online-Whiteboard | User's device | Chat API | Text messages | Text messages
Online-Whiteboard | User's device | File storage API (e.g. Dropbox, Google Drive) | File upload/download | File upload/download
Online-Whiteboard | User's device | Integration API (e.g. Slack, Trello) | Integration requests and responses | Integration requests and responses
Online-Whiteboard | Authentication server | HTTPS | User login credentials | User authentication token
Online-Whiteboard | Authorization server | HTTPS | User authentication token, access rights | Access control decisions

## Quality requirements

### Quality Tree

No. | Quality Category | Quality | Description 
----|------------------|---------|------------
| 1. | Reliability | Availability | The system should have high Availability to ensure that the users can access it at any time. 
| 2. | Security | Encryption | The system should use SSL Encryption to protect the user data.
| 3. | | Authentication | The system should support user authentication
| 4. | | Authorization | The system should support usere authorization
| 5. | Usability | Operability | The user interface should be simple and intuitive for all users 
| 6. | | User interface aesthetics | Using the product must be possible on desktops as good as on mobile devices 

### Quality Scenarios
1) A user opens a link to a whiteboard he has access for. Loading the whiteboard several times shouldn't take longer as 2 seconds
2) A user sends data by using the whiteboard. A 'man in the middle' can't read those data.
3) **tbd**
4) A user is logging into his account. A user receives an authentication token.
5) A user who uses a whiteboard the first time, needs no explanation where tools are to find.
6) A user wants to add an element to his whiteboard while using the app on a desktop pc. Doing the same thing on a smartphone must be as easy as on a desktop.

[UI]: <> (User Interface can be measured through metrics like task completion time, error rate and user statisfaction)

[TOC]: <> (TCO -> Total cost of ownership)

[ROI]: <> (ROI -> return on investment)


## Glossary 

Term | Definition
-----|-----------

