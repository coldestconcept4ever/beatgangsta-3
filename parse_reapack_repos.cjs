const fs = require('fs');

function main() {
  const html = fs.readFileSync('reapack_repos.html', 'utf8');
  
  // Look for <tr> segments or <a> tags with index.xml
  // Usually they look like: <td><strong>Name</strong></td> ... <code>URL</code>
  // Or just <a> links.
  
  const repos = [];
  const regex = /<tr>\s*<td>\s*<strong>(.*?)<\/strong>\s*<\/td>\s*<td>\s*<code>(.*?)<\/code>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    repos.push({
      name: match[1].trim(),
      url: match[2].trim()
    });
  }
  
  if (repos.length === 0) {
    // Try another regex if the first one failed (different HTML structure)
    const altRegex = /<a href="([^"]+index\.xml)">/g;
    while ((match = altRegex.exec(html)) !== null) {
      repos.push({
        name: 'Unknown',
        url: match[1].trim()
      });
    }
  }

  console.log(JSON.stringify(repos, null, 2));
}

main();
