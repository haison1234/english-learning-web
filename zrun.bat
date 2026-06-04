@echo off
echo Starting English Learning Web...

echo Starting Backend...
start cmd /k "cd apps\backend && mvn spring-boot:run"

echo Starting Frontend...
start cmd /k "cd apps\frontend && npm run dev"

echo Both frontend and backend are starting in separate windows.
