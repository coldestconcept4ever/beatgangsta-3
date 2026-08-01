import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  "const [audioMode, setAudioMode] = useState<'recipe' | 'critique'>('critique');",
  "const [audioMode, setAudioMode] = useState<'recipe' | 'critique' | 'album'>('critique');"
);

const btnReplacement = `                    <button
                      id="btn-audio-recipe"
                      onClick={() => setAudioMode('recipe')}
                      className={\`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all \${
                        audioMode === 'recipe' 
                          ? (theme === 'coldest' ? 'bg-sky-500 text-white shadow-md' : 'bg-white text-black shadow-md')
                          : (theme === 'coldest' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white')
                      }\`}
                    >
                      {t('extract_recipe')}
                    </button>
                    <button
                      id="btn-audio-critique"
                      onClick={() => setAudioMode('critique')}
                      className={\`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 \${
                        audioMode === 'critique' 
                          ? (theme === 'coldest' ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-500 text-white shadow-md')
                          : (theme === 'coldest' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white')
                      }\`}
                    >
                      <span>{t('mix_critique')}</span>
                    </button>
                    <button
                      id="btn-album-mastering"
                      onClick={() => { setAudioMode('album'); setHasStems(true); }}
                      className={\`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 \${
                        audioMode === 'album' 
                          ? (theme === 'coldest' ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-500 text-white shadow-md')
                          : (theme === 'coldest' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white')
                      }\`}
                    >
                      <span>Album Mastering</span>
                    </button>`;

content = content.replace(
  /<button\s+id="btn-audio-recipe"[\s\S]*?<span>\{t\('mix_critique'\)\}<\/span>\s*<\/button>/,
  btnReplacement
);

content = content.replace(
  /\{audioMode === 'recipe' \n\s*\? 'Generate recipe by uploading music files' \n\s*: 'Upload music files for suggested improvements'\}/g,
  "{audioMode === 'recipe' ? 'Generate recipe by uploading music files' : audioMode === 'album' ? 'Upload album tracks for cohesive mastering' : 'Upload music files for suggested improvements'}"
);

content = content.replace(
  /\{audioMode === 'critique' && \(/,
  "{(audioMode === 'critique' || audioMode === 'album') && ("
);

content = content.replace(
  /\{audioMode === 'critique' \? t\('critique_context'\) : t\('vibe_context'\)\}/g,
  "{audioMode === 'album' ? 'Album Theme / Context' : (audioMode === 'critique' ? t('critique_context') : t('vibe_context'))}"
);

content = content.replace(
  /placeholder=\{audioMode === 'critique' \n\s*\? t\('critique_context_placeholder', \{ artist: placeholderArtist \}\)\n\s*: t\('vibe_context_placeholder', \{ artist: placeholderArtist \}\)\}/g,
  "placeholder={audioMode === 'album' ? 'Describe the general vibe of the album...' : (audioMode === 'critique' ? t('critique_context_placeholder', { artist: placeholderArtist }) : t('vibe_context_placeholder', { artist: placeholderArtist }))}"
);

content = content.replace(
  /Drag & Drop All Your Stems Here/g,
  "{audioMode === 'album' ? 'Drag & Drop All Your Album Tracks Here' : 'Drag & Drop All Your Stems Here'}"
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Patched UI");
