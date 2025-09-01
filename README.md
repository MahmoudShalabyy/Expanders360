
# Expanders360 API

A robust Node.js API built with NestJS for managing projects, vendors, documents, analytics, authentication, and notifications.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Seeding Data](#seeding-data)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the Repository**:
   
   git clone https://github.com/MahmoudShalabyy/Expanders360.git
   cd expanders360-api


2. **Install Dependencies**:

   
   npm install
   

3. **Set Environment Variables**:

   * Create a `.env` file using `.env.example` as a reference.
   * Configure MySQL, MongoDB, JWT, and SMTP values.

## Usage

### Development

Run the application in development mode:


npm run start:dev


### Production

Run the application in production mode:


npm run start:prod


## API Endpoints

### Documents

* `POST /documents/upload` → Upload a new document.
* `GET /documents/project/:projectId` → Get documents for a project.

### Projects & Matching

* `POST /projects/:id/matches/rebuild` → Rebuild matches for a project.

### Analytics

* `GET /analytics/top-vendors` → Retrieve top vendors statistics.

## Environment Variables

| Variable        | Description            | Example Value                   |
| --------------- | ---------------------- | ------------------------------- |
| NODE\_ENV       | App environment        | `development`                   |
| MYSQL\_HOST     | MySQL host             | `localhost`                     |
| MYSQL\_PORT     | MySQL port             | `3306`                          |
| MYSQL\_USERNAME | MySQL username         | `root`                          |
| MYSQL\_PASSWORD | MySQL password         | `root`                          |
| MYSQL\_DATABASE | MySQL database         | `expanders360`                  |
| MONGO\_URI      | MongoDB connection URI | `mongodb://localhost:27017/exp` |
| JWT\_SECRET     | Secret key for JWT     | `your-secret-key`               |
| SMTP\_HOST      | SMTP server host       | `mailhog`                       |
| SMTP\_PORT      | SMTP server port       | `1025`                          |

## Deployment

The project is deployed on **Railway**:
👉 [Expanders360 API on Railway](https://your-app-name.up.railway.app)

## Seeding Data

To populate initial data, run the seed script:


ts-node src/seeds/seed.ts


## Demo

A short demo video showcasing API usage is available here:
👉 [Demo Video](https://drive.google.com/file/d/1orOH6izvRn2Z_CWLGlsUxOjFL5tl0DBE/view?usp=sharing)

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

## License

This project is licensed under the **MIT License**.



