# Event Processor

## Description
A NestJS-based event processing system with PostgreSQL and Prisma.

## Project Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (recommended version 18 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [`npm`](https://npm.io/) 

### Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/lexababashev/event-processor
   cd event-processor
   ```

2. **environment file:**
   i ve added the `.env` file if needed.

3. **Install dependencies:**
   ```sh
   npm install
   ```

4. **To start application with one command: !!!!!!!!!!!!!!!!**
   ```sh
   npm run start:prod
   ```

### Running the Project
#### build applications (run before start running the Project)
```sh
npm run build
```

#### Production Mode
To start a specific service in production mode:
```sh
npm run start:gateway:prod
npm run start:collectors:prod
npm run start:reporter:prod
```

#### Development Mode
To start a specific service in development mode:
```sh
npm run start:gateway
npm run start:collectors
npm run start:reporter
```

### Database Management

#### Apply Migrations
```sh
npx prisma migrate deploy
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

### Stopping & Cleaning Up

To stop all containers and remove volumes:
```sh
npm run docker:down
```