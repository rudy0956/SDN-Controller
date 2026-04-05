# SDN-Based Traffic Engineering System

This is a comprehensive academic project mimicking a Software Defined Networking (SDN) Traffic Engineering scenario.

It comprises:
1. **Frontend**: React + Vite + Tailwind UI Dashboard.
2. **Backend**: FastAPI aggregator providing REST APIs.
3. **SDN Layer**: Mininet Topology and Ryu Controller scripts.

## How to Run Locally (Docker)

If you have Docker and Docker Compose installed, you can spin up the full web interface suite.

```bash
docker-compose up --build
```
> Access the UI at: `http://localhost:80` (or `http://localhost:5173`)
> Access API Docs: `http://localhost:8000/docs`

*Note: The backend inherently runs an interactive traffic "mock" so you can visually see congestion routing rules working in the UI without needing strict Linux Kernel network access required by Mininet.*

## How to Run Physically (Mininet + Ryu)

If you are on a Linux environment (or VM) with Mininet and Ryu installed:

1. **Start Ryu Controller**
   ```bash
   cd sdn
   ryu-manager controller.py
   ```

2. **Start Mininet Topology** (Open another terminal)
   ```bash
   sudo python3 sdn/topology.py
   ```
   This will spin up the mesh topology and connect it to the local controller. You can now use the `mininet>` CLI to run `pingall` or `iperf` to create real congestion events.

## Google Cloud Run Deployment

Due to Cloud Run being a Serverless/Stateless environment, deploying the raw Linux-Kernel based Mininet directly to it is not feasible. We implement a hybrid architecture:

1. Deploy the `backend` Docker container to Cloud Run (it will use the simulation fallback).
2. Deploy the `frontend` container to Cloud Run pointing to the backend URL.
3. The project visually demonstrates the capabilities, completely decoupled!

```bash
# Example deployment commands for GCP
gcloud run deploy sdn-backend --source ./backend --allow-unauthenticated
gcloud run deploy sdn-frontend --source ./frontend --allow-unauthenticated --set-env-vars VITE_API_URL=<backend-url>
```
