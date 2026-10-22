.PHONY: help dev dev-flask run-prod jupyter test test-unit test-flask lint clean up down

help:
	@echo "JalSuraksha — Python-First AI Water Resource Intelligence Orchestration"
	@echo "-----------------------------------------------------------------------"
	@echo "make dev-flask   - Launch Python Flask Atlas & REST APIs (http://localhost:5000)"
	@echo "make run-prod    - Run production Gunicorn WSGI server"
	@echo "make jupyter     - Launch JupyterLab ML research environment (http://localhost:8888)"
	@echo "make test        - Run all automated pytest suites"
	@echo "make test-flask  - Run Flask application & Web UI unit tests"
	@echo "make up          - Start dockerized environment"
	@echo "make down        - Stop docker containers"
	@echo "make lint        - Run linters and code checkers"

dev-flask:
	python server.py --host 0.0.0.0 --port 5000

run-prod:
	python -m gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app

jupyter:
	jupyter lab --ip=0.0.0.0 --port=8888 --no-browser

test:
	pytest tests/unit/ -v

test-unit:
	pytest tests/unit/ -v

test-flask:
	pytest tests/unit/test_flask_app.py -v

up:
	docker-compose up -d

down:
	docker-compose down

lint:
	python -m flake8 apps/flask_app services/ tests/ || true

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
