# **Codyfight Bots**

A **TypeScript**, **Express**, and **Node.js** project that allows developers to configure and run **Codyfighters** via the [Codyfight API](https://codyfight.com/api-doc/).

---

## **Table of Contents**

1. [Features](#features)
2. [Requirements](#requirements)
3. [Project Structure](#project-structure)
4. [Setup & Configuration](#setup--configuration)
    - [Environment Variables](#environment-variables)
    - [Database Setup (SQLite / Postgres)](#database-setup-sqlite--postgres)
5. [Scripts](#scripts)
6. [Development](#development)
7. [Production](#production)
8. [Extending the Database Layer](#extending-the-database-layer)
9. [Extending Strategies](#extending-strategies)
10. [Contributing](#contributing)
11. [License](#license)

---

## **Features**
- **Configuration UI**: A user interface to add or remove bots from the database.
- **Bot Runner**: Runs configured bots that connect to the Codyfight API and perform actions in the game.
- **Bot Strategies**: Easily extend the **move** and **cast** strategies to customize bot behavior.
- **Multiple Database Support**: Uses SQLite by default; can switch to Postgres or any other DB by implementing an interface.

---

## **Requirements**
- **TypeScript**: `>= 5.0.0`
- **Express**: `^4.18.2`
- **Node.js**: `>= 18.0.0`
- **Yarn**: `3.6.4` or later

---

## **Project Structure**

```
.
├── src/
│   ├── bots/
│   ├── client/
│   ├── game/
│   ├── server/
│   ├── utils/
│   └── ...
├── package.json
├── tsconfig.json
├── yarn.lock
└── ...
```

- `src/bots`: Contains core bot logic, including strategies and bot runner.
- `src/server`: Houses the Express server and database setup (SQLite or Postgres).
- `src/client`: Front-end/public assets for the configuration page.
- `src/game`: Game-specific logic and data structures (e.g., map, state, pathfinding).
- `src/utils`: Shared utility functions.

---

## **Setup & Configuration**

### **1. Environment Variables**

Create a `.env` file at the root of your project and add the necessary variables. Use the template `.env` file for reference.

```bash
# Environment
NODE_ENV=development

# SQLite (default)
DB_PATH=./src/server/db/bots.db
DB_DIALECT=sqlite
```

---

### **2. Database Setup**

#### **SQLite (Default)**
1. **Create the Database**:  
   Run the following scripts to initialize and seed an SQLite database:
   ```bash
   # Create tables
   node --loader ts-node/esm src/server/db/scripts/sqllite/create-db.ts

   # Seed database with some dummy records
   node --loader ts-node/esm src/server/db/scripts/sqllite/seed-db.ts
   ```

2. **Confirm `.env`**:  
   Make sure `.env` contains:
   ```bash
   DB_DIALECT=sqlite
   DB_PATH=./src/server/db/bots.db
   ```

#### **Postgres**
1. **Set Up Postgres**:  
   Create a Postgres database (e.g., `codyfight_bots`) and a user (e.g., `admin`).
2. **Configure `.env`**:
   ```bash
   DB_DIALECT=postgres
   DATABASE_URL=postgresql://admin@localhost:1234/codyfight_bots
   ```

---

## **Scripts**

Below are the **relevant commands**:

- **`yarn dev:config`**: Starts the **configuration server** in dev mode.
- **`yarn dev:run-bots`**: Starts the **bot runner** in dev mode.
- **`yarn start:config`**: Runs the **configuration server** from the compiled `dist` folder.
- **`yarn start:run-bots`**: Runs the **bot runner** from the compiled `dist` folder.
- **`yarn build`**: Builds the project for production, including server and client assets.

---

## **Development**

1. **Install Dependencies**
   ```bash
   yarn install
   ```

2. **Database**
    - For **SQLite**: Initialize the database (see [Database Setup](#database-setup)).
    - For **Postgres**: Configure `.env` and set up the database with necessary scripts.

3. **Start in Development Mode**
    - **Configuration Page**:
      ```bash
      yarn dev:config
      ```
    - **Bot Runner**:
      ```bash
      yarn dev:run-bots
      ```
---

## **Production**

1. **Build the Project**
   ```bash
   yarn build
   ```

2. **Start the Compiled Server**
    - **Configuration Page**:
      ```bash
      yarn start:config
      ```
    - **Bot Runner**:
      ```bash
      yarn start:run-bots
      ```

---

## **Extending the Database Layer**

To add support for a new database type (e.g., MongoDB):
- See [`src/server/db/repository/custom-c-bot-repository.ts`](./src/server/db/repository/custom-c-bot-repository.ts) for an example implementation of a custom database repository.

---

## **Extending Strategies**

You can extend or override the bot’s **move** and **cast** strategies by implementing custom logic:
- **Cast Strategy**: See [`src/bots/strategies/cast/custom-cast-strategy.ts`](./src/bots/strategies/cast/custom-cast-strategy.ts) for an example.
- **Move Strategy**: See [`src/bots/strategies/move/custom-move-strategy.ts`](./src/bots/strategies/move/custom-move-strategy.ts) for an example.

---

## **Contributing**

1. **Fork** this repository and **clone** your fork.
2. Create a new **branch** for your feature or fix.
3. **Commit** and **push** your changes.
4. Open a **Pull Request** against the main repository. Please include clear descriptions and, if necessary, add or update tests.


## **License**

This project is open-sourced under the [MIT License](LICENSE). Contributions are welcome!

