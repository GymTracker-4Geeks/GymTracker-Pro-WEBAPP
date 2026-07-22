#!/usr/bin/env bash

echo "Running database migrations..."
flask db upgrade

echo "Starting Gunicorn..."
exec gunicorn run:app