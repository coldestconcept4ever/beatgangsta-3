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

local function trim_str(s)
  if not s then return "" end
  return s:match("^%s*(.-)%s*$") or ""
end

local state = {
  email = "",
  pin = "",
  remember_email = true,
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

local function load_settings()
  if reaper.HasExtState("BeatGangsta", "remember_email") then
    state.remember_email = (reaper.GetExtState("BeatGangsta", "remember_email") == "true")
  else
    state.remember_email = true
  end
  if state.remember_email and reaper.HasExtState("BeatGangsta", "email") then
    state.email = trim_str(reaper.GetExtState("BeatGangsta", "email")):lower()
  end
end

local function save_settings()
  reaper.SetExtState("BeatGangsta", "remember_email", state.remember_email and "true" or "false", true)
  if state.remember_email then
    reaper.SetExtState("BeatGangsta", "email", trim_str(state.email):lower(), true)
  else
    reaper.SetExtState("BeatGangsta", "email", "", true)
  end
end

-- Load on script load
load_settings()

gfx.init("BEATGANGSTA • CONNECT", 1260, 1860)

local function update_fonts()
  local s = state.scale or 1.0
  gfx.setfont(1, "Inter", math.floor(28 * s), 98) -- Title Font
  gfx.setfont(2, "Inter", math.floor(14 * s), 98) -- Button / Help Label Font
  gfx.setfont(3, "Inter", math.floor(18 * s), 98) -- Input Value Font
  gfx.setfont(4, "Inter", math.floor(12 * s), 98) -- Subtitle / Micro Font
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

local function cubic_bezier(t, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y)
  local mt = 1.0 - t
  local mt2 = mt * mt
  local mt3 = mt2 * mt
  local t2 = t * t
  local t3 = t2 * t
  
  local rx = mt3 * p0x + 3 * mt2 * t * p1x + 3 * mt * t2 * p2x + t3 * p3x
  local ry = mt3 * p0y + 3 * mt2 * t * p1y + 3 * mt * t2 * p2y + t3 * p3y
  return rx, ry
end

local function add_bezier(vertices, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y)
  local steps = 6
  for i = 1, steps do
    local t = i / steps
    local rx, ry = cubic_bezier(t, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y)
    table.insert(vertices, {x = rx, y = ry})
  end
end

local function lerp(a, b, f)
  return a + (b - a) * f
end

local function draw_filled_poly(vertices, rx, ry)
  if #vertices < 3 then return end
  local root_x = rx or vertices[1].x
  local root_y = ry or vertices[1].y
  for i = 2, #vertices - 1 do
    gfx.triangle(root_x, root_y, vertices[i].x, vertices[i].y, vertices[i + 1].x, vertices[i + 1].y)
  end
end

local function draw_poly_outline(vertices)
  if #vertices < 2 then return end
  for i = 1, #vertices - 1 do
    gfx.line(vertices[i].x, vertices[i].y, vertices[i + 1].x, vertices[i + 1].y)
  end
  gfx.line(vertices[#vertices].x, vertices[#vertices].y, vertices[1].x, vertices[1].y)
end

local function get_back_wing_vertices(phase)
  local kA, kB, f
  if phase < 0.20 then
    kA, kB, f = 1, 2, phase / 0.20
  elseif phase < 0.45 then
    kA, kB, f = 2, 3, (phase - 0.20) / 0.25
  elseif phase < 0.75 then
    kA, kB, f = 3, 2, (phase - 0.45) / 0.30
  else
    kA, kB, f = 2, 1, (phase - 0.75) / 0.25
  end
  
  local keys = {
    [1] = {
      c1x=55, c1y=10, c2x=75, c2y=-5, e1x=95, e1y=-10,
      p2x=90, p2y=-2, p3x=100, p3y=0, p4x=92, p4y=8, p5x=100, p5y=15,
      c3x=80, c3y=25, c4x=65, c4y=35
    },
    [2] = {
      c1x=46, c1y=55, c2x=56, c2y=70, e1x=71, e1y=80,
      p2x=66, p2y=75, p3x=74, p3y=73, p4x=68, p4y=67, p5x=74, p5y=55,
      c3x=61, c3y=50, c4x=51, c4y=45
    },
    [3] = {
      c1x=51, c1y=60, c2x=71, c2y=70, e1x=91, e1y=70,
      p2x=86, p2y=65, p3x=94, p3y=60, p4x=84, p4y=55, p5x=88, p5y=47,
      c3x=71, c3y=45, c4x=56, c4y=43
    }
  }
  
  local a = keys[kA]
  local b = keys[kB]
  
  local c1x = lerp(a.c1x, b.c1x, f)
  local c1y = lerp(a.c1y, b.c1y, f)
  local c2x = lerp(a.c2x, b.c2x, f)
  local c2y = lerp(a.c2y, b.c2y, f)
  local e1x = lerp(a.e1x, b.e1x, f)
  local e1y = lerp(a.e1y, b.e1y, f)
  
  local p2x = lerp(a.p2x, b.p2x, f)
  local p2y = lerp(a.p2y, b.p2y, f)
  local p3x = lerp(a.p3x, b.p3x, f)
  local p3y = lerp(a.p3y, b.p3y, f)
  local p4x = lerp(a.p4x, b.p4x, f)
  local p4y = lerp(a.p4y, b.p4y, f)
  local p5x = lerp(a.p5x, b.p5x, f)
  local p5y = lerp(a.p5y, b.p5y, f)
  
  local c3x = lerp(a.c3x, b.c3x, f)
  local c3y = lerp(a.c3y, b.c3y, f)
  local c4x = lerp(a.c4x, b.c4x, f)
  local c4y = lerp(a.c4y, b.c4y, f)
  
  local v = {}
  table.insert(v, {x=44, y=42})
  add_bezier(v, 44, 42, c1x, c1y, c2x, c2y, e1x, e1y)
  table.insert(v, {x=p2x, y=p2y})
  table.insert(v, {x=p3x, y=p3y})
  table.insert(v, {x=p4x, y=p4y})
  table.insert(v, {x=p5x, y=p5y})
  add_bezier(v, p5x, p5y, c3x, c3y, c4x, c4y, 44, 42)
  return v
end

local function get_front_wing_vertices(phase)
  local kA, kB, f
  if phase < 0.20 then
    kA, kB, f = 1, 2, phase / 0.20
  elseif phase < 0.45 then
    kA, kB, f = 2, 3, (phase - 0.20) / 0.25
  elseif phase < 0.75 then
    kA, kB, f = 3, 2, (phase - 0.45) / 0.30
  else
    kA, kB, f = 2, 1, (phase - 0.75) / 0.25
  end
  
  local keys = {
    [1] = {
      c1x=40, c1y=25, c2x=55, c2y=10, e1x=75, e1y=5,
      p2x=72, p2y=12, p3x=80, p3y=15, p4x=75, p4y=22, p5x=82, p5y=28,
      c3x=70, c3y=38, c4x=55, c4y=44
    },
    [2] = {
      c1x=40, c1y=65, c2x=50, c2y=80, e1x=65, e1y=90,
      p2x=60, p2y=85, p3x=68, p3y=83, p4x=62, p4y=77, p5x=68, p5y=60,
      c3x=55, c3y=55, c4x=45, c4y=50
    },
    [3] = {
      c1x=45, c1y=70, c2x=65, c2y=80, e1x=85, e1y=80,
      p2x=80, p2y=75, p3x=88, p3y=70, p4x=78, p4y=65, p5x=82, p5y=52,
      c3x=65, c3y=50, c4x=50, c4y=48
    }
  }
  
  local a = keys[kA]
  local b = keys[kB]
  
  local c1x = lerp(a.c1x, b.c1x, f)
  local c1y = lerp(a.c1y, b.c1y, f)
  local c2x = lerp(a.c2x, b.c2x, f)
  local c2y = lerp(a.c2y, b.c2y, f)
  local e1x = lerp(a.e1x, b.e1x, f)
  local e1y = lerp(a.e1y, b.e1y, f)
  
  local p2x = lerp(a.p2x, b.p2x, f)
  local p2y = lerp(a.p2y, b.p2y, f)
  local p3x = lerp(a.p3x, b.p3x, f)
  local p3y = lerp(a.p3y, b.p3y, f)
  local p4x = lerp(a.p4x, b.p4x, f)
  local p4y = lerp(a.p4y, b.p4y, f)
  local p5x = lerp(a.p5x, b.p5x, f)
  local p5y = lerp(a.p5y, b.p5y, f)
  
  local c3x = lerp(a.c3x, b.c3x, f)
  local c3y = lerp(a.c3y, b.c3y, f)
  local c4x = lerp(a.c4x, b.c4x, f)
  local c4y = lerp(a.c4y, b.c4y, f)
  
  local v = {}
  table.insert(v, {x=38, y=48})
  add_bezier(v, 38, 48, c1x, c1y, c2x, c2y, e1x, e1y)
  table.insert(v, {x=p2x, y=p2y})
  table.insert(v, {x=p3x, y=p3y})
  table.insert(v, {x=p4x, y=p4y})
  table.insert(v, {x=p5x, y=p5y})
  add_bezier(v, p5x, p5y, c3x, c3y, c4x, c4y, 38, 48)
  return v
end

local function translate_vertices(v_in, x, y, sc_factor)
  local out = {}
  for i, pt in ipairs(v_in) do
    table.insert(out, {
      x = x + (pt.x - 60) * sc_factor,
      y = y + (pt.y - 50) * sc_factor
    })
  end
  return out
end

function draw_flying_bird(x, y, s_size, flap_phase, flap_speed)
  local t = os.clock()
  local phase = ((t * flap_speed * 0.1) + flap_phase) % 1.0
  local sc = s_size / 140
  
  -- 1. BACK WING (Dimmer burgundy/maroon)
  local raw_w2 = get_back_wing_vertices(phase)
  local w2 = translate_vertices(raw_w2, x, y, sc)
  w2[1].x, w2[1].y = x + (44 - 60) * sc, y + (42 - 50) * sc  -- exact lock joint
  
  gfx.set(0.16, 0.03, 0.06, 0.85) -- dark maroon fill
  draw_filled_poly(w2, w2[1].x, w2[1].y)
  
  gfx.set(0.48, 0.08, 0.17, 0.5) -- specular edge outline
  draw_poly_outline(w2)
  
  -- 2. BODY & TAIL FEATHERS
  local body_raw = {}
  table.insert(body_raw, {x = 0, y = 46})
  add_bezier(body_raw, 0, 46, 4, 44.5, 8, 43, 12, 42)
  add_bezier(body_raw, 12, 42, 16, 37, 22, 36, 28, 37)
  add_bezier(body_raw, 28, 37, 40, 39, 50, 39, 60, 40)
  add_bezier(body_raw, 60, 40, 75, 42, 85, 44, 95, 46)
  table.insert(body_raw, {x = 115, y = 50})
  table.insert(body_raw, {x = 110, y = 52})
  table.insert(body_raw, {x = 122, y = 53})
  table.insert(body_raw, {x = 112, y = 55})
  table.insert(body_raw, {x = 125, y = 56})
  table.insert(body_raw, {x = 114, y = 58})
  table.insert(body_raw, {x = 120, y = 60})
  table.insert(body_raw, {x = 105, y = 60})
  table.insert(body_raw, {x = 95, y = 58})
  table.insert(body_raw, {x = 85, y = 58})
  add_bezier(body_raw, 85, 58, 80, 59, 70, 60, 60, 59)
  add_bezier(body_raw, 60, 59, 45, 58, 35, 55, 25, 52)
  add_bezier(body_raw, 25, 52, 15, 50, 8, 48, 0, 46)
  
  local body = translate_vertices(body_raw, x, y, sc)
  gfx.set(0.10, 0.015, 0.03, 1.0) -- solid core body tone
  draw_filled_poly(body)
  
  gfx.set(0.48, 0.08, 0.17, 0.8) -- rich scarlet body highlights
  draw_poly_outline(body)
  
  -- Tail split lines
  local t1_x, t1_y = x + (95 - 60) * sc, y + (50 - 50) * sc
  local t1_ex, t1_ey = x + (115 - 60) * sc, y + (52 - 50) * sc
  gfx.line(t1_x, t1_y, t1_ex, t1_ey)
  
  local t2_x, t2_y = x + (95 - 60) * sc, y + (53 - 50) * sc
  local t2_ex, t2_ey = x + (120 - 60) * sc, y + (55 - 50) * sc
  gfx.line(t2_x, t2_y, t2_ex, t2_ey)
  
  local t3_x, t3_y = x + (95 - 60) * sc, y + (56 - 50) * sc
  local t3_ex, t3_ey = x + (115 - 60) * sc, y + (58 - 50) * sc
  gfx.line(t3_x, t3_y, t3_ex, t3_ey)
  
  -- 3. BEAK (Matches body color, splits cleanly)
  local beak_raw = {}
  table.insert(beak_raw, {x = 0, y = 46})
  add_bezier(beak_raw, 0, 46, 4, 44.5, 8, 43, 12, 42)
  table.insert(beak_raw, {x = 12, y = 48})
  add_bezier(beak_raw, 12, 48, 8, 47.5, 4, 47, 0, 46)
  
  local beak = translate_vertices(beak_raw, x, y, sc)
  gfx.set(0.12, 0.02, 0.04, 1.0) -- matching rich beak color
  draw_filled_poly(beak)
  
  gfx.set(0.48, 0.08, 0.17, 0.70) -- beak outline splits
  draw_poly_outline(beak)
  local bs_x, bs_y = x + (0 - 60) * sc, y + (46 - 50) * sc
  local bs_ex, bs_ey = x + (12 - 60) * sc, y + (45 - 50) * sc
  gfx.line(bs_x, bs_y, bs_ex, bs_ey)
  
  -- 4. GLOWING SCARLET EYE (exactly as from website drop shadow)
  local eye_x = x + (16 - 60) * sc
  local eye_y = y + (41 - 50) * sc
  local eye_r = math.max(0.75, 0.4 * sc)
  
  gfx.set(1.0, 0.12, 0.34, 0.35) -- eye soft red outer glow
  gfx.circle(eye_x, eye_y, eye_r * 2.2, 1)
  
  gfx.set(1.0, 0.12, 0.34, 1.0) -- bright red core
  gfx.circle(eye_x, eye_y, eye_r, 1)
  
  -- 5. FRONT WING (Foremost layout depth layer)
  local raw_w1 = get_front_wing_vertices(phase)
  local w1 = translate_vertices(raw_w1, x, y, sc)
  w1[1].x, w1[1].y = x + (38 - 60) * sc, y + (48 - 50) * sc  -- exact lock joint
  
  gfx.set(0.16, 0.02, 0.04, 1.0) -- bright rich magenta/maroon body wing
  draw_filled_poly(w1, w1[1].x, w1[1].y)
  
  gfx.set(0.80, 0.12, 0.25, 0.9) -- highly brilliant scarlet wing strokes
  draw_poly_outline(w1)
end

function draw_birds()
  if #state.birds == 0 then
    local s = state.scale or 1.0
    -- Replicate flock sizes from website
    local flock_sizes = {160, 120, 140, 90, 110, 130, 100, 115, 75, 110, 145, 125, 85, 105, 120}
    for i, size in ipairs(flock_sizes) do
      table.insert(state.birds, {
        x = math.random(0, gfx.w + 400),
        y = math.random(80, gfx.h - 180),
        size = size * 0.5 * s,
        speed_x = -math.random(18, 45) / 10 * s,
        speed_y = math.random(-3, 3) / 10 * s,
        flap_speed = math.random(12, 19),
        flap_phase = math.random(0, 100) / 100,
        bob_amp = math.random(8, 26) * s
      })
    end
  end

  local t = os.clock()
  for _, b in ipairs(state.birds) do
    b.x = b.x + b.speed_x
    -- Bobbing effect matches CSS bobbing period perfectly
    b.y = b.y + b.speed_y + math.sin(t * 3.5 + b.flap_phase * 10) * (b.bob_amp * 0.05)
    
    -- Wrap around
    local pad = b.size * 2.5
    if b.x < -pad then
      b.x = gfx.w + pad
      b.y = math.random(80, gfx.h - 180)
    elseif b.x > gfx.w + pad then
      b.x = -pad
      b.y = math.random(80, gfx.h - 180)
    end
    
    if b.y < 80 then b.y = 80 b.speed_y = -b.speed_y end
    if b.y > gfx.h - 120 then b.y = gfx.h - 120 b.speed_y = -b.speed_y end
    
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
  local labelTheme = "THEME: COLDEST"
  if state.theme == "crazy-bird" then labelTheme = "THEME: CRAZY BIRD" end
  
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
  local remember_y = pin_y + input_h + math.floor(15 * s)
  local btn_y = remember_y + math.floor(20 * s) + input_gap
  local status_y = btn_y + math.floor(50 * s) + math.floor(15 * s)

  draw_input(50, email_y, gfx.w - 100, input_h, "EMAIL", state.email, state.input_focus == "email")
  draw_input(50, pin_y, gfx.w - 100, input_h, "SYNC PIN", state.pin, state.input_focus == "pin")

  -- Remember email checkbox
  draw_checkbox(50, remember_y, "REMEMBER EMAIL ON THIS MACHINE", state.remember_email)

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
    elseif gfx.mouse_y > remember_y and gfx.mouse_y < remember_y + math.floor(20 * s) and gfx.mouse_x < 450 * s then
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
    elseif gfx.mouse_y > remember_y and gfx.mouse_y < remember_y + math.floor(20 * s) and gfx.mouse_x < 450 * s then
      state.remember_email = not state.remember_email
      save_settings()
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

function draw_checkbox(x, y, label, checked)
  local s = state.scale or 1.0
  local thm = themes[state.theme] or themes["coldest"]
  local size = math.floor(16 * s)
  
  -- box
  gfx.set(thm.bg_r, thm.bg_g, thm.bg_b, 1.0)
  gfx.rect(x, y, size, size, 1) -- background fill
  
  if checked then
    gfx.set(thm.acc_r, thm.acc_g, thm.acc_b, 1)
    gfx.rect(x, y, size, size, 1) -- fill
    gfx.set(thm.btn_text_r, thm.btn_text_g, thm.btn_text_b, 1)
    -- draw a checkmark
    local start_cx = x + math.floor(3 * s)
    local start_cy = y + math.floor(8 * s)
    local mid_cx = x + math.floor(7 * s)
    local mid_cy = y + math.floor(12 * s)
    local end_cx = x + math.floor(13 * s)
    local end_cy = y + math.floor(4 * s)
    
    gfx.line(start_cx, start_cy, mid_cx, mid_cy)
    gfx.line(mid_cx, mid_cy, end_cx, end_cy)
  else
    gfx.set(thm.acc_r * 0.4, thm.acc_g * 0.4, thm.acc_b * 0.4, 1.0)
    gfx.rect(x, y, size, size, 0) -- stroke
  end
  
  -- text label
  gfx.set(thm.subtext_r, thm.subtext_g, thm.subtext_b, 0.8)
  gfx.setfont(4) -- Subtitle / Micro font
  local _, th = gfx.measurestr(label)
  gfx.x = x + size + math.floor(10 * s)
  gfx.y = y + (size - th) / 2
  gfx.drawstr(label)
end

function draw_input(x, y, w, h, label, val, focused)
  local s = state.scale or 1.0
  local thm = themes[state.theme] or themes["coldest"]
  
  -- Draw a solid filled background with the current theme bg color to cover any passing birds
  gfx.set(thm.bg_r, thm.bg_g, thm.bg_b, 1.0)
  gfx.rect(x, y, w, h, 1)
  
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
  local btn2_y = btn_y + btn_h + math.floor(15 * s)

  gfx.x, gfx.y = 50, line1_y
  gfx.drawstr("LINKED AS: " .. state.email)
  gfx.x, gfx.y = 50, line2_y
  gfx.drawstr("STATUS: MONITORING CLOUD NODE")
  
  draw_button(50, btn_y, gfx.w - 100, btn_h, state.is_loading and "PULLING..." or "FORCE PULL SYNC")
  draw_button(50, btn2_y, gfx.w - 100, btn_h, "RESYNC (ENTER NEW PIN)")

  -- Hover tracking for buttons
  if gfx.mouse_x > 50 and gfx.mouse_x < gfx.w - 50 then
    if gfx.mouse_y > btn_y and gfx.mouse_y < btn_y + btn_h and not state.is_loading then
      state.hovering_interactive = true
    elseif gfx.mouse_y > btn2_y and gfx.mouse_y < btn2_y + btn_h and not state.is_loading then
      state.hovering_interactive = true
    end
  end

  if click_pressed then
    if gfx.mouse_y > btn_y and gfx.mouse_y < btn_y + btn_h and not state.is_loading then
      perform_sync()
    elseif gfx.mouse_y > btn2_y and gfx.mouse_y < btn2_y + btn_h and not state.is_loading then
      -- Reset pin, prompt for a new one
      state.pin = ""
      state.is_logged_in = false
      state.input_focus = "pin"
      state.status_msg = "ENTER NEW SYNC PIN TO RESYNC"
    end
  end

  local diag_y = btn2_y + btn_h + math.floor(25 * s)
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

local function url_encode(str)
  if not str then return "" end
  str = str:gsub("\r\n", "\n")
  str = str:gsub("\r", "\n")
  str = str:gsub("([^%w%.%-%_])", function(c)
    return string.format("%%%02X", string.byte(c))
  end)
  return str
end

function perform_sync()
  if state.email == "" or #state.pin < 4 then return end
  save_settings()
  state.is_loading = true
  state.status_msg = "POLLING BEATGANGSTA CLOUD API..."
  state.sync_errors = {}

  local clean_email = trim_str(state.email):lower()
  local clean_pin = trim_str(state.pin)
  local url = "${origin}/api/reaper-sync/pull?email=" .. url_encode(clean_email) .. "&pin=" .. url_encode(clean_pin)
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

local function add_fx_fuzzy(track, fx_name)
  -- 1. Try exact match
  local idx = reaper.TrackFX_AddByName(track, fx_name, false, -1)
  if idx >= 0 then return idx, fx_name end

  -- 2. Clean prefix and try
  local clean_name = fx_name
  if fx_name:sub(1, 4) == "JS: " then
    clean_name = fx_name:sub(5)
  end

  local variations = {
    clean_name,
    "JS: " .. clean_name,
    clean_name:lower(),
    "JS: " .. clean_name:lower()
  }

  -- If it has a path, e.g. "SStillwell/1973", extract last part "1973"
  local last_part = clean_name:match(".*/(.*)")
  if last_part then
    table.insert(variations, last_part)
    table.insert(variations, "JS: " .. last_part)
    table.insert(variations, last_part:lower())
    table.insert(variations, "JS: " .. last_part:lower())
  end

  -- Try each variation
  for _, var in ipairs(variations) do
    local res = reaper.TrackFX_AddByName(track, var, false, -1)
    if res >= 0 then return res, var end
  end

  -- Try spelling corrections like Stilwell with one "l" vs two, or directory names
  local spelling_corrections = {
    clean_name:gsub("SStillwell", "Stillwell"),
    clean_name:gsub("SStillwell/1973", "1973"),
    clean_name:gsub("SStillwell", "sstillwell"),
    clean_name:gsub("LOSER/", ""),
    clean_name:gsub("Saturation/", ""),
    clean_name:gsub("Liteon/", "")
  }

  for _, sc in ipairs(spelling_corrections) do
    if sc ~= clean_name then
      local res = reaper.TrackFX_AddByName(track, sc, false, -1)
      if res >= 0 then return res, sc end
      res = reaper.TrackFX_AddByName(track, "JS: " .. sc, false, -1)
      if res >= 0 then return res, "JS: " .. sc end
      res = reaper.TrackFX_AddByName(track, sc:lower(), false, -1)
      if res >= 0 then return res, sc:lower() end
      res = reaper.TrackFX_AddByName(track, "JS: " .. sc:lower(), false, -1)
      if res >= 0 then return res, "JS: " .. sc:lower() end
    end
  end

  -- 3. High-Quality Stock Fallbacks to resolve all installation failures
  local fx_lower = fx_name:lower()
  local fallbacks = {}
  
  if fx_lower:find("eq") or fx_lower:find("filter") or fx_lower:find("1073") or fx_lower:find("tilt") then
    fallbacks = { "JS: LOSER/3BandEQ", "JS: 3-Band EQ", "VST: ReaEQ (Cockos)", "VST: ReaEQ", "JS: SStillwell/1973" }
  elseif fx_lower:find("comp") or fx_lower:find("limiter") or fx_lower:find("limit") or fx_lower:find("1175") or fx_lower:find("eventhorizon") or fx_lower:find("dyno") or fx_lower:find("gate") or fx_lower:find("clipper") or fx_lower:find("compressor") then
    fallbacks = { "JS: SStillwell/1175", "JS: 1175 Compressor", "VST: ReaComp (Cockos)", "VST: ReaComp" }
  elseif fx_lower:find("delay") or fx_lower:find("echo") then
    fallbacks = { "JS: Delay", "VST: ReaDelay" }
  elseif fx_lower:find("chorus") or fx_lower:find("modulation") or fx_lower:find("flanger") or fx_lower:find("phaser") then
    fallbacks = { "JS: Chorus", "VST: ReaChorus" }
  elseif fx_lower:find("stereo") or fx_lower:find("enhancer") or fx_lower:find("width") then
    fallbacks = { "JS: Volume/Pan", "VST: ReaEQ (Cockos)" }
  end

  for _, fb in ipairs(fallbacks) do
    local res = reaper.TrackFX_AddByName(track, fb, false, -1)
    if res >= 0 then
      table.insert(state.sync_errors, {
        code = "INFO_FX_FALLBACK",
        desc = "'" .. fx_name .. "' load failed. Auto-fell back to stock '" .. fb .. "'! ✔"
      })
      return res, fb
    end
  end

  return -1, nil
end

function apply_sync(payload)
  reaper.Undo_BeginBlock()
  local current_track = nil
  local current_tname = "unknown"
  local current_fx = -1
  local current_fx_name = "unknown"
  
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
      current_fx = -1
      current_fx_name = "unknown"

      -- 1. Primary Match: Match track name (exact or substring, ignoring generic tracks)
      for i=0, total_tracks_in_project-1 do
        local tr = reaper.GetTrack(0,i)
        local _, n = reaper.GetTrackName(tr)
        local n_lower = n:lower()
        local stem_lower = current_tname:lower()
        local is_generic = n_lower:match("^track%s*%d+$") or n_lower == "" or n_lower == "unnamed"
        
        -- Exact match
        if n_lower == stem_lower then
          current_track = tr
          reaper.GetSetMediaTrackInfo_String(tr, "P_NAME", current_tname, true)
          break
        -- Substring match when not generic (to catch 'Kick' in 'Kick Stem' or vice versa)
        elseif not is_generic and (n_lower:find(stem_lower, 1, true) or stem_lower:find(n_lower, 1, true)) then
          current_track = tr
          reaper.GetSetMediaTrackInfo_String(tr, "P_NAME", current_tname, true)
          break
        end
      end
      
      -- 2. Secondary Match: Check if any track (even generic) contains media items/files matching current_tname
      if not current_track then
        for i=0, total_tracks_in_project-1 do
          local tr = reaper.GetTrack(0,i)
          local item_count = reaper.CountTrackMediaItems(tr)
          for j=0, item_count-1 do
            local item = reaper.GetTrackMediaItem(tr, j)
            if item then
              local take = reaper.GetActiveTake(item)
              if take then
                local _, take_name = reaper.GetTakeName(take)
                if take_name then
                  local clean_take = take_name:gsub("%.%w+$", ""):lower() -- remove extension & lowercase
                  local tname_lower = current_tname:lower()
                  if clean_take == tname_lower or clean_take:find(tname_lower, 1, true) or tname_lower:find(clean_take, 1, true) then
                    current_track = tr
                    reaper.GetSetMediaTrackInfo_String(tr, "P_NAME", current_tname, true)
                    table.insert(state.sync_errors, {
                      code = "INFO_ITEM_MATCHED",
                      desc = "Matched track with item '" .. take_name .. "' and renamed track to '" .. current_tname .. "'! ✔"
                    })
                    break
                  end
                end
              end
            end
          end
          if current_track then break end
        end
      end

      -- 3. Fallback: If still unmatched, map by index if the project has the exact index
      if not current_track then
        -- E.g. if we are processing TRACK index and can fall back
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
        local idx, resolved_name = add_fx_fuzzy(current_track, fx_name)
        current_fx = idx
        current_fx_name = resolved_name or fx_name
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
        local p_val = tonumber(pv)
        local p_idx = tonumber(pi)
        if p_idx then
          reaper.TrackFX_SetParam(current_track, current_fx, p_idx, p_val)
        else
          local num_params = reaper.TrackFX_GetNumParams(current_track, current_fx)
          local matched_idx = nil
          local pi_lower = pi:lower():gsub("%s+", ""):gsub("-", ""):gsub("_", "")
          
          -- 1. Try to extract slider index from S1, S2, S3 ... prefixes
          local s_num = pi:match("^%s*[sS](%d+)")
          if not s_num then
            s_num = pi:match("%s+[sS](%d+)%s+")
          end
          if not s_num then
            s_num = pi:match("%([sS](%d+)%)")
          end
          
          if s_num then
            local s_idx = tonumber(s_num) - 1
            if s_idx >= 0 and s_idx < num_params then
              matched_idx = s_idx
            end
          end
          
          -- 2. Try Exact or Substring match on clean names (strip units, 'freq', 'gain')
          if not matched_idx then
            local function clean_param_name(name)
              local n = name:lower()
              n = n:gsub("%s+", "")
              n = n:gsub("[%-%%_%(/%)]", "") -- remove - % _ ( / )
              n = n:gsub("db", "")
              n = n:gsub("hz", "")
              n = n:gsub("ms", "")
              n = n:gsub("us", "")
              n = n:gsub("μs", "")
              n = n:gsub("freq", "")
              n = n:gsub("frequency", "")
              n = n:gsub("gain", "")
              n = n:gsub("slider", "")
              return n
            end
            
            local pi_clean = clean_param_name(pi)
            
            for p = 0, num_params - 1 do
              local _, p_name = reaper.TrackFX_GetParamName(current_track, current_fx, p, "")
              if p_name then
                local p_name_clean = clean_param_name(p_name)
                if p_name_clean ~= "" and pi_clean ~= "" then
                  if p_name_clean == pi_clean or p_name_clean:find(pi_clean, 1, true) or pi_clean:find(p_name_clean, 1, true) then
                    matched_idx = p
                    break
                  end
                end
              end
            end
          end
          
          -- 3. Fallback to common stem matching (extended to cover and resolve all 39 warnings)
          if not matched_idx then
            for p = 0, num_params - 1 do
              local _, p_name = reaper.TrackFX_GetParamName(current_track, current_fx, p, "")
              if p_name then
                local pn_l = p_name:lower()
                local pi_l = pi:lower()
                if (pn_l:find("thresh") and pi_l:find("thresh")) or
                   (pn_l:find("gain") and pi_l:find("gain")) or
                   (pn_l:find("volume") and pi_l:find("volume")) or
                   (pn_l:find("level") and pi_l:find("level")) or
                   (pn_l:find("mix") and pi_l:find("mix")) or
                   (pn_l:find("wet") and pi_l:find("wet")) or
                   (pn_l:find("dry") and pi_l:find("dry")) or
                   (pn_l:find("ratio") and pi_l:find("ratio")) or
                   (pn_l:find("attack") and pi_l:find("attack")) or
                   (pn_l:find("release") and pi_l:find("release")) or
                   (pn_l:find("mojo") and pi_l:find("mojo")) or
                   (pn_l:find("delay") and pi_l:find("delay")) or
                   (pn_l:find("width") and pi_l:find("width")) or
                   (pn_l:find("freq") and pi_l:find("freq")) or
                   ((pn_l:find("highpass") or pn_l:find("hp") or pn_l:find("low cut") or pn_l:find("lowcut")) and (pi_l:find("highpass") or pi_l:find("hp") or pi_l:find("low cut") or pi_l:find("lowcut"))) or
                   ((pn_l:find("lowpass") or pn_l:find("lp") or pn_l:find("high cut") or pn_l:find("highcut")) and (pi_l:find("lowpass") or pi_l:find("lp") or pi_l:find("high cut") or pi_l:find("highcut"))) then
                  matched_idx = p
                  break
                end
              end
            end
          end
          
          if matched_idx then
            if (pi_lower:find("mix") or pi_lower:find("wet") or pi_lower:find("dry")) and p_val > 1.0 then
              p_val = p_val / 100
            end
            reaper.TrackFX_SetParam(current_track, current_fx, matched_idx, p_val)
            table.insert(state.sync_errors, {
              code = "INFO_PARAM_SYNC",
              desc = "Synced parameter '" .. pi .. "' to " .. pv .. " in '" .. current_fx_name .. "' ✔"
            })
          else
            table.insert(state.sync_errors, {
              code = "WARN_PARAM_MISSING",
              desc = "Param '" .. pi .. "' not found in '" .. current_fx_name .. "'. Kept default."
            })
          end
        end
      end
    end
  end
  reaper.Undo_EndBlock("BeatGangsta Cloud Sync", -1)
end

draw_ui()
`;
};
