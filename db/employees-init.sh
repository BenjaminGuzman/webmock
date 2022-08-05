#!/bin/bash
set -e

# create the database
psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres <<-EOSQL
	CREATE USER admin;
	CREATE DATABASE employees;
	GRANT ALL PRIVILEGES ON DATABASE employees TO admin;
	ALTER USER admin WITH PASSWORD 'pass1234';
EOSQL

# insert all data
psql --username admin employees < /employees.sql

# create users table
psql --username admin employees <<-EOSQL
  CREATE TABLE employees.users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
  );
EOSQL
