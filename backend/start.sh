#!/usr/bin/env bash

set -e

echo "Running database migrations..."
flask db upgrade

echo "Seeding exercise library..."
python scripts/seed_exercise_library.py

echo "Linking exercises..."
python scripts/link_exercises_to_library.py

echo "Starting Gunicorn..."
exec gunicorn run:app