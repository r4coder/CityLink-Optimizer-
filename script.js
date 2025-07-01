let map = L.map('map').setView([17.385044, 78.486671], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];
let edges = [];
let labels = [];
let nodeCount = 0;

map.on('click', function (e) {
  createNode(e.latlng.lat, e.latlng.lng);
});

function createNode(lat, lng) {
  const nodeId = nodeCount++;
  const el = document.createElement('div');
  el.className = 'node-circle';
  el.innerText = nodeId;

  const marker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: '',
      html: el.outerHTML,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
  }).addTo(map);

  marker.nodeId = nodeId;
  marker.latlng = [lat, lng];
  marker.getElement = () => document.querySelectorAll('.node-circle')[nodeId];

  markers.push(marker);

  ['fromNode', 'toNode', 'startNode', 'endNode'].forEach(id => {
    const opt = document.createElement('option');
    opt.value = nodeId;
    opt.text = `${nodeId}`;
    document.getElementById(id).appendChild(opt);
  });
}

function getDistance(p1, p2) {
  const R = 6371;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function connectSelectedNodes() {
  const from = parseInt(document.getElementById('fromNode').value);
  const to = parseInt(document.getElementById('toNode').value);
  if (isNaN(from) || isNaN(to) || from === to) return;

  const m1 = markers[from];
  const m2 = markers[to];
  const latlngs = [m1.getLatLng(), m2.getLatLng()];
  const dist = getDistance(m1.getLatLng(), m2.getLatLng());

  const line = L.polyline(latlngs, { color: 'black', weight: 2 }).addTo(map);

  edges.push({ from, to, weight: dist });
  edges.push({ from: to, to: from, weight: dist });

  const midLat = (latlngs[0].lat + latlngs[1].lat) / 2;
  const midLng = (latlngs[0].lng + latlngs[1].lng) / 2;

  const label = L.marker([midLat, midLng], {
    icon: L.divIcon({
      className: '',
      html: `
        <div class='edge-label-box'>
          <div><strong>${from} &#8596; ${to}</strong></div>
          <div>${dist.toFixed(2)} km</div>
        </div>
      `,
      iconAnchor: [0, 0]
    })
  }).addTo(map);
  labels.push(label);
}

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

function resetGraph() {
  // 1. Remove all edge polylines
  map.eachLayer(layer => {
    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
      map.removeLayer(layer);
    }
  });

  // 2. Reset node styles
  markers.forEach(m => {
    const el = m.getElement();
    if (el) {
      el.style.background = 'white';
      el.style.border = '2px solid gray';
    }
  });

  // 3. Remove edge labels
  labels.forEach(label => map.removeLayer(label));
  labels = [];

  // 4. Clear all edge data
  edges = [];

  // 5. Clear dropdowns
  ['fromNode', 'toNode', 'startNode', 'endNode'].forEach(id => {
    const select = document.getElementById(id);
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });

  // 6. Refill dropdowns from markers
  markers.forEach((_, i) => {
    ['fromNode', 'toNode', 'startNode', 'endNode'].forEach(id => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.text = `${i}`;
      document.getElementById(id).appendChild(opt);
    });
  });

  // 7. Clear shortest path result
  document.getElementById("shortestDistanceDisplay").innerHTML = '';
}
