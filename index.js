// index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cron = require('./scheduler');

const app = express();
const PORT = 3000;

let domainData = new Set();
let addressData = new Set();

function loadFilesIntoMemory(folder, dataSet) {
  const files = fs.readdirSync(folder);
  for (const file of files) {
    const filePath = path.join(folder, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    lines.forEach(line => dataSet.add(line.trim()));
  }
}

function isBlocked(dataSet, item) {
  return dataSet.has(item);
}

app.get('/', (req, res) => {
  const { domain } = req.query;
  if (!domain) {
    return res.status(400).json({ error: 'Domain parameter is required' });
  }

  const domains = domain.split(',');
  const result = {};

  for (const d of domains) {
    result[d] = {
      blocked: isBlocked(domainData, d) || isBlocked(addressData, d)
    };
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  loadFilesIntoMemory(path.join(__dirname, 'domain'), domainData);
  loadFilesIntoMemory(path.join(__dirname, 'address'), addressData);
});