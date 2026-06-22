const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `app.get("/api/admin/users-data"`;
const replacement = `app.delete("/api/admin/users/:uid", async (req, res) => {
  const authorizedEmails = ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'];
  const userEmail = req.session?.user?.email;

  if (!userEmail || !authorizedEmails.includes(userEmail)) {
     if (req.query.key !== process.env.MASTER_KEY) {
       return res.status(403).json({ error: "Unauthorized access to admin data" });
     }
  }

  const { uid } = req.params;
  
  if (!uid) {
    return res.status(400).json({ error: "Missing Target UID" });
  }

  try {
    const db = getDb();
    
    // Begin deleting associated user data across all tables that contain 'uid'
    // Following tables map to user's 'uid':
    await db.execute({ sql: "DELETE FROM user_plugins WHERE uid = ?", args: [uid] });
    await db.execute({ sql: "DELETE FROM receipts WHERE uid = ?", args: [uid] });
    await db.execute({ sql: "DELETE FROM user_feature_spend WHERE uid = ?", args: [uid] });
    await db.execute({ sql: "DELETE FROM plugin_usage WHERE uid = ?", args: [uid] });
    await db.execute({ sql: "DELETE FROM purchases WHERE uid = ?", args: [uid] });
    await db.execute({ sql: "DELETE FROM reaper_syncs WHERE uid = ?", args: [uid] });
    
    // Once associations are cleared, delete the main user record
    const result = await db.execute({ sql: "DELETE FROM users WHERE uid = ?", args: [uid] });
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log("[ADMIN] Permanently deleted user:", uid);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.get("/api/admin/users-data"`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code, 'utf8');
    console.log("Patched server.ts with admin user delete route");
} else {
    console.log("Could not find users-data route");
}
