import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The toggles are wrapped in {(audioMode === 'critique' || audioMode === 'album') && (
// Let's change it back to {audioMode === 'critique' && (
content = content.replace(
  /\{\(audioMode === 'critique' \|\| audioMode === 'album'\) && \(/g,
  "{audioMode === 'critique' && ("
);

// We still want `hasStems` logic to show the Stems dropzone.
// But we want it to always be Stems dropzone when `audioMode === 'album'`.
// Look for `{hasStems ? (` where it branches to the multi-stem-upload-input
content = content.replace(
  /\{hasStems \? \(/g,
  "{(hasStems || audioMode === 'album') ? ("
);

// We need to change the "Stems (x/y)" heading to "Album Tracks (x/y)"
content = content.replace(
  /Stems \(\{stems\.filter\(s => s\.file\)\.length\}\/\{stemsLimit\}\)/g,
  "{audioMode === 'album' ? 'Album Tracks' : 'Stems'} ({stems.filter(s => s.file).length}/{stemsLimit})"
);

// And we should fix the `!isVerified && hasStems` logic to include album mode
content = content.replace(
  /\{!isVerified && hasStems && \(/g,
  "{!isVerified && (hasStems || audioMode === 'album') && ("
);

// In `handleAudioSearch` we shouldn't return if `hasStems` is false but `audioMode === 'album'`?
// No, the submit button for album mode is the same as the stems submit button (`handleStemsSearch`).
// Let's check where `handleStemsSearch` is called. It's inside the Stems view.
// And what about the regular `handleAudioSearch`? It's inside the standard audio upload view.
// Since `(hasStems || audioMode === 'album')` triggers the stems view, the `handleStemsSearch` button is shown.

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Patched App.tsx for album toggles");
