function runDijkstra() {
  const V = nodeCount;
  const adj = Array.from({ length: V }, () => []);
  edges.forEach(e => {
    adj[e.from].push([e.to, e.weight]);
  });

  const start = parseInt(document.getElementById('startNode').value);
  const end = parseInt(document.getElementById('endNode').value);
  const dist = Array(V).fill(Infinity);
  const prev = Array(V).fill(null);
  const visited = Array(V).fill(false);

  dist[start] = 0;

  for (let i = 0; i < V; i++) {
    let u = -1;
    for (let j = 0; j < V; j++) {
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
    }

    if (dist[u] === Infinity) break;
    visited[u] = true;

    for (let [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }

  const path = [];
  for (let at = end; at !== null; at = prev[at]) path.push(at);
  path.reverse();

  // Highlight the path nodes
  path.forEach(i => {
    const el = markers[i].getElement();
    el.style.background = 'yellow';
    el.style.border = '2px solid black';
  });

  const distanceBox = document.getElementById("shortestDistanceDisplay");
  if (dist[end] !== Infinity) {
    const pathString = path.join(" → ");
    distanceBox.innerHTML = `
      <div>Shortest Distance: <span style="color: green">${dist[end].toFixed(2)} km</span></div>
      <div style="margin-top: 4px;">Path: <span style="color: blue">${pathString}</span></div>
    `;
  } else {
    distanceBox.innerHTML = `<span style="color: red">No path found!</span>`;
  }
}
