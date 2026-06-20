export const getReaperLua = (origin: string) => {
  const version = "2.2.0";
  return String.raw`-- BeatGangsta Connect for REAPER
-- Version ${version} (Premium Coldest & Crazy Bird Edition)
-- Author: BeatGangsta AI

local version = "${version}"
local script_path = debug.getinfo(1,'S').source:match([[^@?(.*[/\\])]])
local logo_path = script_path .. "beatgangsta_logo.png"
local logo_img = -1

-- Theme Configurations
local themes = {
  ["coldest"] = {
    bg_r = 0.05, bg_g = 0.05, bg_b = 0.1,
    acc_r = 0.2, acc_g = 0.6, acc_b = 1.0,
    btn_r = 0.1, btn_g = 0.5, btn_b = 0.9,
    btn_text_r = 1.0, btn_text_g = 1.0, btn_text_b = 1.0,
    subtext_r = 1.0, subtext_g = 1.0, subtext_b = 1.0, subtext_a = 0.6,
    snow_r = 0.65, snow_g = 0.85, snow_b = 1.0, snow_a = 0.4,
    snow_speed = 1.0,
    snow_type = "snowflake"
  },
  ["crazy-bird"] = {
    bg_r = 0.16, bg_g = 0.02, bg_b = 0.02,
    acc_r = 1.0, acc_g = 0.2, acc_b = 0.2,
    btn_r = 0.70, btn_g = 0.08, btn_b = 0.08,
    btn_text_r = 1.0, btn_text_g = 0.95, btn_text_b = 0.95,
    subtext_r = 1.0, subtext_g = 0.8, subtext_b = 0.8, subtext_a = 0.6,
    snow_r = 1.0, snow_g = 0.3, snow_b = 0.2, snow_a = 0.5,
    snow_speed = 1.8,
    snow_type = "feather"
  }
}

local state = {
  email = "",
  pin = "",
  is_logged_in = false,
  is_loading = false,
  status_msg = "READY TO CONNECT",
  input_focus = "email", -- "email" or "pin"
  scale = 1.0,           -- adjustable size modifier
  theme = "coldest",     -- "coldest" or "crazy-bird"
  snowflakes = {},       -- falling snowflake particles
  clicks = {},           -- click coordinate tracking for animation
  last_mouse_cap = 0,    -- detects single click transitions
  sync_errors = {}       -- sync diagnostic logs
}

local function update_fonts()
  local s = state.scale or 1.0
  gfx.setfont(1, "Arial", math.floor(28 * s), 98) -- Title Font
  gfx.setfont(2, "Arial", math.floor(14 * s), 98) -- Button / Help Label Font
  gfx.setfont(3, "Arial", math.floor(18 * s), 98) -- Input Value Font
  gfx.setfont(4, "Arial", math.floor(12 * s), 98) -- Subtitle / Micro Font
end

update_fonts()

function Msg(val)
  reaper.ShowConsoleMsg(tostring(val)..string.char(10))
end

function in_rect(mx, my, x, y, w, h)
  return mx >= x and mx <= x + w and my >= y and my <= y + h
end

function draw_snow()
  local thm = themes[state.theme] or themes["coldest"]
  -- Generate snowflakes if not populated
  if #state.snowflakes == 0 then
    for i = 1, 45 do
      table.insert(state.snowflakes, {
        x = math.random(0, 1000),
        y = math.random(-250, 700),
        size = math.random(1, 3),
        speed = math.random(10, 25) / 14,
        drift_freq = math.random(10, 60) / 100,
        drift_amp = math.random(5, 12) / 10
      })
    end
  end

  gfx.set(thm.snow_r, thm.snow_g, thm.snow_b, thm.snow_a)
  local t = os.clock()
  for _, f in ipairs(state.snowflakes) do
    f.y = f.y + f.speed * thm.snow_speed
    f.x = f.x + math.sin(t * f.drift_freq) * 0.15 * f.drift_amp
    if f.y > gfx.h then
      f.y = -10
      f.x = math.random(0, gfx.w)
    end
    if f.x < -10 then f.x = gfx.w + 10 end
    if f.x > gfx.w + 10 then f.x = -10 end
    
    if thm.snow_type == "snowflake" then
      gfx.circle(f.x, f.y, f.size, 1)
    else
      -- feather/ember drift: wider shape
      gfx.rect(f.x, f.y, f.size * 2, f.size, 1)
    end
  end
end

function draw_top_controls(click_pressed)
  local my = 15
  local mw = 25
  local thm = themes[state.theme] or themes["coldest"]
  
  -- Theme switch button (labeled like [THEME: COLD] or [THEME: BIRD])
  local tx_th = gfx.w - 180
  local tw_th = 95
  
  if in_rect(gfx.mouse_x, gfx.mouse_y, tx_th, my, tw_th, mw) then
    gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 0.3)
  else
    gfx.set(thm.bg_r, thm.bg_g, thm.bg_b, 1)
  end
  gfx.rect(tx_th, my, tw_th, mw, 1)
  gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1)
  gfx.rect(tx_th, my, tw_th, mw, 0)
  
  gfx.setfont(2)
  local labelTheme = "THEME: COLD"
  if state.theme == "crazy-bird" then labelTheme = "THEME: BIRD" end
  local twt, tht = gfx.measurestr(labelTheme)
  gfx.x, gfx.y = tx_th + (tw_th - twt)/2, my + (mw - tht)/2
  gfx.drawstr(labelTheme)

  -- Button '-'
  local mx1 = gfx.w - 75
  if in_rect(gfx.mouse_x, gfx.mouse_y, mx1, my, mw, mw) then
    gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 0.3)
  else
    gfx.set(thm.bg_r, thm.bg_g, thm.bg_b, 1)
  end
  gfx.rect(mx1, my, mw, mw, 1)
  gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1)
  gfx.rect(mx1, my, mw, mw, 0)
  local tw, th = gfx.measurestr("-")
  gfx.x, gfx.y = mx1 + (mw - tw)/2, my + (mw - th)/2
  gfx.drawstr("-")
  
  -- Button '+'
  local mx2 = gfx.w - 40
  if in_rect(gfx.mouse_x, gfx.mouse_y, mx2, my, mw, mw) then
    gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 0.3)
  else
    gfx.set(thm.bg_r, thm.bg_g, thm.bg_b, 1)
  end
  gfx.rect(mx2, my, mw, mw, 1)
  gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1)
  gfx.rect(mx2, my, mw, mw, 0)
  local tw2, th2 = gfx.measurestr("+")
  gfx.x, gfx.y = mx2 + (mw - tw2)/2, my + (mw - th2)/2
  gfx.drawstr("+")
  
  -- Handle click
  if click_pressed then
    if in_rect(gfx.mouse_x, gfx.mouse_y, tx_th, my, tw_th, mw) then
      if state.theme == "coldest" then
        state.theme = "crazy-bird"
      else
        state.theme = "coldest"
      end
    elseif in_rect(gfx.mouse_x, gfx.mouse_y, mx1, my, mw, mw) then
      state.scale = math.max(0.7, state.scale - 0.1)
      update_fonts()
    elseif in_rect(gfx.mouse_x, gfx.mouse_y, mx2, my, mw, mw) then
      state.scale = math.min(1.8, state.scale + 0.1)
      update_fonts()
    end
  end
end

function draw_click_animations()
  local thm = themes[state.theme] or themes["coldest"]
  local i = 1
  while i <= #state.clicks do
    local c = state.clicks[i]
    c.r = c.r + 2.5
    c.alpha = 1.0 - (c.r / c.max_r)
    if c.alpha <= 0 then
      table.remove(state.clicks, i)
    else
      gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, c.alpha)
      gfx.circle(c.x, c.y, c.r, 0)
      if c.r > 5 then
        gfx.set(1.0, 1.0, 1.0, c.alpha * 0.6)
        gfx.circle(c.x, c.y, c.r - 4, 0)
      end
      i = i + 1
    end
  end
end

function draw_custom_cursor(mx, my)
  if mx < 0 or my < 0 or mx > gfx.w or my > gfx.h then return end
  if gfx.setcursor then
    gfx.setcursor(0) -- Safe REAPER native function to set/reset standard mouse cursor
  end
  
  local s = state.scale or 1.0
  if s < 0.8 then s = 0.8 end
  local thm = themes[state.theme] or themes["coldest"]

  -- Gunmetal/Silver Walther PPK/s
  gfx.set(0.02, 0.02, 0.05, 0.6)
  gfx.rect(mx + 1, my + 1, 22*s, 7*s, 1)
  gfx.rect(mx + 13*s, my + 7*s, 8*s, 15*s, 1)
  
  -- Slide/barrel body
  gfx.set(0.24, 0.26, 0.30, 1.0)
  gfx.rect(mx, my, 21*s, 6*s, 1)
  
  -- Silver muzzle extension
  gfx.set(0.60, 0.65, 0.70, 1.0)
  gfx.rect(mx - 2*s, my + 1.5*s, 3*s, 3*s, 1)
  
  -- Rear slide detail and hammer
  gfx.set(0.15, 0.16, 0.18, 1.0)
  gfx.rect(mx + 18*s, my, 3*s, 6*s, 1)
  gfx.set(0.5, 0.45, 0.4, 1.0)
  gfx.rect(mx + 21*s, my + 1*s, 2*s, 2*s, 1)
  
  -- Grip frame
  gfx.set(0.20, 0.22, 0.25, 1.0)
  gfx.rect(mx + 12*s, my + 6*s, 8*s, 14*s, 1)
  
  -- Grip plate
  gfx.set(0.12, 0.12, 0.14, 1.0)
  gfx.rect(mx + 13*s, my + 8*s, 6*s, 11*s, 1)
  
  -- Walther theme-colored logo dot
  gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1.0)
  gfx.rect(mx + 15*s, my + 12*s, 2*s, 2*s, 1)
  
  -- Trigger guard
  gfx.set(0.15, 0.16, 0.18, 1.0)
  gfx.rect(mx + 6*s, my + 6*s, 6*s, 5*s, 0)
  gfx.set(0.55, 0.58, 0.62, 1.0)
  gfx.line(mx + 8*s, my + 6*s, mx + 7*s, my + 9*s)
end

function draw_ui()
  local mx, my = gfx.mouse_x, gfx.mouse_y
  local click_pressed = (gfx.mouse_cap == 1 and state.last_mouse_cap == 0)
  local thm = themes[state.theme] or themes["coldest"]
  
  if click_pressed then
    table.insert(state.clicks, {
      x = mx,
      y = my,
      r = 1,
      max_r = 30 * (state.scale or 1.0),
      alpha = 1.0
    })
  end

  -- Background (Themed Slate/Crimson)
  gfx.set(thm.bg_r, thm.bg_g, thm.bg_b, 1)
  gfx.rect(0, 0, gfx.w, gfx.h, 1)

  -- Falling snowflakes or feathers in background
  draw_snow()

  -- Size adjustment buttons (+ and -) and Theme switch
  draw_top_controls(click_pressed)

  local s = state.scale or 1.0
  local logo_y = math.floor(30 * s)
  local logo_h = 0
  if logo_img == -1 then logo_img = gfx.loadimg(0, logo_path) end
  if logo_img >= 0 then
    local lw, lh = gfx.getimgdim(logo_img)
    local target_w = math.floor(120 * s)
    logo_h = (lh / lw) * target_w
    gfx.blit(logo_img, 1, 0, 0, 0, lw, lh, (gfx.w/2) - (target_w/2), logo_y, target_w, logo_h)
  end

  gfx.set(1, 1, 1, 1)
  gfx.setfont(1)
  local tx = "BEATGANGSTA"
  local tw, th = gfx.measurestr(tx)
  local title_y = logo_y + logo_h + math.floor(15 * s)
  gfx.x, gfx.y = (gfx.w/2) - (tw/2), title_y
  gfx.drawstr(tx)

  gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1)
  gfx.setfont(4)
  local sub = "CLOUD SYNC LINK v" .. version
  local sw, sh = gfx.measurestr(sub)
  local sub_y = title_y + th + math.floor(5 * s)
  gfx.x, gfx.y = (gfx.w/2) - (sw/2), sub_y
  gfx.drawstr(sub)

  local start_y = sub_y + sh + math.floor(15 * s)

  if not state.is_logged_in then
    draw_login(start_y, click_pressed)
  else
    draw_dashboard(start_y, click_pressed)
  end

  -- Click ring animations
  draw_click_animations()

  -- Walther PPK Custom Cursor
  draw_custom_cursor(mx, my)

  state.last_mouse_cap = gfx.mouse_cap

  gfx.update()
  if gfx.getchar() >= 0 then reaper.defer(draw_ui) end
end

function draw_login(start_y, click_pressed)
  local center_x = gfx.w / 2
  local s = state.scale or 1.0
  local thm = themes[state.theme] or themes["coldest"]
  
  -- Help text
  gfx.set(thm.subtext_r, thm.subtext_g, thm.subtext_b, thm.subtext_a)
  gfx.setfont(2)
  local help = "ENTER YOUR ACCOUNT DETAILS"
  local hw = gfx.measurestr(help)
  gfx.x, gfx.y = center_x - (hw/2), start_y
  gfx.drawstr(help)

  -- Inputs
  local input_h = math.floor(40 * s)
  local input_gap = math.floor(25 * s)
  
  local email_y = start_y + math.floor(25 * s)
  local pin_y = email_y + input_h + input_gap
  local btn_y = pin_y + input_h + input_gap
  local status_y = btn_y + math.floor(50 * s) + math.floor(15 * s)

  draw_input(50, email_y, gfx.w - 100, input_h, "EMAIL", state.email, state.input_focus == "email")
  draw_input(50, pin_y, gfx.w - 100, input_h, "SYNC PIN", string.rep("*", #state.pin), state.input_focus == "pin")

  -- Action Button
  draw_button(50, btn_y, gfx.w - 100, math.floor(50 * s), state.is_loading and "POLLING..." or "LINK REAPER NODE")

  -- Status
  gfx.set(thm.subtext_r, thm.subtext_g, thm.subtext_b, 0.5)
  gfx.setfont(4)
  local sw = gfx.measurestr(state.status_msg)
  gfx.x, gfx.y = center_x - (sw/2), status_y
  gfx.drawstr(state.status_msg)

  -- Interaction
  if click_pressed then
    if gfx.mouse_y > email_y and gfx.mouse_y < email_y + input_h then
      state.input_focus = "email"
    elseif gfx.mouse_y > pin_y and gfx.mouse_y < pin_y + input_h then
      state.input_focus = "pin"
    elseif gfx.mouse_y > btn_y and gfx.mouse_y < btn_y + math.floor(50 * s) and not state.is_loading then
      perform_sync()
    end
  end

  local char = gfx.getchar()
  if char > 0 then
    if char == 13 then -- Enter
      if state.input_focus == "email" then state.input_focus = "pin"
      else perform_sync() end
    elseif char == 8 then -- Backspace
      if state.input_focus == "email" then state.email = state.email:sub(1, -2)
      else state.pin = state.pin:sub(1, -2) end
    elseif char == 9 then -- Tab
      state.input_focus = (state.input_focus == "email") and "pin" or "email"
    elseif char >= 32 and char <= 126 then
      if state.input_focus == "email" then state.email = state.email .. string.char(char)
      elseif #state.pin < 6 then state.pin = state.pin .. string.char(char) end
    end
  end
end

function draw_input(x, y, w, h, label, val, focused)
  local s = state.scale or 1.0
  local thm = themes[state.theme] or themes["coldest"]
  if focused then 
    gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1) 
  else 
    gfx.set(thm.acc_r * 0.3, thm.acc_g * 0.3, thm.acc_b * 0.3, 1) 
  end
  gfx.rect(x, y, w, h, 0)
  gfx.set(thm.subtext_r, thm.subtext_g, thm.subtext_b, 0.5)
  gfx.setfont(2)
  gfx.x, gfx.y = x, y - math.floor(18 * s)
  gfx.drawstr(label)
  gfx.set(1,1,1,1)
  gfx.setfont(3)
  local tw, th = gfx.measurestr(val)
  gfx.x, gfx.y = x + 10, y + (h - th) / 2
  gfx.drawstr(val)
end

function draw_button(x, y, w, h, text)
  local thm = themes[state.theme] or themes["coldest"]
  gfx.set(thm.btn_r, thm.btn_g, thm.btn_b, 1)
  gfx.rect(x, y, w, h, 1)
  gfx.set(thm.btn_text_r, thm.btn_text_g, thm.btn_text_b, 1)
  gfx.setfont(2)
  local tw, th = gfx.measurestr(text)
  gfx.x, gfx.y = x + (w - tw)/2, y + (h - th)/2
  gfx.drawstr(text)
end

function draw_dashboard(start_y, click_pressed)
  local s = state.scale or 1.0
  local thm = themes[state.theme] or themes["coldest"]
  gfx.set(1,1,1,0.8)
  gfx.setfont(2)
  
  local line1_y = start_y + math.floor(20 * s)
  local line2_y = line1_y + math.floor(30 * s)
  local btn_y = line2_y + math.floor(40 * s)
  local btn_h = math.floor(50 * s)

  gfx.x, gfx.y = 50, line1_y
  gfx.drawstr("LINKED AS: " .. state.email)
  gfx.x, gfx.y = 50, line2_y
  gfx.drawstr("STATUS: MONITORING CLOUD NODE")
  
  draw_button(50, btn_y, gfx.w - 100, btn_h, state.is_loading and "PULLING..." or "FORCE PULL SYNC")

  if click_pressed then
    if gfx.mouse_y > btn_y and gfx.mouse_y < btn_y + btn_h and not state.is_loading then
      perform_sync()
    end
  end

  local diag_y = btn_y + btn_h + math.floor(25 * s)
  if state.sync_errors and #state.sync_errors > 0 then
    gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 0.9)
    gfx.setfont(2)
    gfx.x, gfx.y = 50, diag_y
    gfx.drawstr("DIAGNOSTICS & SYNC ERRORS (" .. #state.sync_errors .. ")")
    
    local item_y = diag_y + math.floor(20 * s)
    gfx.setfont(4)
    for idx, err in ipairs(state.sync_errors) do
      if idx <= 5 then -- show top 5
        gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1.0)
        gfx.x = 50
        gfx.y = item_y
        gfx.drawstr("[" .. err.code .. "] ")
        
        gfx.set(1, 1, 1, 0.70)
        gfx.x = 130 * s
        local msg = err.desc
        if #msg > 35 then msg = msg:sub(1, 33) .. "..." end
        gfx.drawstr(msg)
        
        item_y = item_y + math.floor(16 * s)
      end
    end
    if #state.sync_errors > 5 then
      gfx.set(thm.subtext_r, thm.subtext_g, thm.subtext_b, 0.5)
      gfx.x, gfx.y = 50, item_y
      gfx.drawstr("And " .. (#state.sync_errors - 5) .. " more. Check Window console!")
    end
  else
    gfx.set(0.2, 0.8, 0.2, 0.6)
    gfx.setfont(4)
    gfx.x, gfx.y = 50, diag_y
    gfx.drawstr("✔ ALL CLOUD STEM VALUES HEALTHY")
  end
end

function perform_sync()
  if state.email == "" or #state.pin < 4 then return end
  state.is_loading = true
  state.status_msg = "POLLING BEATGANGSTA CLOUD API..."
  state.sync_errors = {}

  local url = "${origin}/api/reaper-sync/pull?email=" .. state.email .. "&pin=" .. state.pin
  local tmp = os.tmpname()
  if tmp:byte(1) == 92 then tmp = os.getenv("TMP") .. tmp end

  local cmd = (string.find(reaper.GetOS(), "Win") ~= nil) and 'curl.exe -sL "' or 'curl -sL "'
  local exit_code = os.execute(cmd .. url .. '" -o "' .. tmp .. '"')

  local f = io.open(tmp, "r")
  if f then
    local content = f:read("*all")
    f:close()
    os.remove(tmp)
    if content ~= "" and not content:match("error") then
      apply_sync(content)
      state.is_logged_in = true
      if #state.sync_errors > 0 then
        state.status_msg = "PULL DONE WITH " .. #state.sync_errors .. " ERRORS"
      else
        state.status_msg = "SYNC SUCCESSFUL!"
      end
    else
      local err_msg = "NO DATA FOUND"
      if content:match("error") then
        err_msg = content:match('"error"%s*:%s*"([^"]+)"') or "SERVER RESPONSE INVALID"
      end
      table.insert(state.sync_errors, {
        code = "ERR_NET_404",
        desc = "Pull failed: " .. err_msg
      })
      state.status_msg = "ERROR: " .. err_msg
    end
  else
    table.insert(state.sync_errors, {
      code = "ERR_NET_CON",
      desc = "Network curl execution failed."
    })
    state.status_msg = "NETWORK ERROR"
  end
  state.is_loading = false
end

function apply_sync(payload)
  reaper.Undo_BeginBlock()
  local current_track = nil
  local current_tname = "unknown"
  local current_fx = -1
  
  local total_tracks_in_project = reaper.CountTracks(0)
  if total_tracks_in_project == 0 then
    table.insert(state.sync_errors, {
      code = "ERR_TR_001",
      desc = "Project has 0 tracks. Please create tracks named matching your stems."
    })
  end

  for line in payload:gmatch("([^" .. string.char(10) .. "]+)") do
    line = line:gsub(string.char(13), "")
    if line:sub(1,6) == "TRACK|" then
      current_tname = line:sub(7)
      current_track = nil
      for i=0, total_tracks_in_project-1 do
        local tr = reaper.GetTrack(0,i)
        local _, n = reaper.GetTrackName(tr)
        if n:lower() == current_tname:lower() or n == current_tname then 
          current_track = tr 
          break 
        end
      end
      if not current_track then
        table.insert(state.sync_errors, {
          code = "ERR_TR_002",
          desc = "Track '" .. current_tname .. "' not found. Create a track with this exact name."
        })
      end
    elseif line:sub(1,3) == "FX|" then
      local fx_name = line:sub(4)
      if current_track then
        current_fx = reaper.TrackFX_AddByName(current_track, fx_name, false, -1)
        if current_fx < 0 then
          table.insert(state.sync_errors, {
            code = "ERR_FX_001",
            desc = "JSFX '" .. fx_name .. "' load failed. Check installation."
          })
        end
      else
        table.insert(state.sync_errors, {
          code = "ERR_FX_002",
          desc = "JSFX '" .. fx_name .. "' skipped. (Parent track '" .. current_tname .. "' not found)"
        })
      end
    elseif line:sub(1,6) == "PARAM|" and current_track and current_fx >= 0 then
      local pstr = line:sub(7)
      local pi, pv = pstr:match("([^|]+)|([^|]+)")
      if pi and pv then 
        reaper.TrackFX_SetParam(current_track, current_fx, tonumber(pi), tonumber(pv)) 
      end
    end
  end
  reaper.Undo_EndBlock("BeatGangsta Cloud Sync", -1)
end

draw_ui()
`;
};
