# eCommerce App

This repository contains the source code for an eCommerce application built with Angular on the front-end and Spring on the back-end.

## Front-end (Angular)

The front-end folder (`frontend/`) contains the Angular application for the eCommerce app.

### Setup

To run the Angular app locally, follow these steps:

1. Navigate to the `frontend/` directory.
2. Install dependencies:
   `````````
   npm install
   `````````

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Back-end (Spring)

The back-end folder (`backend/`) contains the Spring Boot application for the eCommerce app.

### Setup

To run the Spring Boot app locally, follow these steps:

1. Navigate to the `backend/` directory.
2. Build the project:
   `````````
   ./mvnw clean install
   `````````

### Run the application

Run the Spring Boot application using the following command:
   `````````
   ./mvnw spring-boot:run
   `````````

The back-end server will start at `http://localhost:8080/`.

## Additional Notes

- Make sure to configure the front-end to communicate with the back-end appropriately, typically through HTTP requests.
- Customize and extend the application based on your eCommerce requirements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
