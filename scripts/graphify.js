/**
 * Graphify Codebase Knowledge Graph Extractor
 * Repository: https://github.com/Graphify-Labs/graphify
 */
const fs = require('fs');
const path = require('path');

console.log('🤖 Graphify Codebase Analyzer Initializing...');
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else if (/\.(ts|tsx|js|jsx|json)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = walkDir(srcDir);
const graph = {
  nodes: [],
  edges: [],
  metadata: {
    projectName: "STDA Neomorphic Drive Hub",
    totalFiles: files.length,
    generatedAt: new Date().toISOString()
  }
};

files.forEach(filePath => {
  const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  graph.nodes.push({
    id: relPath,
    label: path.basename(filePath),
    type: relPath.includes('/components/') ? 'Component' : relPath.includes('/api/') ? 'API Route' : 'Lib',
    path: relPath
  });
});

const outputDir = path.join(projectRoot, 'graphify-out');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'graph.json'), JSON.stringify(graph, null, 2));
console.log(`✅ Graphify analysis complete! Exported ${graph.nodes.length} nodes to graphify-out/graph.json`);
