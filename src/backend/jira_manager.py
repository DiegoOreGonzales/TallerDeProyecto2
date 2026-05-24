import os
import requests
import json
import argparse
from dotenv import load_dotenv

# Cargar variables de entorno (JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN)
load_dotenv()

class JiraCLI:
    def __init__(self):
        self.url = os.getenv("JIRA_URL")
        self.email = os.getenv("JIRA_EMAIL")
        self.token = os.getenv("JIRA_API_TOKEN")
        self.auth = (self.email, self.token)
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

    def list_issues(self, project_key):
        """Lista las incidencias de un proyecto usando JQL."""
        query = f"project = {project_key} ORDER BY created DESC"
        url = f"{self.url}/rest/api/3/search"
        params = {"jql": query, "maxResults": 10}
        
        response = requests.get(url, headers=self.headers, params=params, auth=self.auth)
        if response.status_code == 200:
            issues = response.json().get("issues", [])
            print(f"\n📋 Últimas 10 incidencias en {project_key}:")
            print("-" * 60)
            for issue in issues:
                key = issue["key"]
                summary = issue["fields"]["summary"]
                status = issue["fields"]["status"]["name"]
                print(f"[{key}] {status:12} | {summary}")
        else:
            print(f"❌ Error al listar incidencias: {response.status_code} - {response.text}")

    def create_issue(self, project_key, summary, description, issue_type="Task"):
        """Crea una nueva incidencia en Jira."""
        url = f"{self.url}/rest/api/3/issue"
        payload = {
            "fields": {
                "project": {"key": project_key},
                "summary": summary,
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [{"type": "paragraph", "content": [{"type": "text", "text": description}]}]
                },
                "issuetype": {"name": issue_type}
            }
        }
        
        response = requests.post(url, headers=self.headers, data=json.dumps(payload), auth=self.auth)
        if response.status_code == 201:
            print(f"✅ Incidencia creada exitosamente: {response.json()['key']}")
        else:
            print(f"❌ Error al crear incidencia: {response.status_code} - {response.text}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SGOHA Jira CLI Manager")
    parser.add_argument("--list", action="store_true", help="Listar las últimas 10 incidencias")
    parser.add_argument("--project", type=str, default="SGOHA", help="Key del proyecto en Jira")
    parser.add_argument("--create", type=str, help="Resumen de la nueva incidencia")
    parser.add_argument("--desc", type=str, default="Creado desde SGOHA CLI", help="Descripción de la incidencia")

    args = parser.parse_args()
    
    # Verificar configuración
    if not os.getenv("JIRA_URL") or not os.getenv("JIRA_API_TOKEN"):
        print("⚠️  Configuración faltante. Asegúrate de tener JIRA_URL y JIRA_API_TOKEN en tu archivo .env")
        print("Ejemplo: JIRA_URL=https://ucontinental.atlassian.net")
        exit(1)

    cli = JiraCLI()
    
    if args.list:
        cli.list_issues(args.project)
    elif args.create:
        cli.create_issue(args.project, args.create, args.desc)
    else:
        parser.print_help()
