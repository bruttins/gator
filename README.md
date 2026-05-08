# Gator - RSS Feed Aggregator CLI

Gator is a command-line interface (CLI) tool for aggregating and browsing RSS feeds. It allows users to register, follow feeds, and view the latest posts from their followed feeds.

## Prerequisites

Before running Gator, ensure you have the following installed:

- **Node.js** (version 18 or higher recommended)
- **PostgreSQL** database (version 12 or higher)
- **npm** (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bruttins/gator.git
   cd gator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Gator uses a configuration file located at `~/.gatorconfig.json` in your home directory.

1. Create the config file:
   ```bash
   touch ~/.gatorconfig.json
   ```

2. Edit the file with your PostgreSQL database URL:
   ```json
   {
     "db_url": "postgres://username:password@localhost:5432/gator_db"
   }
   ```
   Replace `username`, `password`, `localhost`, `5432`, and `gator_db` with your actual PostgreSQL connection details.

## Database Setup

1. Ensure your PostgreSQL database is running and accessible.

2. Generate and run database migrations:
   ```bash
   npm run generate
   npm run migrate
   ```

## Running the Application

Start the CLI:
```bash
npm start
```

The CLI will prompt for commands. If no command is provided, it will display an error.

## Commands

Here are some key commands you can use:

### User Management
- `register <username>`: Register a new user account.
- `login <username>`: Log in as an existing user.
- `users`: List all registered users (shows who is currently logged in).

### Feed Management
- `addfeed <name> <url>`: Add a new RSS feed (requires login).
- `feeds`: List all available feeds.
- `follow <url>`: Follow an existing feed (requires login).
- `following`: List feeds you are following (requires login).
- `unfollow <url>`: Unfollow a feed (requires login).

### Browsing Posts
- `browse [limit]`: View the latest posts from your followed feeds (requires login). The optional `limit` parameter specifies the number of posts to show (default: 2).

### Aggregation
- `agg <time_between_reqs>`: Start the feed aggregator to periodically fetch new posts. `<time_between_reqs>` is the interval (e.g., `30s`, `5m`, `1h`).

### Other
- `reset`: Reset all users (for development/testing).

## Example Usage

1. Register a user:
   ```bash
   npm start register alice
   ```

2. Log in:
   ```bash
   npm start login alice
   ```

3. Add a feed:
   ```bash
   npm start addfeed "TechCrunch" "https://techcrunch.com/feed/"
   ```

4. Follow the feed:
   ```bash
   npm start follow "https://techcrunch.com/feed/"
   ```

5. Browse latest posts:
   ```bash
   npm start browse 5
   ```

## Troubleshooting

- If you encounter database connection errors, verify your `~/.gatorconfig.json` file has the correct `db_url`.
- Ensure PostgreSQL is running and the database exists.
- For migration issues, try regenerating migrations: `npm run generate` then `npm run migrate`.

## Contributing

Feel free to submit issues or pull requests on GitHub.

## License

ISC