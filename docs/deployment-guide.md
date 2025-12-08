# Guía Rápida de Despliegue a Google Cloud

Esta guía explica los pasos mínimos para desplegar **Portfolio** en una cuenta GCP diferente usando el workflow de GitHub Actions existente. El workflow se encarga del build, push y despliegue; solo necesitas configurar permisos y secrets.

## Prerrequisitos
- Cuenta GCP con facturación (o créditos gratuitos)..

## Paso 1: Crear Proyecto GCP
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto y anota el **Project ID** (e.g., `my-portfolio-project`).

## Paso 2: Habilitar APIs
En [APIs y servicios > Biblioteca](https://console.cloud.google.com/apis/library), habilita:
- **Cloud Run API**
- **Artifact Registry API**
- **Vertex AI API** (para funcionalidades de IA con Google Generative AI)

## Paso 3: Crear Service Account y Roles
1. Ve a [IAM > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) > **Crear cuenta de servicio**:
   - Nombre: `portfolio-service-account`
   - Descripción: "Para despliegues de Portfolio"
2. Otorga roles ([edita la SA](https://console.cloud.google.com/iam-admin/iam) después de crearla):
   - **Editor** (`roles/editor`) - rol amplio que incluye permisos para Cloud Run, Artifact Registry, etc. (fácil, pero menos seguro)
   - O roles específicos:
     - **Administrador de Cloud Run** (`roles/run.admin`)
     - **Administrador de Artifact Registry** (`roles/artifactregistry.admin`)
     - **Desarrollador de AI Platform** (`roles/aiplatform.user`)
     - **Visualizador de registros** (`roles/logging.viewer`) - opcional, para debug

3. Otorga "Usuario de cuenta de servicio" a la SA de Compute (solo si usas roles específicos):
   - En [IAM](https://console.cloud.google.com/iam-admin/iam), busca y selecciona la SA `***-compute@developer.gserviceaccount.com`.
   - Haz clic en **"Otorgar acceso"** (Grant access).
   - Agrega como **nuevo miembro**: `portfolio-service-account@tu-proyecto.iam.gserviceaccount.com`.
   - Asigna el rol **"Usuario de cuenta de servicio"** (`roles/iam.serviceAccountUser`).
   - Guarda.

## Paso 4: Generar Clave JSON
1. En la SA > **Claves** > **Agregar clave** > **JSON**.
2. Descarga el archivo (guárdalo seguro).

## Paso 5: Configurar Secrets en GitHub
Ve a tu repo > **Settings > Secrets > Actions** y agrega:
- `GCP_PROJECT_ID`: Tu Project ID.
- `GCP_SA_KEY`: Contenido del JSON descargado.
- Asegúrate de que los otros secrets estén: `NEXT_PUBLIC_FIREBASE_*`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GH_TOKEN`, `LOG_LEVEL`.

## Paso 6: Desplegar
1. Push a `main` en GitHub.
2. El workflow despliega automáticamente en Cloud Run.
3. URL: `https://codoi-[project-id]-uc.a.run.app`

## Costos (Blaze Plan)
- Cloud Run: ~$0.10/hora (2M requests gratis/mes).
- Artifact Registry: ~$0.10/GB.
- Vertex AI: Pago por uso (para llamadas a Google Generative AI).

## Troubleshooting
- **API no habilitada**: Habilita en [APIs](https://console.cloud.google.com/apis/library).
- **Permisos insuficientes**: Revisa roles en [IAM](https://console.cloud.google.com/iam-admin/iam).
- **Secrets faltantes**: Verifica en GitHub.
- **Logs**: En [Logging](https://console.cloud.google.com/logs/query) > Filtrar por `cloud_run_revision`.