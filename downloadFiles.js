// downloadFiles.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GITHUB_API_URL_DOMAIN = 'https://api.github.com/repos/lepasid/komkomkomkom/contents/domain?ref=main';
const GITHUB_API_URL_ADDRESS = 'https://api.github.com/repos/lepasid/komkomkomkom/contents/address?ref=main';

async function downloadFiles(url, folder) {
  try {
    const response = await axios.get(url);
    const files = response.data;

    for (const file of files) {
      if (file.type === 'file') {
        const fileResponse = await axios.get(file.download_url);
        const filePath = path.join(__dirname, folder, file.name);
        fs.writeFileSync(filePath, fileResponse.data);
        console.log(`Downloaded ${file.name} to ${folder}`);
      }
    }
  } catch (error) {
    console.error(`Failed to download files from ${url}:`, error);
  }
}

async function main() {
  await downloadFiles(GITHUB_API_URL_DOMAIN, 'domain');
  await downloadFiles(GITHUB_API_URL_ADDRESS, 'address');
}

main();