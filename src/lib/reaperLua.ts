
export const getReaperLua = (origin: string) => {
  const version = "2.2.0";
  return String.raw`-- BeatGangsta Connect for REAPER
-- Version ${version} (Premium Coldest Iced Edition)
-- Author: BeatGangsta AI

local version = "${version}"
local script_path = debug.getinfo(1,'S').source:match([[^@?(.*[/\\])]])
local logo_path = script_path .. "beatgangsta_logo.png"
local logo_img = -1

-- UI Configuration
gfx.init("BEATGANGSTA • CONNECT", 450, 650)
gfx.setfont(1, "Arial", 18, 98)
gfx.setfont(2, "Arial", 14, 98)

local state = {
  email = "",
  pin = "",
  is_logged_in = false,
  is_loading = false,
  status_msg = "READY TO CONNECT",
  input_focus = "email" -- "email" or "pin"
}

function Msg(val)
  reaper.ShowConsoleMsg(tostring(val).."\n")
end

function draw_ui()
  -- Background (Coldest Slate)
  gfx.set(0.05, 0.05, 0.1, 1)
  gfx.rect(0, 0, gfx.w, gfx.h, 1)

  -- Logo Img
  if logo_img == -1 then logo_img = gfx.loadimg(0, logo_path) end
  if logo_img >= 0 then
    local lw, lh = gfx.getimgdim(logo_img)
    local target_w = 120
    local target_h = (lh / lw) * target_w
    gfx.blit(logo_img, 1, 0, 0, 0, lw, lh, (gfx.w/2) - (target_w/2), 40, target_w, target_h)
  end

  gfx.set(1, 1, 1, 1)
  gfx.setfont(1, "Arial", 28, 98)
  local tx = "BEATGANGSTA"
  local tw, th = gfx.measurestr(tx)
  gfx.x, gfx.y = (gfx.w/2) - (tw/2), 180
  gfx.drawstr(tx)

  gfx.set(0.2, 0.6, 1.0, 1)
  gfx.setfont(2, "Arial", 12, 98)
  local sub = "CLOUD SYNC LINK v" .. version
  local sw, sh = gfx.measurestr(sub)
  gfx.x, gfx.y = (gfx.w/2) - (sw/2), 215
  gfx.drawstr(sub)

  if not state.is_logged_in then
    draw_login()
  else
    draw_dashboard()
  end

  gfx.update()
  if gfx.getchar() >= 0 then reaper.defer(draw_ui) end
end

function draw_login()
  local center_x = gfx.w / 2
  
  -- Help text
  gfx.set(1,1,1,0.6)
  gfx.setfont(2, "Arial", 14, 98)
  local help = "ENTER YOUR ACCOUNT DETAILS"
  local hw = gfx.measurestr(help)
  gfx.x, gfx.y = center_x - (hw/2), 260
  gfx.drawstr(help)

  -- Inputs
  draw_input(50, 300, gfx.w - 100, 40, "EMAIL", state.email, state.input_focus == "email")
  draw_input(50, 370, gfx.w - 100, 40, "SYNC PIN", string.rep("*", #state.pin), state.input_focus == "pin")

  -- Action Button
  draw_button(50, 450, gfx.w - 100, 50, state.is_loading and "POLLING..." or "LINK REAPER NODE")

  -- Status
  gfx.set(1, 1, 1, 0.4)
  local sw = gfx.measurestr(state.status_msg)
  gfx.x, gfx.y = center_x - (sw/2), 520
  gfx.drawstr(state.status_msg)

  -- Interaction
  if gfx.mouse_cap == 1 then
    if gfx.mouse_y > 300 and gfx.mouse_y < 340 then state.input_focus = "email"
    elseif gfx.mouse_y > 370 and gfx.mouse_y < 410 then state.input_focus = "pin"
    elseif gfx.mouse_y > 450 and gfx.mouse_y < 500 and not state.is_loading then
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
  if focused then gfx.set(0.2, 0.6, 1.0, 1) else gfx.set(0.2, 0.2, 0.3, 1) end
  gfx.rect(x, y, w, h, 0)
  gfx.set(1,1,1,0.5)
  gfx.x, gfx.y = x, y - 18
  gfx.drawstr(label)
  gfx.set(1,1,1,1)
  gfx.x, gfx.y = x + 10, y + 12
  gfx.drawstr(val)
end

function draw_button(x, y, w, h, text)
  gfx.set(0.1, 0.5, 0.9, 1)
  gfx.rect(x, y, w, h, 1)
  gfx.set(1, 1, 1, 1)
  local tw, th = gfx.measurestr(text)
  gfx.x, gfx.y = x + (w - tw)/2, y + (h - th)/2
  gfx.drawstr(text)
end

function draw_dashboard()
  gfx.set(1,1,1,0.8)
  gfx.x, gfx.y = 50, 300
  gfx.drawstr("LINKED AS: " .. state.email)
  gfx.x, gfx.y = 50, 330
  gfx.drawstr("STATUS: MONITORING CLOUD NODE")
  draw_button(50, 400, gfx.w - 100, 50, "FORCE PULL SYNC")
end

function perform_sync()
  if state.email == "" or #state.pin < 4 then return end
  state.is_loading = true
  state.status_msg = "POLLING BEATGANGSTA CLOUD API..."

  local url = "${origin}/api/reaper-sync/pull?email=" .. state.email .. "&pin=" .. state.pin
  local tmp = os.tmpname()
  if tmp:sub(1,1) == "\\" then tmp = os.getenv("TMP") .. tmp end

  local cmd = (string.find(reaper.GetOS(), "Win") ~= nil) and 'curl.exe -sL "' or 'curl -sL "'
  os.execute(cmd .. url .. '" -o "' .. tmp .. '"')

  local f = io.open(tmp, "r")
  if f then
    local content = f:read("*all")
    f:close()
    os.remove(tmp)
    if content ~= "" and not content:match("error") then
      apply_sync(content)
      state.is_logged_in = true
      state.status_msg = "SYNC SUCCESSFUL!"
    else
      state.status_msg = "ERROR: NO DATA FOUND"
    end
  else
    state.status_msg = "NETWORK ERROR"
  end
  state.is_loading = false
end

function apply_sync(payload)
  reaper.Undo_BeginBlock()
  local current_track = nil
  local current_fx = -1
  for line in payload:gmatch("([^\n]+)") do
    line = line:gsub("\r", "")
    if line:sub(1,6) == "TRACK|" then
      local tname = line:sub(7)
      current_track = nil
      for i=0, reaper.CountTracks(0)-1 do
        local tr = reaper.GetTrack(0,i)
        local _, n = reaper.GetTrackName(tr)
        if n == tname then current_track = tr break end
      end
    elseif line:sub(1,3) == "FX|" and current_track then
      current_fx = reaper.TrackFX_AddByName(current_track, line:sub(4), false, -1)
    elseif line:sub(1,6) == "PARAM|" and current_track and current_fx >= 0 then
      local pstr = line:sub(7)
      local pi, pv = pstr:match("([^|]+)|([^|]+)")
      if pi and pv then reaper.TrackFX_SetParam(current_track, current_fx, tonumber(pi), tonumber(pv)) end
    end
  end
  reaper.Undo_EndBlock("BeatGangsta Cloud Sync", -1)
end

draw_ui()
`;
};
