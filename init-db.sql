-- Initialize the Naija Rides database
-- This file is executed when the PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Database is already owned by postgres user, no additional grants needed