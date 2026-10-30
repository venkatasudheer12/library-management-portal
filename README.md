# Library Management Portal

A beginner-friendly React + Vite library portal with a JSON Server backend.

## Requirements
- Node.js and npm installed
- VS Code (recommended)

## Install
Open a terminal in this folder and run:

```bash
npm install
```

## Start the backend
Open terminal 1:

```bash
npm run server
```

Check `http://localhost:3000/books`.

## Start the frontend
Open terminal 2 in the same project folder:

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Demo login
- Email: `student@gmail.com`
- Password: `123456`

You can also register a demo account. Demo authentication stores account information in browser localStorage and is **not secure for production**.

## Features
- Dashboard statistics
- Books: add, edit, delete, search
- Members: add, edit, delete, search
- Issue and return books
- Transaction history
- JSON Server persistence

## Notes
- Keep `db.json` in the project root.
- Keep the backend terminal running while using the app.
- Do not run two JSON Server processes on port 3000.
- This demo is intended for local learning, not production deployment.
