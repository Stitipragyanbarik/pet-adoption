# Pet Rescue Management System

This is a full-stack application for managing pet rescue operations, including pet adoption, lost and found reports, and user management.

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

## Backend Setup

### 1. Create a Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate the Virtual Environment

- On Windows:

```bash
venv\Scripts\activate
```

- On macOS/Linux:

```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create a Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Run the Backend Server

```bash
python manage.py runserver
```

The backend will be running on http://127.0.0.1:8000/

## Frontend Setup

### 1. Install Dependencies

```bash
cd New-frontend
npm install
```

### 2. Start the Development Server

```bash
npm start
```

The frontend will be running on http://localhost:3000/

## Usage

1. Start the backend server first.
2. Start the frontend server.
3. Open your browser and navigate to http://localhost:3000/

## API Endpoints

- `/api/users/` - User management
- `/api/pets/` - Pet management
- `/api/notifications/` - Notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
