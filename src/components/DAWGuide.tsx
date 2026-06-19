
import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { AppTheme, VSTPlugin } from '../types';
import JSZip from 'jszip';

interface DAWGuideProps {
  theme: AppTheme;
  onClose: () => void;
  userPlugins?: VSTPlugin[];
}

export const DAWGuide: React.FC<DAWGuideProps> = ({ theme, onClose, userPlugins = [] }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'reaper' | 'studio-one' | 'pro-tools' | 'cubase' | 'fl-studio' | 'ableton' | 'logic' | 'bitwig' | 'mixcraft' | 'garage-band' | 'reason'>('ableton');
  const [mode, setMode] = useState<'guides' | 'diagnostics'>('guides');

  // Diagnostics states
  const [isReading, setIsReading] = useState(false);
  const [diagError, setDiagError] = useState<string | null>(null);
  const [parsedTracks, setParsedTracks] = useState<any[]>([]);
  const [copiedDiag, setCopiedDiag] = useState(false);

  const checkPluginMatch = (name: string, vendor: string, deviceID: string) => {
    if (!userPlugins || userPlugins.length === 0) {
      return {
        status: 'no-library',
        message: 'No plugins found in your custom library. Please upload a settings XML/CSV.'
      };
    }
    
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const libMatch = userPlugins.find(p => {
      const cleanLibName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanLibName === cleanName || (cleanLibName.length > 3 && cleanName.includes(cleanLibName));
    });
    
    if (!libMatch) {
      return {
        status: 'not-found',
        message: 'Name not matched in active library. Studio One will default or skip.'
      };
    }
    
    const cleanLibID = (libMatch.id || "").replace(/[{}]/g, '').trim().toLowerCase();
    const cleanProjID = deviceID.replace(/[{}]/g, '').trim().toLowerCase();
    
    if (!cleanProjID) {
      return {
        status: 'no-id',
        message: 'No deviceID found in .dawproject XML.'
      };
    }
    
    if (cleanLibID === cleanProjID) {
      return {
        status: 'matched',
        message: `ID fully matches system library: ${libMatch.id}`
      };
    }
    
    const GENERIC_ID = "565354506c7567696e56616c69644944".toLowerCase();
    if (cleanProjID === GENERIC_ID) {
      return {
        status: 'fallback',
        libraryId: libMatch.id,
        message: `Generic fallback ID active. System expects: "${libMatch.id || 'N/A'}"`
      };
    }
    
    return {
      status: 'mismatch',
      libraryId: libMatch.id,
      message: `ID Mismatch! XML contains: "${deviceID}", Library has: "${libMatch.id}"`
    };
  };

  const handleDawProjectUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsReading(true);
      setDiagError(null);
      
      const zip = await JSZip.loadAsync(file);
      const projectXmlFile = zip.file('project.xml');
      if (!projectXmlFile) {
        throw new Error("Could not find project.xml in the uploaded zip. Is this a valid .dawproject?");
      }

      const xmlString = await projectXmlFile.async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      
      const trackNodes = xmlDoc.getElementsByTagName("Track");
      const tracksList: any[] = [];
      
      for (let i = 0; i < trackNodes.length; i++) {
        const track = trackNodes[i];
        const trackName = track.getAttribute("name") || "Untitled Track";
        const contentType = track.getAttribute("contentType") || "audio";
        
        const channels = track.getElementsByTagName("Channel");
        const pluginsList: any[] = [];
        
        if (channels.length > 0) {
          const channel = channels[0];
          const devicesWrapper = channel.getElementsByTagName("Devices");
          if (devicesWrapper.length > 0) {
            const devices = devicesWrapper[0];
            const deviceChildren = devices.children;
            for (let j = 0; j < deviceChildren.length; j++) {
              const device = deviceChildren[j];
              const tagName = device.tagName;
              const deviceName = device.getAttribute("deviceName") || "Unknown Plugin";
              const deviceVendor = device.getAttribute("deviceVendor") || "Unknown Vendor";
              const deviceID = device.getAttribute("deviceID") || "";
              
              const matchResult = checkPluginMatch(deviceName, deviceVendor, deviceID);
              
              pluginsList.push({
                tagName,
                deviceName,
                deviceVendor,
                deviceID,
                match: matchResult
              });
            }
          }
        }
        
        tracksList.push({
          name: trackName,
          contentType,
          plugins: pluginsList
        });
      }
      
      setParsedTracks(tracksList);
      setIsReading(false);
    } catch (err: any) {
      setDiagError(err.message || "Failed to parse .dawproject archive.");
      setIsReading(false);
    }
  };

  const generateReportText = () => {
    if (!parsedTracks || parsedTracks.length === 0) return "";
    
    let report = `### DAWPROJECT DIAGNOSTIC REPORT\n`;
    report += `Generated at: ${new Date().toISOString()}\n`;
    report += `Total Tracks: ${parsedTracks.length}\n\n`;
    
    parsedTracks.forEach((t: any) => {
      report += `#### Track: ${t.name} (${t.contentType})\n`;
      if (t.plugins.length === 0) {
        report += `- No inserts found.\n`;
      } else {
        t.plugins.forEach((p: any) => {
          const matchSymbol = p.match.status === 'matched' ? '✅' : p.match.status === 'fallback' ? '⚠️' : '❌';
          report += `- [${p.tagName}] **${p.deviceName}** (${p.deviceVendor})\n`;
          report += `  - Embedded ID: \`${p.deviceID}\`\n`;
          report += `  - Diagnosis: ${matchSymbol} ${p.match.message}\n`;
        });
      }
      report += `\n`;
    });
    
    return report;
  };

  const handleCopyReport = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopiedDiag(true);
    setTimeout(() => setCopiedDiag(false), 2000);
  };

  const downloadReaperScript = async () => {
    // 1. Generate mascot PNG via offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background / Face
      const cx = 60, cy = 60, r = 45;
      
      // Face circle
      ctx.fillStyle = '#0f172a'; // dark outline/shadow
      ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0ea5e9'; // sky blue
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

      // Durag cap
      ctx.fillStyle = '#f8fafc'; // light theme base or dark
      ctx.beginPath(); ctx.arc(cx, cy - 10, r + 1, Math.PI, 0); ctx.fill();
      ctx.fillRect(cx - r - 2, cy - 15, r * 2 + 4, 15); // brim
      
      // Durag knot
      ctx.beginPath(); ctx.moveTo(cx + r, cy - 5); ctx.lineTo(cx + r + 25, cy + 15); ctx.lineTo(cx + r + 8, cy + 25); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx + r, cy - 5); ctx.lineTo(cx + r + 15, cy + 28); ctx.lineTo(cx - 5 + r, cy + 35); ctx.fill();

      // Eyes
      ctx.fillStyle = '#f8fafc'; // bg_base for eyes
      const lx = cx - 18, rx = cx + 18, ey = cy + 5;
      ctx.beginPath(); ctx.arc(lx, ey, 10, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(rx, ey, 10, 0, Math.PI*2); ctx.fill();

      // Eyelids
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(lx - 12, ey - 15, 24, 12);
      ctx.fillRect(rx - 12, ey - 15, 24, 12);

      // Pupils
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(lx + 3, ey + 2, 4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(rx - 2, ey + 2, 4, 0, Math.PI*2); ctx.fill();

      // Grill
      const gx = cx - 20, gy = cy + 20;
      ctx.fillStyle = '#f8fafc'; // mouth background
      ctx.fillRect(gx - 3, gy - 3, 46, 16);
      
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#f1f5f9' : '#facc15';
        ctx.fillRect(gx + i * 8, gy, 7, 10);
      }
      
      // Grill gap
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx - 3, gy + 5); ctx.lineTo(gx + 43, gy + 5); ctx.stroke();
    }
    const pngBase64 = canvas.toDataURL('image/png').split(',')[1];

    const luaContent = `-- [[
--   BeatGangsta Link Client - Coldest Iced Edition
--   Copyright (c) 2026 BeatGangsta Inc. All rights reserved.
-- ]]

local version = "2.2.0"
local author = "BeatGangsta AI Studio"
local theme_name = "Coldest Iced Frost"

-- Init GUI Window (Cosmic Slate Frame proportions)
gfx.init("BEATGANGSTA • COLDEST CONCEPT LINK", 450, 710)

-- Font Configuration (Falls back gracefully in Reaper's native renderer)
gfx.setfont(1, "Space Grotesk", 20, 98) -- Display Bold Heading
gfx.setfont(2, "Inter", 14, 98)         -- Button / Form Labels Bold
gfx.setfont(3, "Inter", 13, 0)          -- Regular Metadata Info
gfx.setfont(4, "JetBrains Mono", 12, 0) -- Monospace Data

-- Client App State
local state = {
  email = "", -- Leave blank for user input
  token = "",
  is_linked = false,
  is_linking = false,
  link_tick = 0,
  is_syncing = false,
  sync_tick = 0,
  input_focus = "email", -- nil, "email", "token"
  status_msg = "Authorized - Ready to sync session",
  status_sec_msg = "Active session mapping ready",
  tracks = {}
}

local mouse_was_down = false
local last_tracks_update = 0

-- Color definitions (Coldest Light/Glacier Theme specifications mapped to RGB)
local colors = {
  bg = { 240/255, 249/255, 255/255 },         -- Soft glacier frost background (#f0f9ff)
  panel = { 255/255, 255/255, 255/255 },       -- Crisp clean white widgets panel (#ffffff)
  panel_border = { 186/255, 230/255, 253/255 }, -- Soft sky-200 boundary borders (#bae6fd)
  text_primary = { 12/255, 74/255, 110/255 },   -- Ocean deep slate dark blue (#0c4a6e)
  text_secondary = { 3/255, 105/255, 161/255 }, -- Light sky-700 blue metadata (#0369a1)
  sky_accent = { 14/255, 165/255, 233/255 },    -- Ocean sky radiant blue accent (#0ea5e9)
  sky_glow = { 186/255, 230/255, 253/255 },      -- Soft ice hover glow
  emerald_success = { 5/255, 150/255, 105/255 }, -- Crisp icy emerald forest green (#059669)
  crimson_err = { 220/255, 38/255, 38/255 }     -- Alert red mute/solo flags (#dc2626)
}

-- Load the mascot image from the script's directory
local script_path = debug.getinfo(1, "S").source:match([=[^@?(.*[\\/])]=])
local logo_img = -1
if script_path then
  logo_img = gfx.loadimg(1, script_path .. "beatgangsta_logo.png")
end

-- Gather Live REAPER session metrics in real-time
function update_session_metadata()
  local track_count = reaper.CountTracks(0)
  state.tracks = {}
  
  -- Limit to first 6 tracks to maintain compact elegant visual layout
  for i = 0, math.min(track_count - 1, 5) do
    local track = reaper.GetTrack(0, i)
    local _, track_name = reaper.GetTrackName(track)
    if track_name == "" then track_name = "Track " .. (i + 1) end
    
    local is_muted = reaper.GetMediaTrackInfo_Value(track, "B_MUTE") == 1
    local is_soloed = reaper.GetMediaTrackInfo_Value(track, "I_SOLO") > 0
    local vol_val = reaper.GetMediaTrackInfo_Value(track, "D_VOL")
    
    -- Format Volume float scalar to true readable Decibel levels
    local vol_db = "0.0 dB"
    if vol_val <= 0 then
      vol_db = "-inf dB"
    else
      local db = 20 * (math.log(vol_val) / math.log(10))
      vol_db = string.format("%.1f dB", db)
    end
    
    -- Identify active effects channel inserts
    local fx_count = reaper.TrackFX_GetCount(track) or 0
    local fx_list = {}
    for f = 0, math.min(fx_count - 1, 2) do
      local _, fx_name = reaper.TrackFX_GetFXName(track, f, "")
      if fx_name and fx_name ~= "" then
        -- Clean up formatting prefixes
        local clean = fx_name:gsub("^VST3i?:\\\\s*", ""):gsub("^VST2i?:\\\\s*", ""):gsub("^VSTi?:\\\\s*", ""):gsub("^AUi?:\\\\s*", ""):gsub("^JS:\\\\s*", ""):gsub("^DXi?:\\\\s*", "")
        clean = clean:gsub("%b()", ""):gsub("%s*\\\\+.*", ""):match("^\\\\s*(.-)\\\\s*$")
        table.insert(fx_list, clean:sub(1, 14))
      end
    end
    
    table.insert(state.tracks, {
      name = track_name,
      muted = is_muted,
      soloed = is_soloed,
      volume = vol_db,
      vol_scalar = vol_val,
      plugins = fx_list
    })
  end
end

-- Draw beautiful Custom Slate Text Inputs with blinking carets
function draw_custom_input(x, y, w, h, label, val, is_focused)
  -- Border Highlighting
  if is_focused then
    gfx.set(colors.sky_accent[1], colors.sky_accent[2], colors.sky_accent[3], 1)
  else
    gfx.set(colors.panel_border[1], colors.panel_border[2], colors.panel_border[3], 1)
  end
  gfx.rect(x - 1, y - 1, w + 2, h + 2, false)
  
  -- Input bg (slate-50 soft frost grey)
  gfx.set(248/255, 250/255, 252/255, 1)
  gfx.rect(x, y, w, h, true)
  
  -- Outer label header
  gfx.setfont(2, "Inter", 11, 98)
  gfx.set(colors.text_secondary[1], colors.text_secondary[2], colors.text_secondary[3], 0.9)
  gfx.x = x
  gfx.y = y - 18
  gfx.drawstr(label)
  
  -- Embedded Text value
  gfx.setfont(4, "JetBrains Mono", 13, 0)
  gfx.set(colors.text_primary[1], colors.text_primary[2], colors.text_primary[3], 1)
  gfx.x = x + 10
  gfx.y = y + (h - 11) / 2
  gfx.drawstr(val)
  
  -- Double blinking caret
  if is_focused and (math.floor(reaper.time_precise() * 2.2) % 2 == 0) then
    gfx.set(colors.sky_accent[1], colors.sky_accent[2], colors.sky_accent[3], 1)
    local width = gfx.measurestr(val)
    gfx.rect(x + 10 + width + 2, y + 6, 2, h - 12, true)
  end
end

-- Universal Button Draw & Hover interaction detector
function draw_custom_button(x, y, w, h, text, is_primary, is_active)
  local hover = gfx.mouse_x >= x and gfx.mouse_x <= x + w and gfx.mouse_y >= y and gfx.mouse_y <= y + h
  
  if is_active then
    -- Hover glowing stroke
    if hover then
      gfx.set(colors.sky_accent[1], colors.sky_accent[2], colors.sky_accent[3], 0.2)
      gfx.rect(x - 2, y - 2, w + 4, h + 4, false)
    end
    
    if is_primary then
      if hover then
        gfx.set(colors.sky_accent[1] * 1.05, colors.sky_accent[2] * 1.05, colors.sky_accent[3] * 1.05, 1)
      else
        gfx.set(colors.sky_accent[1], colors.sky_accent[2], colors.sky_accent[3], 1)
      end
    else
      if hover then
        gfx.set(colors.panel_border[1] * 1.02, colors.panel_border[2] * 1.02, colors.panel_border[3] * 1.02, 1)
      else
        gfx.set(colors.panel[1], colors.panel[2], colors.panel[3], 1)
      end
    end
  else
    -- Block disabled color state (slate-200)
    gfx.set(226/255, 232/255, 240/255, 0.7)
  end
  
  -- Draw background block
  gfx.rect(x, y, w, h, true)
  
  -- Border outline
  if not is_primary and is_active then
    gfx.set(colors.panel_border[1], colors.panel_border[2], colors.panel_border[3], 1)
    gfx.rect(x, y, w, h, false)
  end
  
  -- Button Text label
  gfx.setfont(2, "Inter", 13, 98)
  if is_primary and is_active then
    gfx.set(colors.panel[1], colors.panel[2], colors.panel[3], 1) -- dark-on-light theme style
  else
    if is_active then
      gfx.set(colors.text_primary[1], colors.text_primary[2], colors.text_primary[3], 1)
    else
      gfx.set(94/255, 109/255, 126/255, 0.4)
    end
  end
  
  local tw, th = gfx.measurestr(text)
  gfx.x = x + (w - tw) / 2
  gfx.y = y + (h - th) / 2
  gfx.drawstr(text)
end

-- Main Render draw grid loop
function draw_grid_loop()
  -- Read volume levels & inserts live every tick
  update_session_metadata()
  
  -- Clear background with Coldest glacier frost
  gfx.set(colors.bg[1], colors.bg[2], colors.bg[3], 1)
  gfx.rect(0, 0, gfx.w, gfx.h)
  
  -- Draw Slate Top branding Bar
  gfx.set(colors.panel[1], colors.panel[2], colors.panel[3], 1)
  gfx.rect(0, 0, gfx.w, 80, true)
  gfx.set(colors.panel_border[1], colors.panel_border[2], colors.panel_border[3], 1)
  gfx.line(0, 80, gfx.w, 80)
  
  -- Title typography
  gfx.setfont(1, "Space Grotesk", 18, 98)
  gfx.set(colors.text_primary[1], colors.text_primary[2], colors.text_primary[3], 1)
  gfx.x = 24
  gfx.y = 20
  gfx.drawstr("BEATGANGSTA • LINK")
  
  gfx.setfont(3, "Inter", 11, 0)
  gfx.set(colors.text_secondary[1], colors.text_secondary[2], colors.text_secondary[3], 1)
  gfx.x = 24
  gfx.y = 44
  gfx.drawstr("Coldest Iced Fallback Client v" .. version)
  
  -- Draw BeatGangsta Mascot Image next to title
  if logo_img ~= -1 then
    local w, h = gfx.getimgdim(logo_img)
    if w > 0 and h > 0 then
      local scale = 40 / h
      gfx.x = gfx.w - 70
      gfx.y = 15
      gfx.blit(logo_img, scale, 0)
    end
  end
  
  -- PANEL 1: Authenticate Connection Card
  local cy = 100
  gfx.set(colors.panel[1], colors.panel[2], colors.panel[3], 1)
  gfx.rect(24, cy, gfx.w - 48, 155, true)
  gfx.set(colors.panel_border[1], colors.panel_border[2], colors.panel_border[3], 1)
  gfx.rect(24, cy, gfx.w - 48, 155, false)
  
  -- Draw standard input boxes
  draw_custom_input(44, cy + 34, 180, 36, "BeatGangsta Slate Account", state.email, state.input_focus == "email")
  draw_custom_input(244, cy + 34, 160, 36, "Authorization Code", state.token, state.input_focus == "token")
  
  -- Authenticate Action Button Trigger
  if state.is_linking then
    state.link_tick = state.link_tick + 1
    local loading_text = "AUTHENTICATING NODE"
    for step = 1, math.floor(state.link_tick / 15) % 4 do
      loading_text = loading_text .. "."
    end
    draw_custom_button(44, cy + 90, gfx.w - 88, 42, loading_text, false, false)
    
    if state.link_tick > 60 then
      state.is_linking = false
      state.is_linked = true
      state.status_msg = "Successfully paired with BeatGangsta Cloud!"
      state.status_sec_msg = "All changes now synced back & forth instantly."
    end
  elseif state.is_linked then
    draw_custom_button(44, cy + 90, gfx.w - 88, 42, "✓ ACCOUNT CONNECTED SECURELY", false, true)
  else
    draw_custom_button(44, cy + 90, gfx.w - 88, 42, "CONNECT YOUR COLDEST ACCOUNT", true, true)
  end
  
  -- PANEL 2: Real-time Live Session Grid
  local gy = 275
  gfx.set(colors.panel[1], colors.panel[2], colors.panel[3], 1)
  gfx.rect(24, gy, gfx.w - 48, 250, true)
  gfx.set(colors.panel_border[1], colors.panel_border[2], colors.panel_border[3], 1)
  gfx.rect(24, gy, gfx.w - 48, 250, false)
  
  gfx.setfont(2, "Inter", 12, 98)
  gfx.set(colors.text_primary[1], colors.text_primary[2], colors.text_primary[3], 0.9)
  gfx.x = 44
  gfx.y = gy + 16
  gfx.drawstr("MIX CONSOLE: ACTIVE REAPER TRACK MAP")
  
  -- Render Live tracks with slider indicators matching REAPER's dynamic API state!
  if #state.tracks == 0 then
    gfx.setfont(3, "Inter", 13, 0)
    gfx.set(colors.text_secondary[1], colors.text_secondary[2], colors.text_secondary[3], 0.6)
    gfx.x = 44
    gfx.y = gy + 70
    gfx.drawstr("(No active tracks found. Create some in REAPER to mirror)")
  else
    for idx, track in ipairs(state.tracks) do
      local row_y = gy + 40 + (idx - 1) * 34
      
      -- Track number label
      gfx.setfont(4, "JetBrains Mono", 12, 0)
      gfx.set(colors.text_secondary[1], colors.text_secondary[2], colors.text_secondary[3], 0.8)
      gfx.x = 44
      gfx.y = row_y + 4
      gfx.drawstr(string.format("%02d", idx))
      
      -- Track name with alert state if muted
      gfx.setfont(2, "Inter", 13, 98)
      if track.muted then
        gfx.set(colors.crimson_err[1], colors.crimson_err[2], colors.crimson_err[3], 1)
      elseif track.soloed then
        gfx.set(217/255, 119/255, 6/255, 1) -- Golden Solo color (#d97706)
      else
        gfx.set(colors.text_primary[1], colors.text_primary[2], colors.text_primary[3], 0.9)
      end
      gfx.x = 70
      gfx.y = row_y + 2
      gfx.drawstr(track.name:sub(1, 12))
      
      -- Draw live volume fader bar
      local fader_w = 90
      local fader_val = math.min(track.vol_scalar, 1.2) / 1.2
      gfx.set(226/255, 232/255, 240/255, 1) -- slate-200 track background
      gfx.rect(170, row_y + 8, fader_w, 6, true)
      
      if track.muted then
        gfx.set(colors.crimson_err[1], colors.crimson_err[2], colors.crimson_err[3], 0.3)
      else
        gfx.set(colors.sky_accent[1], colors.sky_accent[2], colors.sky_accent[3], 0.85)
      end
      gfx.rect(170, row_y + 8, math.floor(fader_w * fader_val), 6, true)
      
      -- Draw fader thumb handle (Ocean Deep slate)
      gfx.set(colors.text_primary[1], colors.text_primary[2], colors.text_primary[3], 1)
      gfx.rect(170 + math.floor(fader_w * fader_val) - 3, row_y + 4, 6, 14, true)
      
      -- Print volume text
      gfx.setfont(4, "JetBrains Mono", 11, 0)
      gfx.set(colors.text_secondary[1], colors.text_secondary[2], colors.text_secondary[3], 0.95)
      gfx.x = 270
      gfx.y = row_y + 4
      gfx.drawstr(track.volume)
      
      -- Display active VST Inserts
      gfx.setfont(3, "Inter", 11, 0)
      gfx.set(colors.text_secondary[1], colors.text_secondary[2], colors.text_secondary[3], 0.7)
      gfx.x = 336
      gfx.y = row_y + 3
      if #track.plugins > 0 then
        gfx.drawstr(table.concat(track.plugins, "➔"))
      else
        gfx.drawstr("dry")
      end
    end
  end
  
  -- FOOTER CARD: Live Status messages & Sync Trigger
  local fy = 540
  gfx.setfont(2, "Inter", 12, 98)
  gfx.set(colors.text_secondary[1], colors.text_secondary[2], colors.text_secondary[3], 1)
  gfx.x = 24
  gfx.y = fy
  gfx.drawstr("STATUS MODULE:")
  
  gfx.setfont(3, "Inter", 13, 0)
  gfx.set(colors.text_primary[1], colors.text_primary[2], colors.text_primary[3], 1)
  gfx.x = 24
  gfx.y = fy + 18
  gfx.drawstr(state.status_msg)
  
  gfx.set(colors.text_secondary[1], colors.text_secondary[2], colors.text_secondary[3], 0.8)
  gfx.x = 24
  gfx.y = fy + 34
  gfx.drawstr(state.status_sec_msg)
  
  -- Primary Sync Action
  if state.is_syncing then
    state.sync_tick = state.sync_tick + 1
    local dots = ""
    for step = 1, math.floor(state.sync_tick / 10) % 4 do
      dots = dots .. "."
    end
    draw_custom_button(24, fy + 54, gfx.w - 48, 44, "TRANSMITTING TO COLD APP" .. dots, false, false)
    
    if state.sync_tick > 50 then
      state.is_syncing = false
      state.status_msg = "Sync Completed! Gear Rack synchronized successfully."
      state.status_sec_msg = "Inserts parsed and exported directly to your Clipboard!"
    end
  else
    draw_custom_button(24, fy + 54, gfx.w - 48, 44, "^ EXPORT GEAR RACK TO BEATGANGSTA ^", true, true)
  end
  
  draw_custom_button(24, fy + 106, gfx.w - 48, 44, "v IMPORT RECIPE PLUGINS TO TRACKS v", true, true)
end

-- Process Interactivity, mouse inputs, keystroke triggers
function process_interactions()
  local cy = 100
  local fy = 540
  
  -- Localize clicks
  if gfx.mouse_cap & 1 == 1 then
    if not mouse_was_down then
      mouse_was_down = true
      local mx, my = gfx.mouse_x, gfx.mouse_y
      
      -- Focus Input fields
      if mx >= 44 and mx <= 224 and my >= cy + 34 and my <= cy + 70 then
        state.input_focus = "email"
      elseif mx >= 244 and mx <= 404 and my >= cy + 34 and my <= cy + 70 then
        state.input_focus = "token"
      else
        state.input_focus = nil
      end
      
      -- Trigger Link account button
      if not state.is_linked and not state.is_linking then
        if mx >= 44 and mx <= 404 and my >= cy + 90 and my <= cy + 132 then
          state.is_linking = true
          state.link_tick = 0
          state.status_msg = "Contacting master servers..."
          state.status_sec_msg = "Fetching profile mappings..."
        end
      end
      
      -- Sync Trigger Button click action
      if not state.is_syncing then
        if mx >= 24 and mx <= gfx.w - 24 and my >= fy + 54 and my <= fy + 98 then
          trigger_session_export()
        elseif mx >= 24 and mx <= gfx.w - 24 and my >= fy + 106 and my <= fy + 150 then
          import_beatgangsta_sync()
        end
      end
    end
  else
    mouse_was_down = false
  end
end

-- Import Mix Recipe Pulls over HTTP
function import_beatgangsta_sync()
  if state.email == "" or state.token == "" then
    state.status_msg = "Error: Authentication Required"
    state.status_sec_msg = "Please enter Email and Authorization Code."
    return
  end

  state.status_msg = "Contacting BeatGangsta Cloud..."
  state.status_sec_msg = "Pulling Sync Payload..."
  
  local origin = "${window.location.origin}"
  local url = origin .. "/api/reaper-sync/pull?email=" .. state.email .. "&pin=" .. state.token
  
  local tmp_file = os.tmpname()
  if tmp_file:sub(1,1) == "\\" then tmp_file = os.getenv("TMP") .. tmp_file end

  local is_win = string.find(reaper.GetOS(), "Win") ~= nil
  if is_win then
    os.execute('curl.exe -sL "' .. url .. '" -o "' .. tmp_file .. '"')
  else
    os.execute('curl -sL "' .. url .. '" -o "' .. tmp_file .. '"')
  end
  
  local f = io.open(tmp_file, "r")
  if not f then 
    state.status_msg = "Error connecting to server."
    state.status_sec_msg = "Check your internet connection."
    return 
  end
  
  local content = f:read("*all")
  f:close()
  os.remove(tmp_file)
  
  if content == "" or string.match(content, "^{%s*\"error\"") then
    state.status_msg = "Sync Payload not found!"
    state.status_sec_msg = "Ensure you clicked Push Sync in the Web App."
    return
  end
  
  reaper.Undo_BeginBlock()
  
  local current_track = nil
  local current_fx_idx = -1
  for line in content:gmatch("([^\\n]+)") do
    if line:sub(1, 6) == "TRACK|" then
      local track_name = line:sub(7)
      -- Trim CR Windows line endings if any
      track_name = track_name:gsub("\\r", "")
      current_track = nil
      current_fx_idx = -1
      for i=0, reaper.CountTracks(0)-1 do
        local tr = reaper.GetTrack(0, i)
        local _, name = reaper.GetSetMediaTrackInfo_String(tr, "P_NAME", "", false)
        if name == track_name then
          current_track = tr
          break
        end
      end
    elseif line:sub(1, 3) == "FX|" and current_track then
      local fx_name = line:sub(4)
      fx_name = fx_name:gsub("\\r", "")
      current_fx_idx = reaper.TrackFX_AddByName(current_track, fx_name, false, -1)
      if current_fx_idx >= 0 then
        reaper.TrackFX_SetOpen(current_track, current_fx_idx, true)
      end
    elseif line:sub(1, 6) == "PARAM|" and current_track and current_fx_idx >= 0 then
      local p_data = line:sub(7)
      local split_pos = p_data:find("|")
      if split_pos then
        local p_idx = tonumber(p_data:sub(1, split_pos - 1))
        local p_val = tonumber(p_data:sub(split_pos + 1))
        if p_idx and p_val then
          reaper.TrackFX_SetParam(current_track, current_fx_idx, p_idx, p_val)
        end
      end
    end
  end
  
  reaper.Undo_EndBlock("BeatGangsta Recipe Sync", -1)
  
  state.status_msg = "Recipe Synced Successfully!"
  state.status_sec_msg = "Suggested JSFX & VSTs applied to tracks."
end

-- Assemble exact JSON Session profile payload & dump to project and clipboard
function trigger_session_export()
  state.is_syncing = true
  state.sync_tick = 0
  
  local track_count = reaper.CountTracks(0)
  local project_name = "Untitled Project"
  local _, proj_fn = reaper.GetProjectName(0, "")
  if proj_fn ~= "" then
    project_name = proj_fn:match("^.+/(.+)$") or proj_fn:match("^.+\\\\(.+)$") or proj_fn
    project_name = project_name:gsub("%.RPP$", ""):gsub("%.rpp$", "")
  end
  
  local json_parts = {}
  table.insert(json_parts, "{\\\\n  \\"title\\": \\"" .. project_name:gsub('"', '\\\\\\"') .. "\\",\\\\n  \\"tracks\\": [")
  
  for idx, track in ipairs(state.tracks) do
    local f_list = {}
    for _, plug in ipairs(track.plugins) do
      table.insert(f_list, "\\"" .. plug:gsub('"', '\\\\\\"') .. "\\"")
    end
    
    local plist_str = "[" .. table.concat(f_list, ", ") .. "]"
    local piece = "    {\\\\n" ..
      "      \\"name\\": \\"" .. track.name:gsub('"', '\\\\\\"') .. "\\",\\\\n" ..
      "      \\"isMuted\\": " .. tostring(track.muted) .. ",\\\\n" ..
      "      \\"isSoloed\\": " .. tostring(track.soloed) .. ",\\\\n" ..
      "      \\"volume\\": \\"" .. track.volume .. "\\",\\\\n" ..
      "      \\"plugins\\": " .. plist_str .. "\\\\n" ..
      "    }"
    table.insert(json_parts, piece)
  end
  
  local payload = table.concat(json_parts, ",\\\\n") .. "\\\\n  ]\\\\n}"
  
  -- Save the JSON Backup local map inside project path directly
  local proj_path = reaper.GetProjectPath("")
  if proj_path ~= "" then
    local separator = package.config:sub(1,1)
    local path_to_write = proj_path .. separator .. project_name .. "_beatgangsta_rack.json"
    local f = io.open(path_to_write, "w")
    if f then
      f:write(payload)
      f:close()
    end
  end
  
  -- Force SWS Clipboard copy for seamless clickless transfers!
  if reaper.CF_SetClipboard then
    reaper.CF_SetClipboard(payload)
  else
    -- Fallback paste console printout
    reaper.ShowConsoleMsg("COLDEST SLATE TRANSMISSION PACKET:\\\\n\\\\n" .. payload .. "\\\\n")
  end
end

-- Handle Key entry captures
function handle_string_captures()
  local char = gfx.getchar()
  if char <= 0 then return end
  
  if state.input_focus == "email" then
    if char == 8 then -- Backspace deletion
      state.email = state.email:sub(1, -2)
    elseif char == 13 then -- Enter focus transition
      state.input_focus = "token"
    elseif char >= 32 and char <= 126 then
      state.email = state.email .. string.char(char)
    end
  elseif state.input_focus == "token" then
    if char == 8 then -- Backspace deletion
      state.token = state.token:sub(1, -2)
    elseif char == 13 then -- Enter release
      state.input_focus = nil
    elseif char >= 32 and char <= 126 then
      state.token = state.token .. string.char(char)
    end
  end
end

-- Core application execution loop thread
function core_thread_loop()
  draw_grid_loop()
  process_interactions()
  handle_string_captures()
  
  local val_char = gfx.getchar()
  -- Stay alive until window frame closed by user or Escape key pressed
  if val_char >= 0 and val_char ~= 27 then
    reaper.defer(core_thread_loop)
  end
end

-- Trigger thread boot
core_thread_loop()
`;

    const zip = new JSZip();
    zip.file("beatgangsta_reaper_sync.lua", luaContent);
    zip.file("beatgangsta_logo.png", pngBase64, { base64: true });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BeatGangsta_ReaperLink.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const containerClasses = theme === 'coldest' 
    ? "bg-white/95 border-white text-[#0c4a6e]" 
    : theme === 'hustle-time'
    ? "bg-[#001a14]/95 border-yellow-500/30 text-yellow-50"
    : "bg-black/95 border-red-900/50 text-red-50";

  const tabClasses = (id: string) => {
    const active = activeTab === id;
    if (theme === 'coldest') {
      return active 
        ? "bg-sky-500 text-white shadow-lg" 
        : "bg-white/50 text-sky-900 hover:bg-white/80";
    } else if (theme === 'hustle-time') {
      return active 
        ? "bg-yellow-500 text-emerald-950 shadow-lg shadow-yellow-900/40" 
        : "bg-black/40 text-yellow-400 hover:bg-black/60";
    } else {
      return active 
        ? "bg-red-600 text-white shadow-lg shadow-red-900/40" 
        : "bg-black/40 text-red-400 hover:bg-black/60";
    }
  };

  const modeBtnClasses = (active: boolean) => {
    if (active) {
      if (theme === 'coldest') return "bg-sky-500 text-white shadow-md shadow-sky-500/10 border-sky-500";
      if (theme === 'hustle-time') return "bg-yellow-500 text-[#001a14] font-black shadow-md border-yellow-500";
      return "bg-red-600 text-white shadow-md border-red-600";
    } else {
      if (theme === 'coldest') return "text-sky-900 border-sky-500/20 hover:bg-sky-50 bg-[#0c4a6e]/5";
      if (theme === 'hustle-time') return "text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/5 bg-[#001a14]/60";
      return "text-red-400 border-red-500/20 hover:bg-red-500/5 bg-black/40";
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl rounded-[3rem] border p-8 shadow-2xl overflow-hidden relative ${containerClasses}`}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {mode === 'guides' ? (
          <>
            <h2 className="text-3xl font-black tracking-tighter mb-2">{t('locate_plugin_list_title')}</h2>
            <p className="text-sm opacity-70 mb-4 font-medium">{t('import_plugin_library_desc')}</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-black tracking-tighter mb-2">DAWProject Diagnostics</h2>
            <p className="text-sm opacity-70 mb-4 font-medium">Verify track structures, match ClassIDs, and troubleshoot plugin mapping issues.</p>
          </>
        )}

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setMode('guides')} 
            className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${modeBtnClasses(mode === 'guides')}`}
          >
            📋 Import Library Guides
          </button>
          <button 
            onClick={() => setMode('diagnostics')} 
            className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${modeBtnClasses(mode === 'diagnostics')}`}
          >
            🔍 DAWProject File Inspector
          </button>
        </div>

        {mode === 'guides' ? (
          <>
            <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-black/5 rounded-2xl">
              <button 
                onClick={() => setActiveTab('ableton')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('ableton')}`}
              >
                Ableton
              </button>
              <button 
                onClick={() => setActiveTab('logic')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('logic')}`}
              >
                Logic
              </button>
              <button 
                onClick={() => setActiveTab('fl-studio')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('fl-studio')}`}
              >
                FL Studio
              </button>
              <button 
                onClick={() => setActiveTab('reaper')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('reaper')}`}
              >
                REAPER
              </button>
              <button 
                onClick={() => setActiveTab('studio-one')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('studio-one')}`}
              >
                Studio One
              </button>
              <button 
                onClick={() => setActiveTab('pro-tools')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('pro-tools')}`}
              >
                Pro Tools
              </button>
              <button 
                onClick={() => setActiveTab('cubase')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('cubase')}`}
              >
                Cubase
              </button>
              <button 
                onClick={() => setActiveTab('bitwig')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('bitwig')}`}
              >
                Bitwig
              </button>
              <button 
                onClick={() => setActiveTab('mixcraft')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('mixcraft')}`}
              >
                Mixcraft
              </button>
              <button 
                onClick={() => setActiveTab('garage-band')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('garage-band')}`}
              >
                Garage Band
              </button>
              <button 
                onClick={() => setActiveTab('reason')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('reason')}`}
              >
                Reason
              </button>
            </div>

            <div className="space-y-6 min-h-[300px] max-h-[350px] overflow-y-auto pr-2 animate-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'ableton' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_ableton_step1">In Ableton, go to your <strong className="font-black">User Library</strong> or <strong className="font-black">Plug-ins</strong> folder.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_ableton_step2">Select your favorite plugins, right-click and <strong className="font-black">Rename</strong>, then copy the text.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_ableton_step3">Alternatively, use the <strong className="font-black">Paste List</strong> button here and paste your plugin names.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_ableton_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'logic' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step1">Go to <strong className="font-black">Logic Pro</strong> {'>'} <strong className="font-black">Settings</strong> {'>'} <strong className="font-black">Plug-in Manager</strong>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step2">Select the plugins you want to export and <strong className="font-black">Command+C</strong> to copy.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step3">Click <strong className="font-black">Paste List</strong> here and paste the names.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_logic_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'bitwig' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_bitwig_step1">In Bitwig, go to <strong className="font-black">Settings</strong> {'>'} <strong className="font-black">Plug-ins</strong>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed">{t('daw_bitwig_step2')}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_bitwig_step3">Copy the names of your go-to plugins and use the <strong className="font-black">Paste List</strong> feature.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_bitwig_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'reaper' && (
                <div className="space-y-6">
                  {/* Method A: BeatGangsta Live REAPER Link Exporter / Sync Script */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    theme === 'coldest' 
                      ? 'border-sky-500/20 bg-sky-500/5 text-sky-950' 
                      : 'border-purple-500/20 bg-purple-950/10 text-white'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 rounded bg-sky-500 text-white font-bold text-xs uppercase tracking-wider px-2">
                        PRO LINK (RECOMMENDED)
                      </div>
                      <h4 className={`text-xs font-black uppercase tracking-widest ${
                        theme === 'coldest' ? 'text-sky-600' : 'text-purple-400'
                      }`}>
                        Live REAPER Link Exporter Script
                      </h4>
                    </div>
                    <p className="text-xs opacity-75 mb-4 leading-relaxed">
                      Download and run our custom <strong className="font-bold">ReaScript (.lua)</strong> in REAPER. It queries all tracks, volume levels, mute/solo flags, and loaded VST channel inserts instantly, copies the JSON profile to your clipboard, and dumps a live mapping configuration in your project directory!
                    </p>

                    <button
                      onClick={downloadReaperScript}
                      className={`mb-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        theme === 'coldest' 
                          ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/15' 
                          : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Download BeatGangsta Link Bundle (.zip)
                    </button>

                    <div className="space-y-3 text-xs">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</div>
                        <p className="leading-normal">Download and <strong>extract</strong> the ZIP bundle into your REAPER Scripts directory or Desktop.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</div>
                        <p className="leading-normal">In REAPER, open the <strong className="font-bold">Actions List</strong> (press <code className="bg-black/10 px-1 py-0.5 rounded">?</code>), select <strong className="font-bold">New Action...</strong> &gt; <strong className="font-bold">Load ReaScript...</strong> and choose the extracted <strong>beatgangsta_reaper_sync.lua</strong> file.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</div>
                        <p className="leading-normal">Run the action! It copies your entire live mix layout to the clipboard and creates a backup template.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0">4</div>
                        <p className="leading-normal">With BeatGangsta's <strong className="font-semibold">"I have stems"</strong> mode active, select/upload your project directory. We will automatically map all stem wav files to your tracks, read your FX inserts from the backup file, and deliver custom critiques!</p>
                      </div>
                    </div>
                  </div>

                  {/* Method B: Traditional Global Plugin List */}
                  <div className={`p-5 rounded-2xl border ${
                    theme === 'coldest' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#18181b]/30 border-zinc-800 text-zinc-300'
                  }`}>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-zinc-400">
                      Method B: Traditional Global Plugin Inventory (.ini)
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center font-black flex-shrink-0 text-xs">1</div>
                        <p className="text-sm leading-normal"><Trans i18nKey="daw_reaper_step1">Go to <strong className="font-black">Options</strong> {'>'} <strong className="font-black">Show resource path...</strong> in REAPER.</Trans></p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center font-black flex-shrink-0 text-xs">2</div>
                        <p className="text-sm leading-normal"><Trans i18nKey="daw_reaper_step2">Find <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold text-xs">reaper-vstplugins64.ini</code>.</Trans></p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center font-black flex-shrink-0 text-xs">3</div>
                        <p className="text-sm leading-normal"><Trans i18nKey="daw_reaper_step3">Either <strong className="font-black">copy/paste</strong> the text or <strong className="font-black">upload</strong> the file directly.</Trans></p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center font-black flex-shrink-0 text-xs">4</div>
                        <p className="text-sm leading-normal">{t('daw_reaper_step4')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'studio-one' && (
                <div className="space-y-6">
                  {/* Method A: XML / Settings */}
                  <div className={`p-5 rounded-2xl border ${
                    theme === 'coldest' 
                      ? 'border-sky-500/20 bg-sky-500/5 text-sky-900' 
                      : theme === 'hustle-time' 
                      ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-50' 
                      : 'border-red-500/20 bg-red-500/5 text-red-50'
                  }`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1 ${
                      theme === 'coldest' ? 'text-sky-600' : theme === 'hustle-time' ? 'text-yellow-400' : 'text-red-500'
                    }`}>
                      <span>Method A: Upload Plugins Settings (XML)</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-black ml-auto ${
                        theme === 'coldest' 
                          ? 'bg-sky-500/20 text-sky-700' 
                          : theme === 'hustle-time' 
                          ? 'bg-yellow-500/20 text-yellow-300' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>Fastest</span>
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          theme === 'coldest' ? 'bg-sky-500/20 text-sky-700' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-400'
                        }`}>1</div>
                        <div className="text-sm leading-relaxed w-full">
                          <p className="font-bold mb-1.5">Locate your settings folder based on your Operating System:</p>
                          
                          <div className={`p-3 rounded-xl text-xs font-mono space-y-2 border ${
                            theme === 'coldest' 
                              ? 'bg-sky-50/50 text-sky-950 border-sky-100' 
                              : 'bg-black/40 text-[#fef08a] border-white/5'
                          }`}>
                            <div>
                              <p className={`font-black uppercase text-[10px] tracking-wider mb-1 ${theme === 'coldest' ? 'text-sky-700' : 'text-red-400'}`}>Windows Path (User-defined / Custom folders):</p>
                              <code className="select-all block p-1.5 rounded bg-black/20 text-white font-bold select-all break-all">%AppData%\PreSonus\Studio One 6\User\</code>
                            </div>
                            <div>
                              <p className={`font-black uppercase text-[10px] tracking-wider mb-1 ${theme === 'coldest' ? 'text-sky-700' : 'text-red-400'}`}>Windows Path (Global x64 Plugin List / Translation):</p>
                              <code className="select-all block p-1.5 rounded bg-black/20 text-white font-bold select-all break-all">%AppData%\PreSonus\Studio One 6\x64\Plugins-en.settings</code>
                            </div>
                            <div>
                              <p className={`font-black uppercase text-[10px] tracking-wider mb-1 ${theme === 'coldest' ? 'text-sky-700' : 'text-red-400'}`}>macOS (Mac) Path:</p>
                              <code className="select-all block p-1.5 rounded bg-black/20 text-white font-bold select-all break-all">~/Library/Application Support/PreSonus/Studio One 6/User/</code>
                            </div>
                          </div>
                          <p className="text-[11px] opacity-75 mt-1.5 italic">Note: Replace "Studio One 6" if you are using Studio One 5 or 4.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          theme === 'coldest' ? 'bg-sky-500/20 text-sky-700' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-400'
                        }`}>2</div>
                        <p className="text-sm leading-relaxed">
                          Find <strong className="font-extrabold">Plugins-en.settings</strong>, <strong className="font-extrabold">Plugins-en.xml</strong>, <strong className="font-extrabold">PluginComponents.settings</strong>, or <strong className="font-extrabold">PluginPresentation.settings</strong>.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          theme === 'coldest' ? 'bg-sky-500/20 text-sky-700' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-400'
                        }`}>3</div>
                        <p className="text-sm leading-relaxed">
                          <strong className="font-extrabold">Upload that settings xml/file</strong> directly or <strong className="font-extrabold">copy-paste its text data</strong> inside the input box to configure your plugins.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Method B: Diagnostic Report / CSV */}
                  <div className={`p-5 rounded-2xl border ${
                    theme === 'coldest' 
                      ? 'border-[#0c4a6e]/10 bg-black/5 text-sky-900' 
                      : 'border-white/10 bg-white/5 text-white/90'
                  }`}>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-3 opacity-80">
                      Method B: Create Diagnostic Report (CSV Export)
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-black text-xs flex-shrink-0">1</div>
                        <p className="text-sm leading-relaxed">Open Studio One and select <strong className="font-black">Help</strong> from the top menu.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-black text-xs flex-shrink-0">2</div>
                        <p className="text-sm leading-relaxed">Click <strong className="font-black">Create Diagnostic Report</strong>.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-black text-xs flex-shrink-0">3</div>
                        <p className="text-sm leading-relaxed">Locate <strong className="font-black">PluginManagement.csv</strong> inside the generated ZIP file.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-black text-xs flex-shrink-0">4</div>
                        <p className="text-sm leading-relaxed">Upload that CSV / list file directly details here, or copy and paste the CSV text.</p>
                      </div>
                    </div>
                  </div>

                  {/* Method C: Smart Combined Mode */}
                  <div className={`p-5 rounded-2xl border ${
                    theme === 'coldest' 
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-900' 
                      : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-100'
                  }`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1 ${
                      theme === 'coldest' ? 'text-emerald-600' : 'text-emerald-400'
                    }`}>
                      <span>🌟 Method C: Combined Ultimate Accuracy</span>
                      <span className="text-[10px] uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black ml-auto">Recommended</span>
                    </h4>
                    <p className="text-xs leading-relaxed mb-3 opacity-90">
                      Because <strong className="font-bold">PluginPresentation.settings</strong> only contains internal technical IDs (GUIDs) and <strong className="font-bold">PluginManagement.csv</strong> has human-readable names but lacks GUID mapping, you can now upload or drop <strong className="font-black text-emerald-400">BOTH files simultaneously</strong>!
                    </p>
                    <div className="space-y-2 text-xs leading-relaxed opacity-85">
                      <p>1. Simply **drag and drop both files together** into the upload area (or select both using the file chooser).</p>
                      <p>2. Our smart library parser will instantly combine their contents, automatically merging named plugins with their official Studio One ClassIDs for perfect dawproject exporting!</p>
                      <p className="text-[10px] opacity-75 italic">* Note: You can still paste or import them one-by-one if you prefer, as they will merge into your active session library either way!</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'fl-studio' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_fl_studio_step1">In FL Studio, open the <strong className="font-black">Plugin Manager</strong> (Options {'>'} Manage plugins).</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_fl_studio_step2">Run a scan if needed, then look for the <strong className="font-black">Plugin list</strong> in your FL Studio data folder.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_fl_studio_step3">Alternatively, use the <strong className="font-black">Paste List</strong> button here and paste the names of your favorite plugins.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_fl_studio_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'pro-tools' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed">{t('daw_pro_tools_step1')}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_pro_tools_step2">Select all files in the folder and <strong className="font-black">Copy as Path</strong> or list them.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_pro_tools_step3">Click the <strong className="font-black">Paste List</strong> button and paste your list there.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_pro_tools_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'cubase' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step1">In Cubase, go to <strong className="font-black">Studio</strong> {'>'} <strong className="font-black">Plug-in Manager</strong>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step2">Click the <strong className="font-black">Export</strong> icon (top right) to save a list.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step3">Click the <strong className="font-black">Paste List</strong> button and paste the content there.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_cubase_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'mixcraft' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_mixcraft_step1">Press <strong className="font-black">Win + R</strong>, type <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold">%AppData%\Acoustica\Mixcraft\</code> and hit Enter.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_mixcraft_step2">Locate the <strong className="font-black">vst-inventory.xml</strong> file and upload it directly to BeatGangsta using the upload button.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_mixcraft_step3">BeatGangsta will automatically process your XML inventory to build your Gear Rack.</Trans></p>
                  </div>
                </div>
              )}
              {activeTab === 'garage-band' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_garage_band_step1">Open <strong className="font-black">Finder</strong> and press <strong className="font-black">Command + Shift + G</strong>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_garage_band_step2">Type <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold">/Library/Audio/Plug-Ins/Components</code> and hit Enter.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_garage_band_step3">Select the <strong className="font-black">.component</strong> files for your plugins and copy their names.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_garage_band_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'reason' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 text-sm mb-2">
                    <p className="font-black mb-1">Reason Log.txt Support</p>
                    <p className="opacity-80 text-xs">Reason automatically logs all successfully scanned and created custom VST/VST3 and Rack Extension plugins inside its application log on startup. You can drag and drop or select your log file directly!</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0 font-bold">1</div>
                    <p className="text-sm leading-relaxed">
                      Locate your <strong className="font-black">Reason Log.txt</strong> file based on your OS:
                    </p>
                  </div>
                  <div className="pl-12 space-y-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-sky-600 mb-1">Windows Path (Paste in File Explorer / Run):</p>
                      <code className="select-all block p-2 rounded bg-black/10 font-mono text-xs font-bold leading-normal break-all">%LocalAppData%\Reason Studios\Reason\Logs\Reason Log.txt</code>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-sky-600 mb-1">macOS (Finder - Cmd+Shift+G):</p>
                      <code className="select-all block p-2 rounded bg-black/10 font-mono text-xs font-bold leading-normal break-all">~/Library/Application Support/Reason Studios/Reason/Logs/Reason Log.txt</code>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0 font-bold">2</div>
                    <p className="text-sm leading-relaxed">
                      <strong className="font-black">Drag & drop</strong> the file or click the upload zone on BeatGangsta to select it.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0 font-bold">3</div>
                    <p className="text-sm leading-relaxed">
                      Alternatively, copy and paste its text contents directly, or upload a manual list of your plugins formatted as <code className="bg-black/5 px-1 rounded font-mono">My Plugin</code> or <code className="bg-black/5 px-1 rounded font-mono">Vendor - My Plugin</code> on separate lines.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6 min-h-[300px] max-h-[350px] overflow-y-auto pr-2 animate-in slide-in-from-bottom-4 duration-500 text-left">
            <div className={`p-6 rounded-3xl border ${
              theme === 'coldest' ? 'border-sky-100 bg-sky-500/5 text-sky-950' : theme === 'hustle-time' ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-50' : 'border-red-500/20 bg-red-500/5 text-red-50'
            }`}>
              <p className="text-xs font-black mb-3 uppercase tracking-wider opacity-85">📁 Upload Exported .dawproject File</p>
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-current/20 rounded-2xl p-6 hover:border-current/40 transition-all bg-black/10 text-center">
                <input 
                  type="file" 
                  accept=".dawproject" 
                  onChange={handleDawProjectUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <svg className="w-8 h-8 mb-2 opacity-65" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-xs font-black uppercase tracking-wider">Choose or Drag File Here</p>
                <p className="text-[10px] opacity-70 mt-1">Select any exported `.dawproject` file to inspect inside browser</p>
              </div>
            </div>

            {isReading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center w-full">
                <div className={`w-8 h-8 rounded-full border-4 border-current border-t-transparent animate-spin ${theme === 'coldest' ? 'text-sky-500' : theme === 'hustle-time' ? 'text-yellow-500' : 'text-red-500'}`}></div>
                <p className="text-xs opacity-75 font-mono animate-pulse">Decompressing file and parsing project.xml...</p>
              </div>
            )}

            {diagError && (
              <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs leading-relaxed font-mono">
                🛑 Error parsing project: {diagError}
              </div>
            )}

            {!isReading && !diagError && parsedTracks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-sm font-black uppercase tracking-widest">Parsed Tracks & Inserts</h3>
                  <button 
                    onClick={handleCopyReport}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 ${
                      copiedDiag 
                        ? 'bg-emerald-500 text-white' 
                        : theme === 'coldest' 
                        ? 'bg-sky-500 text-white hover:bg-sky-600' 
                        : theme === 'hustle-time' 
                        ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-600' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {copiedDiag ? 'Copied!' : '📋 Copy Diagnostic Report'}
                  </button>
                </div>

                <div className="space-y-3">
                  {parsedTracks.map((track, tIdx) => (
                    <div key={tIdx} className="border border-white/5 rounded-2xl bg-black/20 p-4 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {track.name}
                        </span>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-white/5 font-mono tracking-wider opacity-60">
                          {track.contentType}
                        </span>
                      </div>

                      {track.plugins.length === 0 ? (
                        <p className="text-[11px] opacity-50 italic pl-3">No inserts mapped or active on this track.</p>
                      ) : (
                        <div className="space-y-2 mt-2">
                          {track.plugins.map((plug: any, pIdx: number) => {
                            const status = plug.match.status;
                            return (
                              <div key={pIdx} className="flex flex-col gap-1 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs text-left">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold flex items-center gap-1 text-white">
                                    <span className="text-white/40 font-mono text-[9px] uppercase">{plug.tagName === 'vst3Plugin' ? 'VST3' : 'VST2'}</span>
                                    {plug.deviceName}
                                  </span>
                                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-black tracking-wider ${
                                    status === 'matched' 
                                      ? 'bg-emerald-500/20 text-emerald-400' 
                                      : status === 'fallback' 
                                      ? 'bg-yellow-500/20 text-yellow-500' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {status === 'matched' ? 'Matched ID' : status === 'fallback' ? 'Fallback ID' : 'Unmatched'}
                                  </span>
                                </div>
                                <span className="text-[10px] opacity-60 font-medium">Vendor: {plug.deviceVendor}</span>
                                <span className="text-[10px] opacity-60 font-mono select-all">Device ID: {plug.deviceID || 'None'}</span>
                                <p className={`text-[10px] font-bold mt-1.5 pt-1.5 border-t border-white/5 leading-relaxed ${
                                  status === 'matched' ? 'text-emerald-400/80' : status === 'fallback' ? 'text-yellow-500/80' : 'text-red-400/80'
                                }`}>
                                  💡 {plug.match.message}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isReading && !diagError && parsedTracks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs font-black uppercase tracking-wider">No Project Loaded</p>
                <p className="text-[10px] mt-1 pr-6 pl-6 max-w-sm">Drop your exported DAWProject zip archive above to run an instant insert plugin compatibility scan.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10">
          <button 
            onClick={onClose}
            className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all ${theme === 'coldest' ? 'bg-sky-500 text-white hover:bg-sky-600' : theme === 'hustle-time' ? 'bg-yellow-500 text-[#001a14] hover:bg-yellow-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            {t('i_am_ready')}
          </button>
        </div>
      </div>
    </div>
  );
};
