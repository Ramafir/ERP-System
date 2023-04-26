# ERP System

NodeJS/Express codebase for ERP System

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

-   Node - v14.0.0
-   NPM - v7.0.0
-   Docker - v20.10.08 (optional)

### Installing

From terminal

```
# copy file and set proper data inside
cp .env.example .env

# install dependencies
npm cache clean && npm install

# run docker compose
npm run dc-up

# other useful docker commands
npm run dc-down

# prepare database
npm run db-reset

# other useful database commands
npm run db-drop
npm run db-create
npm run db-migrate
npm run db-seed
```

## Development

```
npm run dev
```

## Testing

```
# copy file and set proper data inside (different ports & compose project name)
cp .env.example .env.test

# run docker-compose for test environment
npm run dc-test-up

# run tests
npm run test

# other docker commands
npm run dc-test-down
```
