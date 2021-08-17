CREATE DATABASE datingapp;

GRANT ALL PRIVILEGES ON DATABASE datingapp TO postgres;

-- \c datingapp
-- SELECT current_database()

CREATE TABLE coordinate_table (
    id BIGSERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE address_table (
    id BIGSERIAL PRIMARY KEY,
    value VARCHAR(50) NOT NULL,
    -- coords
    coordinate_id BIGSERIAL NOT NULL
        REFERENCES coordinate_table (id),
    UNIQUE (coordinate_id)
);

CREATE TABLE user_table (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(10) NOT NULL,
    password BYTEA NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    interest VARCHAR(10) NOT NULL,
    range INT[] NOT NULL,
    distance INT NOT NULL,
    hobbies VARCHAR(20) NOT NULL,
    outgoing VARCHAR(20) NOT NULL,
    pets VARCHAR(20) NOT NULL,
    -- address
    address_id BIGSERIAL NOT NULL
        REFERENCES address_table (id),
    UNIQUE (address_id)
);