Use these steps when deploying the Django backend to Render with PostgreSQL.

1. Set Render environment variables.
   `DATABASE_URL=<your render postgres internal url>`
   `SECRET_KEY=<strong secret>`
   `DEBUG=False`
   `CLOUDINARY_CLOUD_NAME=<value>`
   `CLOUDINARY_API_KEY=<value>`
   `CLOUDINARY_API_SECRET=<value>`

2. Use this build command.
   `pip install -r requirements.txt && python manage.py migrate`

3. Use this start command.
   `gunicorn backend.wsgi:application`

4. Restore sqlite data into Postgres after the first successful deploy.
   `python manage.py loaddata sqlite_export.json`

Notes:
- `sqlite_export.json` was generated from the current local sqlite database.
- Run `loaddata` only once for the initial data import, or after resetting the Postgres database.
