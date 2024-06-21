# Donor Nest

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Welcome to Donor Nest, a robust platform designed to connect generous donors with meaningful campaigns. Our system enables users to easily create, manage, and donate to campaigns, ensuring that every cause gets the support it deserves. With secure authentication, seamless Stripe integration for payments, and comprehensive campaign management features, Donor Nest is your go-to solution for crowdfunding and donations.

## Features

- **User Authentication**: Secure login and registration using email and password.
- **JWT and Refresh Tokens**: Enhanced security with JWT for access tokens and refresh tokens for session management.
- **Admin Verification**: Campaign creation is gated by admin verification to ensure legitimacy.
- **Campaign Management**: Create, view, update, and delete campaigns with ease.
- **Donation Management**: Facilitate donations with detailed tracking and status updates.
- **Stripe Integration**: Seamlessly handle payments and transactions.
- **File Uploads**: Upload and manage official IDs using Multer and Uploadcare.
- **Role-Based Access Control**: Fine-grained access control using roles and permissions.
- **Automatic Status Updates**: Campaign status updates automatically when funding goals are met.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
  - **NestJS Modules**: Modular structure for organizing the application.
  - **NestJS Controllers**: Handle incoming requests and return responses.
  - **NestJS Services**: Business logic and data handling.
  - **NestJS Guards**: Role-based access control.
  - **NestJS Pipes**: Input validation and transformation.
  - **NestJS Decorators**: Custom decorators for cleaner code.
- **SQLite**: A lightweight database engine.
- **Prisma**: ORM for database interactions.
- **Stripe**: Payment processing platform.
- **Multer**: Middleware for handling multipart/form-data.
- **Uploadcare**: Service for handling file uploads.
- **PassportJS**: Authentication middleware for Node.js.
- **JWT**: JSON Web Tokens for securing APIs.
- **Docker**: Containerization platform for development and deployment.

## Configuration

Create a `.env` file in the root of your project with the following variables:

```env
PORT=3001
DATABASE_URL="your-db-url"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
UPLOADCARE_PUBLIC_KEY="your-uploadcare-public-key"
UPLOADCARE_SECRET_KEY="your-uploadcare-secret-key"
JWT_SECRET="your-jwt-secret"
```

## Installation and Usage

### Manual Installation

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/donor-nest.git
cd donor-nest
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up Prisma**:

```bash
npm run db:push
```

4. **Start the application**:

```bash
npm run start:dev
```

### Using Docker Compose

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/donor-nest.git
cd donor-nest
```

2. **Start services with Docker Compose**:

```bash
docker-compose up
```

## API Endpoints

### Authentication

1. **Register a new user**

   - **Description**: Register a new user.
   - **Method**: POST
   - **Route**: /api/v1/users/
   - **Access**: Public
   - **Output**: Success message

2. **Authenticate a user**

   - **Description**: Authenticate a user and get JWT token.
   - **Method**: POST
   - **Route**: /api/v1/auth/login
   - **Access**: Public
   - **Output**: JWT token

3. **Logout a user**

   - **Description**: Logout a user.
   - **Method**: POST
   - **Route**: /api/v1/auth/logout
   - **Access**: Private
   - **Output**: Success message

4. **Refresh the access token**
   - **Description**: Refresh the access token.
   - **Method**: GET
   - **Route**: /api/v1/auth/refresh
   - **Access**: Private
   - **Output**: Access token

### Users

1. **Get all Users**

   - **Description**: get all users.
   - **Method**: GET
   - **Route**: /api/v1/users
   - **Access**: Private (admins)
   - **Output**: users

2. **Get a user**

   - **Description**: get a user.
   - **Method**: GET
   - **Route**: /api/v1/users/:id
   - **Access**: Private
   - **Parameters**:
     - id (string): User ID.
   - **Output**: user

3. **Update a user**

   - **Description**: update a user.
   - **Method**: PUT
   - **Route**: /api/v1/users/:id
   - **Access**: Private
   - **Parameters**:
     - id (string): User ID.
   - **Output**: user

4. **Delete a user**

   - **Description**: Delete a user.
   - **Method**: DELETE
   - **Route**: /api/v1/users/:id
   - **Access**: Private
   - **Parameters**:
     - id (string): User ID.
   - **Output**: Success message

5. **Verfiy a user**

   - **Description**: Verfiy a user by his official ID.
   - **Method**: PUT
   - **Route**: /api/v1/users/:id/verfiy
   - **Access**: Private
   - **Parameters**:
     - id (string): User ID.
   - **Output**: Success message

### Campaigns

1. **Get all Campaigns**

   - **Description**: get all Campaigns.
   - **Method**: GET
   - **Route**: /api/v1/campaigns
   - **Access**: Public
   - **Query Parameters**:
     - full (number): page. Optional. for pagination.Defaul 1.
     - purpose (string): Optional. to filter by Campaign purpose.
     - search (string): Optional. to by Campaign name.
   - **Output**: Campaigns

2. **Add a Campaign**

   - **Description**: Add a Campaign.
   - **Method**: POST
   - **Route**: /api/v1/campaigns/:id
   - **Access**: Private
   - **Parameters**:
     - id (string): Campaign ID.
   - **Output**: campaign

3. **Get a Campaign**

   - **Description**: get a Campaign.
   - **Method**: GET
   - **Route**: /api/v1/campaigns/:id
   - **Access**: Public
   - **Parameters**:
     - id (string): Campaign ID.
   - **Output**: campaign

4. **Update a Campaign**

   - **Description**: update a Campaign.
   - **Method**: PUT
   - **Route**: /api/v1/campaigns/:id
   - **Access**: Private
   - **Parameters**:
     - id (string): Campaign ID.
   - **Output**: Campaign

5. **Delete a Campaign**

   - **Description**: Delete a campaign.
   - **Method**: DELETE
   - **Route**: /api/v1/campaigns/:id
   - **Access**: Private
   - **Parameters**:
     - id (string): Campaign ID.
   - **Output**: Success message

### Donations

2. **Donate**

   - **Description**: Create a new donation for a campaign.
   - **Method**: POST
   - **Route**: /api/v1/campaigns/:id/donations
   - **Access**: Public
   - **Parameters**:
     - id (string): Campaign ID.
   - **Output**: donation

3. **Get Donations**

   - **Description**: Get all donations for a campaign.
   - **Method**: GET
   - **Route**: /api/v1/campaigns/:id/donations
   - **Access**: Private
   - **Parameters**:
     - id (string): Campaign ID.
   - **Output**: donations

## License

This project is licensed under the [MIT licensed](LICENSE).
