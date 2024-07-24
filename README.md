eCommerce Application
=====================

This is a full-stack eCommerce application built with Angular for the frontend and Spring Boot for the backend.

Table of Contents
-----------------

1.  [Introduction](#introduction)
    
2.  [Technologies Used](#technologies-used)
    
3.  [Features](#features)
    
4.  [Getting Started](#getting-started)
    
5.  [Installation](#installation)
    
6.  [Usage](#usage)
    
7.  [API Documentation](#api-documentation)
    
8.  [Development](#development)
    
9.  [Production](#production)
    
10.  [Contributing](#contributing)
    
11.  [License](#license)
    

Introduction
------------

The eCommerce application is designed to provide a platform for buying and selling products online. It consists of a frontend developed using Angular, which communicates with a backend RESTful API built with Spring Boot. The application allows users to browse products, add them to their cart, place orders, and manage their accounts.

Technologies Used
-----------------

*   **Frontend:**
    
    *   Angular
        
    *   TypeScript
        
    *   HTML/CSS
        
*   **Backend:**
    
    *   Spring Boot
        
    *   Java
        
    *   Spring Data JPA
        
    *   Spring Security
        
    *   Hibernate
        
*   **Database:**
    
    *   MySQL (or any other database supported by Spring Data JPA)
        
*   **Other Tools:**
    
    *   Maven (for backend dependency management)
        
    *   Node.js and npm (for frontend package management)
        
    *   Angular CLI
        
    *   IDEs: IntelliJ IDEA (for backend), Visual Studio Code (for frontend)
        

Features
--------

*   User authentication and authorization
    
*   Product catalog browsing
    
*   Shopping cart management
    
*   Order placement and tracking
    
*   User account management (managed externally byt Auth0)

*   Payment with Credit Card using Stripe
    
*   Admin dashboard for managing products, orders, and users (TO-DO)
    

Getting Started
---------------

To get a local copy of the project up and running, follow these steps:

Installation
------------

### Prerequisites

*   Node.js and npm installed globally
    
*   Java Development Kit (JDK) installed
    
*   MySQL database server
    

### Backend Setup

1.  bashCopy codegit clone https://github.com/your-username/ecommerce-app.git cd ecommerce-app/api
    
2.  Configure the database:
    
    *   Create a MySQL database named ecommerce\_db.
        
    *   Update the database credentials in application.properties.
        
3.  bashCopy codemvn spring-boot:run
    

### Frontend Setup

1.  bashCopy codecd ../ui
    
2.  bashCopy codenpm install
    
3.  bashCopy codenpm start
    
4.  Open your browser and visit https://localhost:4200 to view the application.
    

Usage
-----

*   **User:** Register an account, browse products, add items to cart, place orders.
    
*   **Admin:** Manage products, view orders, manage users. (TO-DO)
    

API Documentation
-----------------

*   The backend API endpoints are documented using Swagger UI.
    
*   Access the documentation at https://localhost:8443/swagger-ui.html after starting the backend server.
    

Development
-----------

*   Follow Angular and Spring Boot best practices.
    
*   Use Git branches for feature development and pull requests for code review.
    

Production
----------

*   Deploy the frontend and backend separately.
    
*   Configure environment-specific properties for production deployments.
    

Contributing
------------

Contributions are welcome! Fork the repository and submit a pull request for any enhancements.

License
-------

This project is licensed under the MIT License - see the LICENSE file for details.
