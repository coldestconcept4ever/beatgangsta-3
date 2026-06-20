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
  scale = 3.0,           -- adjustable size modifier
  theme = "coldest",     -- "coldest" or "crazy-bird"
  snowflakes = {},       -- falling snowflake particles
  birds = {},            -- active flying ravens
  clicks = {},           -- click coordinate tracking for animation
  last_mouse_cap = 0,    -- detects single click transitions
  sync_errors = {}       -- sync diagnostic logs
}

gfx.init("BEATGANGSTA • CONNECT", 1260, 1860)

local function update_fonts()
  local s = state.scale or 1.0
  gfx.setfont(1, "Arial", math.floor(28 * s), 98) -- Title Font
  gfx.setfont(2, "Arial", math.floor(14 * s), 98) -- Button / Help Label Font
  gfx.setfont(3, "Arial", math.floor(18 * s), 98) -- Input Value Font
  gfx.setfont(4, "Arial", math.floor(12 * s), 98) -- Subtitle / Micro Font
end

update_fonts()

local function copy_to_clipboard(text)
  local ok = false
  if reaper.CF_SetClipboard then
    pcall(function() reaper.CF_SetClipboard(text); ok = true end)
  end
  if not ok and reaper.CF_SetClipboardString then
    pcall(function() reaper.CF_SetClipboardString(text); ok = true end)
  end
  if not ok then
    local os_str = reaper.GetOS()
    if string.find(os_str, "Win") then
      pcall(function()
        local f = io.popen("clip", "w")
        if f then
          f:write(text)
          f:close()
          ok = true
        end
      end)
    elseif string.find(os_str, "OSX") then
      pcall(function()
        local f = io.popen("pbcopy", "w")
        if f then
          f:write(text)
          f:close()
          ok = true
        end
      end)
    end
  end
  return ok
end

local function format_errors_text()
  if not state.sync_errors or #state.sync_errors == 0 then
    return "All cloud stem values healthy. No sync errors."
  end
  local lines = {}
  table.insert(lines, "=== BEATGANGSTA REAPER NODE SYNC ERRORS ===")
  table.insert(lines, "Linked Account: " .. tostring(state.email))
  table.insert(lines, "Date: " .. os.date("%Y-%m-%d %H:%M:%S"))
  table.insert(lines, "Number of Errors: " .. tostring(#state.sync_errors))
  table.insert(lines, "==========================================")
  for idx, err in ipairs(state.sync_errors) do
    table.insert(lines, string.format("[%d] [%s] %s", idx, tostring(err.code), tostring(err.desc)))
  end
  return table.concat(lines, "\r\n")
end

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

function draw_flying_bird(x, y, s_size, flap_phase, flap_speed)
  local t = os.clock()
  local flap = math.sin(t * flap_speed + flap_phase) -- oscillates between -1 and 1
  
  -- 1. Draw wind sweep speed streaks trailing behind the bird (flowing to the right)
  for i = 1, 3 do
    local offset_y = (i - 2) * s_size * 0.18
    local wave = math.sin(t * flap_speed * 0.4 + i) * (s_size * 0.12)
    local start_x = x + s_size * 0.25
    local end_x = x + s_size * (2.8 + i * 1.0)
    
    local steps = 6
    local prev_x = start_x
    local prev_y = y + offset_y
    for step = 1, steps do
      local f = step / steps
      local curr_x = start_x + (end_x - start_x) * f
      local curr_y = y + offset_y + wave * math.sin(f * math.pi + t * 3.5)
      
      -- Smooth fading alpha
      local alpha = (1.0 - f) * 0.26
      
      -- Main scarlet wind streak
      gfx.set(0.9, 0.12, 0.2, alpha)
      gfx.line(prev_x, prev_y, curr_x, curr_y)
      
      -- Subtle dark smoke parallel highlight
      gfx.set(0.12, 0.01, 0.03, alpha * 0.4)
      gfx.line(prev_x, prev_y + 1, curr_x, curr_y + 1)
      
      prev_x = curr_x
      prev_y = curr_y
    end
  end
  
  -- 2. Draw back wing (behind body)
  gfx.set(0.04, 0.0, 0.01, 0.7) -- dimmer dark maroon
  local wing2_tip_x = x + s_size * 0.1
  local wing2_tip_y = y - flap * s_size * 0.85 - s_size * 0.15
  gfx.triangle(x, y, x + s_size * 0.3, y, wing2_tip_x, wing2_tip_y)
  
  -- Back wing feather highlight
  gfx.set(0.25, 0.04, 0.06, 0.6)
  gfx.line(x, y, wing2_tip_x, wing2_tip_y)
  
  -- Draw tail
  gfx.set(0.03, 0.0, 0.0, 0.9)
  local tail_tip_x = x + s_size * 1.0
  local tail_tip_y = y + s_size * 0.15
  gfx.triangle(x, y, x + s_size * 0.25, y + s_size * 0.08, tail_tip_x, tail_tip_y)
  
  -- Draw main body
  gfx.set(0.08, 0.01, 0.02, 1.0) -- Body fill (dark rich maroon)
  local body_front_x = x - s_size * 0.65
  local body_front_y = y - s_size * 0.08
  local body_back_x = x + s_size * 0.55
  local body_back_y = y + s_size * 0.08
  
  -- Body thickness triangles
  gfx.triangle(body_front_x, body_front_y, body_back_x, body_back_y, x, y + s_size * 0.18)
  gfx.triangle(body_front_x, body_front_y, body_back_x, body_back_y, x, y - s_size * 0.08)
  
  -- Draw beak/head (now matches identical clean solid body color as body)
  gfx.set(0.08, 0.01, 0.02, 1.0)
  local beak_tip_x = x - s_size * 1.0
  local beak_tip_y = y
  gfx.triangle(body_front_x, body_front_y, x - s_size * 0.65, y + s_size * 0.04, beak_tip_x, beak_tip_y)
  
  -- Draw front wing
  gfx.set(0.12, 0.01, 0.03, 1.0) -- lighter maroon for front wing
  local wing1_tip_x = x - s_size * 0.15
  local wing1_tip_y = y - flap * s_size * 1.05
  local wing1_mid_x = x + s_size * 0.25
  local wing1_mid_y = y + s_size * 0.08
  gfx.triangle(x - s_size * 0.18, y - s_size * 0.08, wing1_mid_x, wing1_mid_y, wing1_tip_x, wing1_tip_y)
  
  -- Front wing wing-tip highlights
  gfx.set(0.48, 0.08, 0.17, 0.8) -- red feather highlights
  gfx.line(x - s_size * 0.18, y - s_size * 0.08, wing1_tip_x, wing1_tip_y)
  gfx.line(wing1_mid_x, wing1_mid_y, wing1_tip_x, wing1_tip_y)
  
  -- Draw glowing scarlet eyes
  gfx.set(1.0, 0.12, 0.34, 1.0) -- bright red eye
  local eye_x = x - s_size * 0.6
  local eye_y = y - s_size * 0.12
  local eye_r = math.max(1, math.floor(s_size * 0.08))
  gfx.circle(eye_x, eye_y, eye_r, 1)
end

function draw_birds()
  if #state.birds == 0 then
    local s = state.scale or 1.0
    for i = 1, 12 do
      table.insert(state.birds, {
        x = math.random(0, gfx.w + 200),
        y = math.random(80, gfx.h - 120),
        size = math.random(15, 28) * s,
        speed_x = -math.random(15, 38) / 10 * s,
        speed_y = math.random(-4, 4) / 10 * s,
        flap_speed = math.random(10, 18),
        flap_phase = math.random(0, 314) / 100,
        bob_amp = math.random(2, 6) * s
      })
    end
  end

  local t = os.clock()
  for _, b in ipairs(state.birds) do
    b.x = b.x + b.speed_x
    b.y = b.y + b.speed_y + math.sin(t * b.flap_speed * 0.4) * (b.bob_amp * 0.05)
    
    -- Wrap around
    local pad = b.size * 2
    if b.x < -pad then
      b.x = gfx.w + pad
      b.y = math.random(80, gfx.h - 120)
    elseif b.x > gfx.w + pad then
      b.x = -pad
      b.y = math.random(80, gfx.h - 120)
    end
    
    if b.y < 50 then b.y = 50 b.speed_y = -b.speed_y end
    if b.y > gfx.h - 100 then b.y = gfx.h - 100 b.speed_y = -b.speed_y end
    
    draw_flying_bird(b.x, b.y, b.size, b.flap_phase, b.flap_speed)
  end
end

function draw_top_controls(click_pressed)
  local s = state.scale or 1.0
  local thm = themes[state.theme] or themes["coldest"]
  
  -- Use scaled values for heights and margins
  local my = math.floor(15 * s)
  local mw = math.floor(25 * s)
  if mw < 25 then mw = 25 end
  
  -- Label for theme
  local labelTheme = "THEME: COLD"
  if state.theme == "crazy-bird" then labelTheme = "THEME: BIRD" end
  
  -- Measure theme label under Font 2 (Button Font)
  gfx.setfont(2)
  local twt, tht = gfx.measurestr(labelTheme)
  
  -- Comfortably pad the theme button width around the measured text to prevent cropping
  local tw_th = twt + math.floor(16 * s)
  
  -- Calculate horizontal positions from right to left dynamically so they never overlap
  local margin = math.floor(15 * s)
  if margin < 15 then margin = 15 end
  
  local gap = math.floor(10 * s)
  if gap < 8 then gap = 8 end
  
  -- Button '+' is furthest to the right
  local mx2 = gfx.w - margin - mw
  
  -- Button '-' is to the left of '+'
  local mx1 = mx2 - gap - mw
  
  -- Theme switcher button is to the left of '-'
  local tx_th = mx1 - gap - tw_th
  
  -- 1. Draw Theme Switcher Button
  if in_rect(gfx.mouse_x, gfx.mouse_y, tx_th, my, tw_th, mw) then
    state.hovering_interactive = true
    gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 0.3)
  else
    gfx.set(thm.bg_r, thm.bg_g, thm.bg_b, 1)
  end
  gfx.rect(tx_th, my, tw_th, mw, 1)
  gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1)
  gfx.rect(tx_th, my, tw_th, mw, 0)
  
  gfx.x, gfx.y = tx_th + (tw_th - twt)/2, my + (mw - tht)/2
  gfx.drawstr(labelTheme)
  
  -- 2. Draw '-' Button
  if in_rect(gfx.mouse_x, gfx.mouse_y, mx1, my, mw, mw) then
    state.hovering_interactive = true
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
  
  -- 3. Draw '+' Button
  if in_rect(gfx.mouse_x, gfx.mouse_y, mx2, my, mw, mw) then
    state.hovering_interactive = true
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
  
  -- 4. Click interaction handling
  if click_pressed then
    if in_rect(gfx.mouse_x, gfx.mouse_y, tx_th, my, tw_th, mw) then
      if state.theme == "coldest" then
        state.theme = "crazy-bird"
      else
        state.theme = "coldest"
      end
      state.snowflakes = {}
      state.birds = {}
    elseif in_rect(gfx.mouse_x, gfx.mouse_y, mx1, my, mw, mw) then
      state.scale = math.max(0.7, state.scale - 0.1)
      state.snowflakes = {}
      state.birds = {}
      update_fonts()
    elseif in_rect(gfx.mouse_x, gfx.mouse_y, mx2, my, mw, mw) then
      state.scale = math.min(1.8, state.scale + 0.1)
      state.snowflakes = {}
      state.birds = {}
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

function draw_ui()
  state.hovering_interactive = false
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

  -- Falling snowflakes or feathers in background (or crazy birds!)
  if state.theme == "crazy-bird" then
    draw_birds()
  else
    draw_snow()
  end

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

  -- Safe Native Mouse Cursor (replaces custom drawing)
  if gfx.setcursor then
    if state.hovering_interactive then
      gfx.setcursor(32649) -- Native Hand cursor
    else
      gfx.setcursor(32512) -- Native Arrow cursor
    end
  end

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

  -- Hover tracking for inputs and button
  if gfx.mouse_x > 50 and gfx.mouse_x < gfx.w - 50 then
    if gfx.mouse_y > email_y and gfx.mouse_y < email_y + input_h then
      state.hovering_interactive = true
    elseif gfx.mouse_y > pin_y and gfx.mouse_y < pin_y + input_h then
      state.hovering_interactive = true
    elseif gfx.mouse_y > btn_y and gfx.mouse_y < btn_y + math.floor(50 * s) and not state.is_loading then
      state.hovering_interactive = true
    end
  end

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

  -- Hover tracking for force pull button
  if gfx.mouse_x > 50 and gfx.mouse_x < gfx.w - 50 then
    if gfx.mouse_y > btn_y and gfx.mouse_y < btn_y + btn_h and not state.is_loading then
      state.hovering_interactive = true
    end
  end

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
        local start_msg_x = math.floor(135 * s)
        gfx.x = start_msg_x
        local msg = err.desc
        local max_w = (gfx.w - 50) - start_msg_x
        local tw_msg, _ = gfx.measurestr(msg)
        if tw_msg > max_w then
          -- Truncate cleanly based on actual pixel width
          while #msg > 5 and tw_msg > max_w - 15 do
            msg = msg:sub(1, #msg - 1)
            tw_msg, _ = gfx.measurestr(msg .. "...")
          end
          msg = msg .. "..."
        end
        gfx.drawstr(msg)
        
        item_y = item_y + math.floor(16 * s)
      end
    end
    if #state.sync_errors > 5 then
      gfx.set(thm.subtext_r, thm.subtext_g, thm.subtext_b, 0.5)
      gfx.x, gfx.y = 50, item_y
      gfx.drawstr("And " .. (#state.sync_errors - 5) .. " more.")
      item_y = item_y + math.floor(20 * s)
    else
      item_y = item_y + math.floor(8 * s)
    end

    local copy_btn_y = item_y
    local copy_btn_w = gfx.w - 100
    local copy_btn_h = math.floor(30 * s)
    if copy_btn_h < 24 then copy_btn_h = 24 end

    local copy_text = "COPY COMPLETE ERROR REPORT"
    if state.report_copied_at and os.time() - state.report_copied_at < 3 then
      copy_text = "REPORT COPIED ✔"
    end

    local on_copy_hover = in_rect(gfx.mouse_x, gfx.mouse_y, 50, copy_btn_y, copy_btn_w, copy_btn_h)
    if on_copy_hover then
      state.hovering_interactive = true
      gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 0.25)
    else
      gfx.set(thm.bg_r + 0.05, thm.bg_g + 0.05, thm.bg_b + 0.05, 0.4)
    end
    gfx.rect(50, copy_btn_y, copy_btn_w, copy_btn_h, 1)

    gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, on_copy_hover and 0.8 or 0.4)
    gfx.rect(50, copy_btn_y, copy_btn_w, copy_btn_h, 0)

    gfx.set(1, 1, 1, on_copy_hover and 1.0 or 0.8)
    gfx.setfont(4)
    local c_tw, c_th = gfx.measurestr(copy_text)
    gfx.x = 50 + (copy_btn_w - c_tw) / 2
    gfx.y = copy_btn_y + (copy_btn_h - c_th) / 2
    gfx.drawstr(copy_text)

    if click_pressed and on_copy_hover then
      local full_text = format_errors_text()
      local success = copy_to_clipboard(full_text)
      state.report_copied_at = os.time()
      if success then
        state.status_msg = "COPIED REPORT TO OS CLIPBOARD"
      else
        state.status_msg = "ERROR COPYING REPORT"
      end
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
        local new_idx = reaper.CountTracks(0)
        reaper.InsertTrackAtIndex(new_idx, true)
        current_track = reaper.GetTrack(0, new_idx)
        if current_track then
          reaper.GetSetMediaTrackInfo_String(current_track, "P_NAME", current_tname, true)
          table.insert(state.sync_errors, {
            code = "INFO_AUTO_CREATED",
            desc = "Track '" .. current_tname .. "' was missing, so we auto-created it! ✔"
          })
          total_tracks_in_project = reaper.CountTracks(0)
        else
          table.insert(state.sync_errors, {
            code = "ERR_TR_002",
            desc = "Track '" .. current_tname .. "' not found and auto-creation failed."
          })
        end
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
