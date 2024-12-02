
# GreenBallot: Blockchain-Powered Crowdfunding Platform for Environmental Projects 🌍

GreenBallot is an innovative platform designed to connect environmental activists with investors. Using blockchain technology, it ensures transparent voting, funding, and monitoring of green projects aimed at creating a sustainable future.

This project is built using **Spring Boot** for the backend and **Angular** for the frontend, delivering a seamless and secure user experience.

---

## 🌟 Features

- **Blockchain-Powered Voting**: Transparent voting system to decide which projects receive funding.
- **Environmental Project Submission**: Activists can submit projects with detailed descriptions, locations, and supporting media.
- **Interactive Maps**: Allows users to pick and view project locations using OpenLayers.
- **Dynamic City Search**: Search and filter cities for project locations with a PrimeNG dropdown.
- **Budget Allocation Tool**: Enables precise allocation of funding with real-time validation.
- **File Uploads**: Upload proposals, presentations, and other supporting documents securely.
- **Role-Based Access Control**: Ensures project management is secure and access is granted based on user roles.

---

## 🛠️ Technologies Used

### Backend:
- **Spring Boot**: RESTful API development.
- **Hibernate & JPA**: For database interactions.
- **JWT Authentication**: Secure and stateless authentication mechanism.

### Frontend:
- **Angular**: Modern and dynamic UI development.
- **PrimeNG**: Responsive UI components for forms, tables, dropdowns, and more.
- **OpenLayers**: Interactive map integration for project locations.

### Database:
- **PostgreSQL**: Relational database for storing project and user data.

### Deployment:
- **Docker**: Containerized microservices for deployment.
- **Nginx**: Used as a reverse proxy and static file server.

---

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js** (v16 or higher) and npm
- **PostgreSQL** (latest version)
- **Docker** (optional for containerized deployment)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/omidomatic/green-ballot.git
   cd greenballot
   ```

2. **Backend Setup**:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Configure the `application.properties` file:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/greenballot
     spring.datasource.username=yourusername
     spring.datasource.password=yourpassword
     ```
   - Build and run the backend:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the Angular development server:
     ```bash
     ng serve
     ```
   - Open your browser and navigate to `http://localhost:4200`.

4. **Access the Application**:
   - Backend API: `http://localhost:8080`
   - Frontend: `http://localhost:4200`

---

## 📂 Project Structure

### Backend (Spring Boot):
- **`src/main/java/com.greenballot`**: Contains the application code.
  - `controller`: REST controllers for handling requests.
  - `service`: Business logic and services.
  - `repository`: JPA repositories for database interaction.
  - `model`: Entity classes representing database tables.

### Frontend (Angular):
- **`src/app`**: Angular components, services, and modules.
  - `components`: UI components for the platform.
  - `services`: Handles HTTP requests to the backend API.
  - `models`: TypeScript interfaces for API data structures.

---

## 📸 Screenshots
*(Add screenshots of your platform here, showcasing the dashboard, project submission, map integration, etc.)*

---

## 🔒 Security Features

- **JWT Authentication**: Secure, stateless authentication for API endpoints.
- **Role-Based Access Control**: Ensures only authorized users can access certain parts of the application.
- **Data Validation**: Prevents invalid or malicious inputs.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push the branch:
   ```bash
   git commit -m "Add new feature"
   git push origin feature-name
   ```
4. Submit a pull request and describe your changes.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it.

---

## 🌐 Contact

For questions or feedback, please reach out to us at [your-email@example.com](mailto:your-email@example.com).
