const fs = require('fs');
let content = fs.readFileSync('temp_split.ts', 'utf8');
content = content.replace(
  /    \} catch \(error: any\) \{\s*console\.error\("Error in PDF split-analyse:", error\);\s*try \{ fs\.unlinkSync\(tempFilePath\); \} catch \(e\) \{\}\s*res\.write\(JSON\.stringify\(\{ error: error\.message \|\| "Internal server error during PDF splitting" \}\)\);\s*return res\.end\(\);\s*\}/,
  `    } catch (error: any) {
      console.error("Error in PDF split-analyse:", error);
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
      res.write(JSON.stringify({ error: error.message || "Internal server error during PDF splitting" }));
      return res.end();
    } finally {
      clearInterval(keepAliveInterval);
    }`
);
fs.writeFileSync('temp_split.ts', content);
