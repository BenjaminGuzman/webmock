CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    dob DATE NOT NULL,
    gender SMALLINT NOT NULL,
    password VARCHAR NOT NULL
);

CREATE INDEX username_hash_idx ON users USING hash(username);
CREATE INDEX email_hash_idx ON users USING hash(email);