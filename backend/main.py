from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import asyncio
import random

app = FastAPI(title="SDN Traffic Engineering API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sdntrafficcontroller.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mocked Data state for demonstration (especially for Cloud Run)
mock_state = {
    "throughput": 450,
    "delay": 22.5,
    "congested": False,
    "alerts": []
}

@app.on_event("startup")
async def startup_event():
    # Background task to mock dynamic network changes
    asyncio.create_task(simulate_network_metrics())

async def simulate_network_metrics():
    global mock_state
    alert_id = 1
    while True:
        mock_state["throughput"] = random.randint(300, 950)
        
        # Simulate occasional congestion
        if random.random() > 0.8:
            mock_state["delay"] = random.randint(40, 100)
            mock_state["congested"] = True
            mock_state["alerts"].append({
                "id": f"alert-{alert_id}",
                "timestamp": datetime.utcnow().isoformat(),
                "type": "congestion",
                "message": f"Link s1-s2 exceeded 80% utilization. Delay spiked to {mock_state['delay']}ms. Initiating reroute."
            })
            alert_id += 1
        else:
            mock_state["delay"] = random.uniform(10.0, 25.0)
            mock_state["congested"] = False

        # Keep alerts list bounded
        if len(mock_state["alerts"]) > 20:
            mock_state["alerts"].pop(0)
            
        await asyncio.sleep(3)

@app.get("/api/topology")
def get_topology():
    return {
        "nodes": [
            {"id": "s1", "group": "switch"},
            {"id": "s2", "group": "switch"},
            {"id": "s3", "group": "switch"},
            {"id": "s4", "group": "switch"},
            {"id": "h1", "group": "host"},
            {"id": "h2", "group": "host"},
            {"id": "h3", "group": "host"},
            {"id": "h4", "group": "host"}
        ],
        "links": [
            {"source": "h1", "target": "s1", "value": 1},
            {"source": "h2", "target": "s2", "value": 1},
            {"source": "h3", "target": "s3", "value": 1},
            {"source": "h4", "target": "s4", "value": 1},
            {"source": "s1", "target": "s2", "value": 5, "congested": mock_state["congested"]},
            {"source": "s2", "target": "s3", "value": 5},
            {"source": "s3", "target": "s4", "value": 5},
            {"source": "s4", "target": "s1", "value": 5},
            {"source": "s2", "target": "s4", "value": 5}
        ]
    }

@app.get("/api/metrics/current")
def get_metrics():
    packet_loss = 0.05 if mock_state["congested"] else 0.001
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "global": {
            "avgDelay": round(mock_state["delay"], 2),
            "packetLoss": packet_loss,
            "throughput": mock_state["throughput"]
        }
    }

@app.get("/api/alerts")
def get_alerts():
    # Return last 5 alerts reversed
    return list(reversed(mock_state["alerts"]))[:5]

@app.get("/api/results/comparison")
def get_results_comparison():
    return {
        "beforeTE": {"avgDelay": 65.2, "throughput": 400, "packetLoss": 0.08},
        "afterTE": {"avgDelay": 15.1, "throughput": 890, "packetLoss": 0.001}
    }
