@echo off
REM JalSuraksha Windows Make Helper Batch Script

if "%1"=="dev-flask" goto dev_flask
if "%1"=="run-prod" goto run_prod
if "%1"=="jupyter" goto jupyter
if "%1"=="test" goto test
if "%1"=="test-unit" goto test_unit
if "%1"=="test-flask" goto test_flask
if "%1"=="clean" goto clean
goto help

:dev_flask
python server.py --host 0.0.0.0 --port 5000
goto end

:run_prod
set FLASK_ENV=production
python wsgi.py
goto end

:jupyter
jupyter lab --ip=0.0.0.0 --port=8888 --no-browser
goto end

:test
pytest tests/unit/ -v
goto end

:test_unit
pytest tests/unit/ -v
goto end

:test_flask
pytest tests/unit/test_flask_app.py -v
goto end

:clean
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
del /s /q *.pyc 2>nul
goto end

:help
echo JalSuraksha Windows Command Runner
echo ---------------------------------
echo Usage: make ^<target^> or .\make.bat ^<target^>
echo.
echo Targets:
echo   dev-flask   - Launch Flask Atlas & REST APIs (http://localhost:5000)
echo   run-prod    - Run production WSGI server
echo   jupyter     - Launch JupyterLab ML environment (http://localhost:8888)
echo   test        - Run all automated unit test suites
echo   test-flask  - Run Flask application tests specifically
echo   clean       - Remove Python bytecode caches
echo.
goto end

:end
