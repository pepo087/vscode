import React, { useEffect } from 'react';
import * as d3 from 'd3';

function App() {
  useEffect(() => {
    // Funzione per eseguire l'algoritmo Bellman-Ford
    function bellmanFord(graph, source, destination) {
      const distances = {}; // Distanze inizializzate come oggetto vuoto
      for (const vertex of Object.keys(graph)) {
        distances[vertex] = Infinity; // Imposta tutte le distanze a Infinity
      }
      distances[source] = 0; // Distanza del vertice di partenza a 0
      const predecessors = {}; // Predecessori inizializzati come oggetto vuoto
      for (const vertex of Object.keys(graph)) {
        predecessors[vertex] = null; // Imposta tutti i predecessori a null
      }
    
      // Rilassa gli archi per n-1 volte
      for (let i = 0; i < Object.keys(graph).length - 1; i++) {
        for (const [u, vEdges] of Object.entries(graph)) {
          for (const [v, weight] of Object.entries(vEdges)) {
            if (distances[v] > distances[u] + weight) {
              distances[v] = distances[u] + weight;
              predecessors[v] = u;
            }
          }
        }
      }
    
      // Controlla la presenza di cicli negativi
      for (const [u, vEdges] of Object.entries(graph)) {
        for (const [v, weight] of Object.entries(vEdges)) {
          if (distances[v] > distances[u] + weight) {
            throw new Error("Il grafo contiene un ciclo negativo.");
          }
        }
      }
    
      // Stampa il percorso più breve dalla sorgente alla destinazione
      let path = [];
      let vertex = destination;
      while (vertex !== source) {
        path.push(vertex);
        vertex = predecessors[vertex];
      }
      path.push(source);
      console.log("Il percorso più breve è: " + path.reverse().join(" "));
    }

    // Creazione del grafo, dei vertici e degli archi
    const vertices = createVertices(5);
    const edges = [
      [0, 1, 1],
      [0, 2, 2],
      [1, 2, 3],
      [1, 3, 4],
      [2, 3, 5],
      [2, 4, 6],
      [3, 4, 7],
    ];
    const source = 0;
    const destination = 4;
    const graph = createGraph(vertices, edges);

    // Esecuzione dell'algoritmo Bellman-Ford
    bellmanFord(graph, source, destination);

    // Creazione del grafo SVG utilizzando D3.js
    const svg = d3.select("#graphContainer").append("svg");
    for (const vertex of vertices) {
      // eslint-disable-next-line no-unused-vars
      const node = svg
        .append("circle")
        .attr("cx", Math.random() * 500)
        .attr("cy", Math.random() * 500)
        .attr("r", 10);
    }
    for (const [u, v, weight] of edges) {
      // eslint-disable-next-line no-unused-vars
      const edge = svg
        .append("line")
        .attr("x1", Math.random() * 500)
        .attr("y1", Math.random() * 500)
        .attr("x2", Math.random() * 500)
        .attr("y2", Math.random() * 500)
        .attr("stroke", "black");
    }
  }, []);

  return (
    <div>
      <div id="graphContainer"></div>
    </div>
  );
}

// Funzione per creare il grafo
// Funzione per creare il grafo
function createGraph(vertices, edges) {
  const graph = {};
  for (const vertex of vertices) {
    graph[vertex] = undefined;
  }
  for (const [u, v, weight] of edges) {
    if (!graph[u]) {
      graph[u] = {};
    }
    graph[u][v] = weight;
  }
  return graph;
}

// Funzione per creare i vertici
function createVertices(n) {
  const vertices = [];
  for (let i = 0; i < n; i++) {
    vertices.push(i);
  }
  return vertices;
}

export default App;
