@echo off
echo Starting English Learning Web...

echo Starting Backend...
start cmd /k "cd backend && mvn spring-boot:run"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both frontend and backend are starting in separate windows.
