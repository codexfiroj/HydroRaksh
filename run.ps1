# JalSuraksha PowerShell Command Runner
param (
    [Parameter(Position=0)]
    [string]$Target = "help"
)

switch ($Target.ToLower()) {
    "dev-flask" {
        Write-Host "Launching JalSuraksha Flask Atlas on http://localhost:5000..." -ForegroundColor Cyan
        python server.py --host 0.0.0.0 --port 5000
    }
    "run-prod" {
        Write-Host "Launching JalSuraksha in Production Mode..." -ForegroundColor Cyan
        $env:FLASK_ENV = "production"
        python wsgi.py
    }
    "jupyter" {
        Write-Host "Launching JupyterLab on http://localhost:8888..." -ForegroundColor Cyan
        jupyter lab --ip=0.0.0.0 --port=8888 --no-browser
    }
    "test" {
        Write-Host "Running all unit test suites..." -ForegroundColor Cyan
        pytest tests/unit/ -v
    }
    "test-flask" {
        Write-Host "Running Flask application tests..." -ForegroundColor Cyan
        pytest tests/unit/test_flask_app.py -v
    }
    "clean" {
        Write-Host "Cleaning pycache and pyc files..." -ForegroundColor Cyan
        Get-ChildItem -Path . -Include __pycache__ -Recurse -Directory | Remove-Item -Recurse -Force
        Get-ChildItem -Path . -Include *.pyc -Recurse -File | Remove-Item -Force
    }
    Default {
        Write-Host "JalSuraksha PowerShell Helper" -ForegroundColor Yellow
        Write-Host "----------------------------"
        Write-Host "Usage: .\run.ps1 <target> or .\make.bat <target>"
        Write-Host ""
        Write-Host "Targets:"
        Write-Host "  dev-flask   - Launch Flask server (http://localhost:5000)"
        Write-Host "  run-prod    - Run production WSGI server"
        Write-Host "  jupyter     - Launch JupyterLab (http://localhost:8888)"
        Write-Host "  test        - Run all 87 pytest test suites"
        Write-Host "  test-flask  - Run 25 Flask specific unit tests"
        Write-Host "  clean       - Clean bytecode caches"
    }
}
