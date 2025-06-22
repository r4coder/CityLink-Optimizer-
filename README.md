# CityLink-Optimizer-
# 🚦 City Link Optimizer

An interactive visualizer for optimizing routes between city points using **Dijkstra’s Algorithm**. Users can click on the map to add city nodes, connect them with weighted edges, and find the shortest path between any two selected locations based on real geographical distance.

---

## 🧩 Problem Statement

### 🏘️ Real-World Context

In many developing towns and semi-urban areas — like the place I live in — infrastructure is still evolving, and proper road connections are often missing or incomplete. Locals, delivery agents, and emergency services face daily challenges in navigating from one point to another due to:

- Undefined or underdeveloped road links  
- No fixed travel paths or GPS accuracy  
- A need to find the fastest possible route, even if it’s not the "official" one

### 💡 My Inspiration

I personally experienced this issue in my own locality, where new houses and roads are coming up, but there's no clear map or route guidance.

That’s what inspired me to build the **City Link Optimizer** — a tool that:

- Lets users manually define city nodes (like key landmarks, junctions, or houses)  
- Connects them manually based on usable paths or shortcuts  
- Then uses **Dijkstra’s algorithm** to find the shortest and most efficient route from point A to B

### 🚀 What It Solves

| Challenge                                | My Project’s Solution                              |
|------------------------------------------|----------------------------------------------------|
| Roads are not yet constructed            | User can manually define paths between locations   |
| Google Maps doesn't show internal links  | Custom graph-based routing works independently     |
| People get lost or take longer routes    | Dijkstra shows the optimal route between points    |
| No visual map of city layout             | Leaflet.js renders live interactive map-based nodes |

---

## 📌 Features

- 🗺️ Real-world interactive map (Leaflet.js + OpenStreetMap)
- 🏙️ Add nodes dynamically by clicking on the map
- ➰ Draw directed edges between any two nodes
- 📏 Auto-calculated edge weights based on Haversine (great-circle) distance
- 🧠 Dijkstra's Algorithm to find the shortest path
- 🔄 Visual node highlighting of the shortest path
- 🧼 Reset button to clear path highlights and distance labels

---

## 🛠️ Tech Stack

| Tech              | Usage                         |
|-------------------|-------------------------------|
| **HTML, CSS, JS** | UI and interaction            |
| **Leaflet.js**    | Map rendering and click input |
| **Dijkstra’s Algorithm** | Shortest path calculation      |

---

## 📊 Algorithms Used

### 🔹 Dijkstra’s Algorithm

- Input: Directed graph with weighted edges between nodes
- Output: Shortest path from start node to end node
- Time Complexity: **O(V²)** (Basic implementation)

> Uses adjacency list to store graph and greedy selection to find the next minimum distance node.

---

## 🧪 How It Works

1. **Click** on the map to add nodes (cities).
2. **Select nodes** (from → to) from dropdown and click **“Connect”** to add a directed edge.
3. Click **“Run Dijkstra”** to see the shortest path between selected **start** and **end** nodes.
4. Path will be highlighted in **yellow**, and edge weights are shown in styled boxes.
5. Click **“Reset”** to remove path highlights and start fresh.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/city-link-optimizer.git
cd city-link-optimizer
