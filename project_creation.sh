#!/bin/bash

# App structure
mkdir -p app/api/endpoints
mkdir -p app/core
mkdir -p app/models
mkdir -p app/services
mkdir -p app/utils

# Frontend structure
mkdir -p frontend/app/static
mkdir -p frontend/app/templates

# DevOps structure
mkdir -p devops/ci_cd
mkdir -p devops/docker
mkdir -p devops/infrastructure/terraform

# Notebooks structure
mkdir -p notebooks/data_science
mkdir -p notebooks/experiments

# Tests structure
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e

# Docs structure
mkdir -p docs

# Create placeholder files
touch app/api/endpoints/{regulatory_data.py,internal_data.py,speech_data.py,ms_teams_integration.py}
touch app/api/dependencies.py
touch app/core/{config.py,security.py,settings.py}
touch app/models/chatbot.py
touch app/services/{azure_openai.py,langchain.py,ms_teams_bot.py}
touch app/main.py
touch app/utils/{helpers.py,logger.py}
touch frontend/app/app.py
touch frontend/Dockerfile
touch devops/ci_cd/{azure-pipelines.yml,github-actions.yml}
touch devops/docker/{Dockerfile,docker-compose.yml}
touch devops/infrastructure/terraform/main.tf
touch notebooks/data_science/exploratory_analysis.ipynb
touch notebooks/experiments/langchain_experiment.ipynb
touch tests/unit/{test_regulatory_data.py,test_internal_data.py,test_speech_data.py}
touch tests/integration/test_ms_teams_integration.py
touch tests/e2e/test_end_to_end.py
touch docs/{architecture.md,setup_guide.md,developer_guide.md}
touch requirements.txt
touch README.md
touch .env

echo "Directory structure created successfully in the current 'bsp' directory!"