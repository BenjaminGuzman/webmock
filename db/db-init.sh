psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres <<-EOSQL
	CREATE USER mock_admin;
	CREATE DATABASE mock;
	GRANT ALL PRIVILEGES ON DATABASE mock TO mock_admin;
	ALTER USER mock_admin WITH PASSWORD 'pass1234';
EOSQL
