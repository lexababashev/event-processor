# Event Processor

## Description
A NestJS-based event processing system with PostgreSQL and Prisma.

## Project Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (recommended version 18 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/) or `npm`

### Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd event-processor
   ```

2. **Copy the environment file:**
   ```sh
   cp .env.example .env
   ```
   Update `.env` file with your local database credentials if needed.

3. **Install dependencies:**
   ```sh
   npm install
   ```

4. **Start the database and migrations:**
   ```sh
   npm run docker:up
   ```
   This command will:
   - Start a PostgreSQL container.
   - Apply all existing Prisma migrations.
   - Generate the Prisma Client.

### Database Management

#### Apply Migrations
```sh
npm run db:apply-migations
```

#### Generate Prisma Client (run after applying migrations)
```sh
npm run db:generate
```

#### Seed Database
```sh
npm run db:seed
```

#### Reset Database
```sh
npm run db:reset
```

### Running the Project

#### Development Mode
```sh
npm run start:dev
```

#### Production Mode
```sh
npm run start:prod
```

### Running Tests

#### Unit Tests
```sh
npm run test
```

#### E2E Tests
```sh
npm run test:e2e
```

#### Test Coverage
```sh
npm run test:cov
```

### Stopping & Cleaning Up

To stop all containers and remove volumes:
```sh
npm run docker:down
```

### Deployment
When you're ready to deploy your NestJS application to production, follow the [deployment documentation](https://docs.nestjs.com/deployment).

If deploying on AWS, consider using [Mau](https://mau.nestjs.com):
```sh
npm install -g mau
mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

Happy coding! 🚀