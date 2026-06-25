const fs = require('fs');

function main() {
  const html = fs.readFileSync('reapack_repos.html', 'utf8');
  
  // Structure:
  // <li>
  //   <div class="left">
  //     <a href="REPO_PAGE">REPO_NAME</a><br />
  //     <div class="desc">DESCRIPTION (contains "effects")</div>
  //   </div>
  //   <a class="index" href="INDEX_URL"><code>INDEX_URL</code></a>
  // </li>
  
  const repos = [];
  // Regex to capture the block
  const blockRegex = /<li>[\s\S]*?<div class="left">[\s\S]*?<a href="([^"]+)">([^<]+)<\/a>[\s\S]*?<div class="desc">([^<]+)<\/div>[\s\S]*?<a class="index" href="([^"]+)">/g;
  
  let match;
  while ((match = blockRegex.exec(html)) !== null) {
    const source = match[1];
    const name = match[2];
    const desc = match[3];
    const reapack = match[4];
    
    // Only keep if it has "effects" in description or name
    if (desc.toLowerCase().includes('effects') || name.toLowerCase().includes('jsfx')) {
      repos.push({ name, desc, source, reapack });
    }
  }
  
  console.log(JSON.stringify(repos, null, 2));
}

main();
