export interface AutomationChain {
  id: string;
  name: string;
  category: 'beats' | 'lead_vocal' | 'ad_lib' | 'backing_vocal';
  producer: string;
  description: string;
  plugins: string[];
}

export const JSFX_AUTOMATION_CHAINS: AutomationChain[] = [
  // BEATS & INSTRUMENTALS
  {
    id: 'dilla_drunk_swing',
    name: 'J Dilla "Drunk Swing" Micro-Shifting',
    category: 'beats',
    producer: 'J Dilla',
    description: 'For rigid instrumentals, automate \'JS: Time Adjustment\' randomly between -10ms and +15ms on snares and hi-hats to pull them off the grid, giving the beat a woozy, humanized Detroit hip-hop swing.',
    plugins: ['JS: Time Adjustment']
  },
  {
    id: 'daft_punk_french_pump',
    name: 'Daft Punk "French Touch" Pumping Compression',
    category: 'beats',
    producer: 'Daft Punk',
    description: 'Set up a sidechain compressor (\'JS: 1175\' or similar) on the entire instrumental bus keyed to the kick drum. Automate the threshold and ratio to create an exaggerated, breathing, rhythmic pumping effect synonymous with French house music.',
    plugins: ['JS: 1175 Compressor']
  },
  {
    id: 'timbaland_beatbox_pan',
    name: 'Timbaland "Beatbox" Stereo Panning',
    category: 'beats',
    producer: 'Timbaland',
    description: 'On percussion or drum stems, use \'JS: Auto-Pan\' or automate manual panning rapidly across the stereo field on 16th or 32nd note subdivisions during fills, making the drums scramble frantically around the listener\'s head.',
    plugins: ['JS: Auto-Pan']
  },
  {
    id: 'kanye_mpc_stutter',
    name: 'Kanye West "MPC" Sample Stutter',
    category: 'beats',
    producer: 'Kanye West',
    description: 'Use \'JS: Tremolo\' or \'JS: Noise Gate\' set to a rigid square wave at 1/16th or 1/8th note sync, automating it to turn on strictly at the end of every 4th bar to create a classic MPC-style sample stutter/chop effect.',
    plugins: ['JS: Tremolo', 'JS: Noise Gate']
  },
  {
    id: 'noah_40_underwater_filter',
    name: 'Noah "40" Shebib "Underwater" Filter Automation',
    category: 'beats',
    producer: 'Noah "40" Shebib',
    description: 'Automate a steep low-pass filter (\'JS: RBJ Highpass/Lowpass Filters\') down to 300Hz-800Hz on the entire instrumental track during verses or intros, cutting all treble and making the beat sound entirely submerged underwater, then snapping back to full frequency on the drop.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'flume_granular_freeze',
    name: 'Flume "Granular Glitch" Freeze',
    category: 'beats',
    producer: 'Flume',
    description: 'Send synth or instrumental stems into a fast \'JS: Delay (Lo-Fi)\', automating the feedback to 100% and delay time to sub-10ms increments on transition points, creating a metallic, buzzing granular freeze that abruptly cuts off into silence.',
    plugins: ['JS: Delay (Lo-Fi)']
  },
  {
    id: 'rick_rubin_def_jam_sat',
    name: 'Rick Rubin "Def Jam" Extreme Saturation Drop',
    category: 'beats',
    producer: 'Rick Rubin',
    description: 'Automate \'JS: Distortion (Fuzz)\' or tape saturation (\'JClones AC2\') on the drum bus to violently overdrive the drums for one specific measure before a chorus, creating explosive analog energy right before the lead vocal re-enters.',
    plugins: ['JS: Distortion (Fuzz)', 'JClones AC2']
  },
  {
    id: 'neptunes_dry_bone_eq',
    name: 'The Neptunes / Pharrell "Dry-as-a-Bone" Subtractive EQ',
    category: 'beats',
    producer: 'The Neptunes / Pharrell',
    description: 'Aggressively carve out the lower-mid frequencies (200Hz - 400Hz) using \'JS: ReJJ/ReEQ\' and strip all reverb/delay off the instrumental bus, leaving a skeletal, ultra-dry, perfectly separated arrangement where the bass and snare hit like hammers.',
    plugins: ['JS: ReJJ/ReEQ']
  },
  {
    id: 'metro_dark_trap_half',
    name: 'Metro Boomin "Dark Trap" Half-Time Slowdown',
    category: 'beats',
    producer: 'Metro Boomin',
    description: 'Automate a pitch drop (-12 semitones via \'JS: Pitch Shifter 2\') combined with a low-pass filter (\'JS: RBJ Highpass/Lowpass Filters\') to slow down the entire instrumental loop at the end of the song or during a bridge, creating a syrupy, menacing half-time trap transition.',
    plugins: ['JS: Pitch Shifter 2', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'aphex_twin_idm_lfo',
    name: 'Aphex Twin "IDM" Random Filter Sweeps',
    category: 'beats',
    producer: 'Aphex Twin',
    description: 'Assign a fast, chaotic LFO to the cutoff frequency of a bandpass filter (\'JS: RBJ Highpass/Lowpass Filters\') applied to hi-hats or synths, automating the LFO depth to twitch and squelch aggressively, creating unpredictable, glitchy IDM textures.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters']
  },

  // MAIN / LEAD VOCALS
  {
    id: 'andy_wallace_throw',
    name: 'Andy Wallace Throw',
    category: 'lead_vocal',
    producer: 'Andy Wallace',
    description: 'A sudden 1/4 or 1/2 note delay on the very last word of a verse, automated via auxiliary send or wet mix. Feeds a dark, warm analog style delay with high feedback.',
    plugins: ['JS: Delay']
  },
  {
    id: 'mick_guzauski_width',
    name: 'Mick Guzauski Stereo Width',
    category: 'lead_vocal',
    producer: 'Mick Guzauski',
    description: 'Dual-delay throw (e.g. 1/8 note Left, 1/8 dotted Right) precisely on key sustained lyrical vowel sounds. The stereo width expands right as the vocal finishes the phrase.',
    plugins: ['JS: Delay']
  },
  {
    id: 'tom_elmhirst_plate',
    name: 'Tom Elmhirst Plate Sweep',
    category: 'lead_vocal',
    producer: 'Tom Elmhirst',
    description: 'An automated reverb send that spikes to 30% wet exactly on the last word of an emotional ballad section, decaying slowly over 4-6 seconds to transition into the next section.',
    plugins: ['Tukan Lexikan 2']
  },
  {
    id: 'cla_slapback',
    name: 'Chris Lord-Alge Slapback',
    category: 'lead_vocal',
    producer: 'Chris Lord-Alge',
    description: 'A high-feedback stereo slapback tape echo (120-140ms) automated to trigger ONLY on accented verbs or punchy adjectives to highlight the rhythm of the performance.',
    plugins: ['JClones AC2']
  },
  {
    id: 'serban_ghenea_shimmer',
    name: 'Serban Ghenea Shimmer Delay',
    category: 'lead_vocal',
    producer: 'Serban Ghenea',
    description: 'Send a specific syllable to a highly compressed, high-passed delay (cutoff below 500Hz) with high-frequency saturation, creating a crisp, metallic halo sitting above a dense pop chorus.',
    plugins: ['JS: Delay', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'sylvia_massy_spill',
    name: 'Sylvia Massy Saturator Spill',
    category: 'lead_vocal',
    producer: 'Sylvia Massy',
    description: 'Throw the last word of a tense vocal phrase into a parallel highly-distorted, filtering tube saturator with a long reverb tail, letting the vocal feedback self-oscillate as the beat drops out.',
    plugins: ['JS: Distortion (Fuzz)', 'Tukan Lexikan 2']
  },
  {
    id: 'tchad_blake_spring',
    name: 'Tchad Blake Binaural Spring Echo',
    category: 'lead_vocal',
    producer: 'Tchad Blake',
    description: 'Extreme, fast automated panning of a dark spring reverb/delay throw across the stereo field on a specific whispered or spoken word for an eerie, 3D effect.',
    plugins: ['JS: Delay', 'JS: Auto-Pan']
  },
  {
    id: 'metro_detuned_bounce',
    name: 'Metro Boomin Detuned Trap Bounce',
    category: 'lead_vocal',
    producer: 'Metro Boomin',
    description: 'A detuned, filtered delay throw on the final word of backing vocals/ad-libs, using a pitch-shifter inside the delay feedback loop to drop the pitch by 12 semitones.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Delay']
  },
  {
    id: 'jimmy_douglass_triplet',
    name: 'Jimmy Douglass Syncopated Triplet',
    category: 'lead_vocal',
    producer: 'Jimmy Douglass',
    description: 'A 1/4-triplet or 1/8-triplet delay throw on the last two words of a fast rap line, perfectly locked into the syncopated off-beats of the pocket.',
    plugins: ['JS: Delay']
  },
  {
    id: 'noah_40_underwater_wash',
    name: 'Noah \'40\' Shebib Underwater Wash',
    category: 'lead_vocal',
    producer: 'Noah "40" Shebib',
    description: 'A lowpassed hall reverb/delay throw (cutoff above 800Hz) on vocal breaks, creating a nostalgic, submerged ambient pocket.',
    plugins: ['Tukan Lexikan 2', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'butch_vig_megaphone',
    name: 'Butch Vig Distorted Megaphone Accent',
    category: 'lead_vocal',
    producer: 'Butch Vig',
    description: 'Automate \'JS: Bad Buss Mojo Waveshaper\' \'Mojo\' and \'JS: RBJ Highpass/Lowpass Filters\' (setting HP to 500Hz, LP to 3kHz) on key ending verbs or angry adjectives, creating a sudden, gritty, telephone/megaphone vocal pop that cuts right through the dense rock chorus.',
    plugins: ['JS: Bad Buss Mojo Waveshaper', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'prince_micro_pitch',
    name: 'Prince Stereo Micro-Pitch Doubler',
    category: 'lead_vocal',
    producer: 'Prince',
    description: 'Dynamically throw specific sustained nouns into \'JS: Saturated Chorus\' or dual micro-pitch shifted lanes (+/- 9 cents) using \'JS: Pitch Shifter 2\' panned hard left and right. This instantly widens the vocal tail and makes it bloom in the stereo field as the phrase ends.',
    plugins: ['JS: Saturated Chorus', 'JS: Pitch Shifter 2']
  },
  {
    id: 'les_paul_flanger',
    name: 'Les Paul Trippy Tape Flanger Sweep',
    category: 'lead_vocal',
    producer: 'Les Paul',
    description: 'Trigger a sudden psychedelic comb-filtering effect on the last syllable of a transition line by automating the wet mix of \'JS: Flanger\' or \'JS: Saturated Chorus\' from 0% to 50% along with a rising feedback rate, creating a vintage reel-to-reel tape flanging effect.',
    plugins: ['JS: Flanger', 'JS: Saturated Chorus']
  },
  {
    id: 'finneas_whisper_gate',
    name: 'Finneas ASMR Whisper Gate/Compressor',
    category: 'lead_vocal',
    producer: 'Finneas',
    description: 'Automate \'JS: Noise Gate\' \'Threshold\' and \'JClones CA2A\' \'Peak Reduction\' on intimate whispered ad-libs or vocal tails to bring out ultra-quiet mouth noises and breathing transients to a high level, then snap-gate them shut instantly to keep the background dead quiet.',
    plugins: ['JS: Noise Gate', 'JClones CA2A']
  },
  {
    id: 'daft_punk_talkbox',
    name: 'Daft Punk Talkbox Vocoder Morph',
    category: 'lead_vocal',
    producer: 'Daft Punk',
    description: 'Throw specific key ending words into a resonant formant filter (\'JS: Moog 4-Pole Filter\' or bandpass filters) with automated LFO rate and resonance sweeps, turning the natural throat tone into a synthetic, metallic talkbox vocal right before the beat drops.',
    plugins: ['JS: Moog 4-Pole Filter']
  },
  {
    id: 'jimi_hendrix_phaser',
    name: 'Jimi Hendrix / Eddie Kramer Swirling Phaser Orbit',
    category: 'lead_vocal',
    producer: 'Jimi Hendrix',
    description: 'Dynamically route a vocal ad-lib or screaming phrase-end into \'JS: Phaser\' with high resonance and speed, automating the width to sweep from mono to 200%, making the vocal swirl around the listener’s head in a vintage, psychedelic orbit.',
    plugins: ['JS: Phaser']
  },
  {
    id: 'jjp_tube_sat',
    name: 'Jack Joseph Puig Tube Saturation Peak',
    category: 'lead_vocal',
    producer: 'Jack Joseph Puig',
    description: 'Automate \'JClones AC1 (Analog Channel)\' \'Saturation\' or \'JS: Distortion (Fuzz)\' wet mix to drive hard on accented vocal peak phrases. This gives the words an upfront, aggressive vintage tube warm drive that sits right in the listener\'s forehead.',
    plugins: ['JClones AC1', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'billie_eilish_shimmer',
    name: 'Billie Eilish Intimate Treble Shimmer',
    category: 'lead_vocal',
    producer: 'Billie Eilish',
    description: 'Send key whispered lyrics into a parallel high-frequency boost using \'JS: ReJJ/ReEQ\' (boosting 10kHz+ by +12dB with a shelf) and automate a fast compressor like \'Tukan NC76\' to clamp down hard, creating a glassy, breathy sibilance halo.',
    plugins: ['JS: ReJJ/ReEQ', 'Tukan NC76']
  },
  {
    id: 'brian_eno_octave_swell',
    name: 'Brian Eno Generative Octave Swell',
    category: 'lead_vocal',
    producer: 'Brian Eno',
    description: 'Send key vocal phrase endings or single-note ad-libs into an octave-up pitch-shifter (\'JS: Pitch Shifter 2\' set to +12 semitones) inside a feedback loop of \'Tukan Lexikan 2\' hall reverb, generating an evolving, atmospheric, angelic shimmer cloud that decays slowly over 8 seconds.',
    plugins: ['JS: Pitch Shifter 2', 'Tukan Lexikan 2']
  },
  {
    id: 'george_martin_reverse',
    name: 'George Martin Dynamic Reverse Sweep',
    category: 'lead_vocal',
    producer: 'George Martin',
    description: 'Throw a key transition phrase into \'JS: Delay\' with automated negative time offset or reverse delay simulation, coupled with a highpass filter sweep, to create an unsettling, rising reverse vocal sweep that pulls the listener directly into the next chorus downbeat.',
    plugins: ['JS: Delay']
  },
  {
    id: 'lee_perry_dub_spill',
    name: 'Lee "Scratch" Perry Dub Feedback Spill',
    category: 'lead_vocal',
    producer: 'Lee "Scratch" Perry',
    description: 'Sudden automation of feedback and wet mix on a tape-style delay (\'JS: Delay (Lo-Fi)\' or \'JS: Delay w/Chorus\'), letting the echo run wild into self-oscillation on a drum rimshot or vocal ending, then instantly muting the feedback parameter to clean it up before the next bar begins.',
    plugins: ['JS: Delay (Lo-Fi)', 'JS: Delay w/Chorus']
  },
  {
    id: 'katy_perry_stutter',
    name: 'Katy Perry / Dr. Luke Pop Stutter Pitch-Ramp',
    category: 'lead_vocal',
    producer: 'Katy Perry / Dr. Luke',
    description: 'Take a key lyric vowel, route it into an automated gate or \'JS: Saturated Chorus\', and automate a pitch shifter (\'JS: Pitch Shifter 2\') to rise from 0 to +12 semitones dynamically over a 1-bar transition, accelerating the speed of a tremolo or gating plugin to create a rapid-fire synthetic riser.',
    plugins: ['JS: Saturated Chorus', 'JS: Pitch Shifter 2']
  },
  {
    id: 'bob_clearmountain_panning',
    name: 'Bob Clearmountain Dual-Mono Panning Bounce',
    category: 'lead_vocal',
    producer: 'Bob Clearmountain',
    description: 'Send key ending syllables to separate Left and Right delay lines with different rhythmic settings (e.g. 1/4 note Left, 1/4 triplet Right) and automate \'JS: Auto-Pan\' or volume sliders to sweep the Left/Right channels in opposing directions, creating an expansive, wide stereo motion that floats across the speaker field.',
    plugins: ['JS: Auto-Pan']
  },
  {
    id: 'rick_rubin_clipper',
    name: 'Rick Rubin Heavy Metal Parallel Hard-Clipper',
    category: 'lead_vocal',
    producer: 'Rick Rubin',
    description: 'Send dynamic vocal peaks or aggressive drum accents into a parallel channel featuring \'JS: Bad Buss Mojo Waveshaper\' set to maximum overdrive and a hard-clipper, blending the dirty signal with the main dry vocal only on emphasized words for a gritty, bone-crushing modern metal grit.',
    plugins: ['JS: Bad Buss Mojo Waveshaper']
  },
  {
    id: 'mark_ronson_tape_sweep',
    name: 'Mark Ronson Warm Motown Tape-Saturation Sweep',
    category: 'lead_vocal',
    producer: 'Mark Ronson',
    description: 'Trigger a sudden warmth enhancement on transitional vocal ad-libs by automating \'JClones AC2 (Tape Emulator)\' \'Drive\' from 30% to 80% combined with a slow, automated lowpass filter cutoff sweep, mimicking a dusty 60s reel-to-reel machine being pushed into red tape compression.',
    plugins: ['JClones AC2']
  },
  {
    id: 'al_schmitt_plate',
    name: 'Al Schmitt Invisible Golden-Era Plate Blend',
    category: 'lead_vocal',
    producer: 'Al Schmitt',
    description: 'Send high-register sustained notes of lead vocals into \'Tukan Lexikan 2\' configured as a classic EMT 140 plate reverb, automating the send level to swell beautifully to 20% on the sustained note, letting the natural vocal tail bloom into a wide, glassy high-end sheen with zero low-end mud.',
    plugins: ['Tukan Lexikan 2']
  },
  {
    id: 'stephen_street_jangle',
    name: 'Stephen Street Jangle-Pop Chorus Width',
    category: 'lead_vocal',
    producer: 'Stephen Street',
    description: 'Trigger a sudden wide, lofi/high-gloss chorus effect on acoustic guitars or vocal harmony tracks at the start of the chorus by automating the wet mix of \'JS: Saturated Chorus\' or \'JS: Flanger\' from 0% to 45%, letting the tracks shimmer and wrap around the listeners\' heads.',
    plugins: ['JS: Saturated Chorus', 'JS: Flanger']
  },
  {
    id: 'rent_reznor_snare_gate',
    name: 'Trent Reznor Industrial Gated Distorted Dust',
    category: 'lead_vocal',
    producer: 'Trent Reznor',
    description: 'Automate an envelope filter and extreme distortion using \'JS: Bad Buss Mojo Waveshaper\' and \'JS: Moog 4-Pole Filter\' on backing vocals, sidechain-linked to the main industrial snare, so the distorted, dirty vocal dust is gate-chopped in sync with the snare strikes.',
    plugins: ['JS: Bad Buss Mojo Waveshaper', 'JS: Moog 4-Pole Filter']
  },
  {
    id: 'michael_brauer_multibus',
    name: 'Michael Brauer Multi-Bus Saturation Bloom',
    category: 'lead_vocal',
    producer: 'Michael Brauer',
    description: 'Automate the send levels of a lead vocal into four distinct parallel buses (compressor, saturator, micro-pitch shifter, and space-delay), swelling the saturation and micro-pitch buses dynamically on specific key descriptive adjectives to make the words jump out of the speakers with three-dimensional gravity.',
    plugins: ['JS: Stereo Field Manipulator', 'JS: Saturated Chorus']
  },
  {
    id: 'bruce_swedien_double',
    name: 'Bruce Swedien Wide-Spread Double-Track',
    category: 'lead_vocal',
    producer: 'Bruce Swedien',
    description: 'Throw key ending lyrics into an automated micro-delay (10-25ms) on a parallel bus using \'JS: Stereo Field Manipulator\' set to absolute maximum Haas-effect panning. This dynamically widens the phrase-ends into a massive, wide double-track with zero frequency cancellation.',
    plugins: ['JS: Stereo Field Manipulator']
  },
  {
    id: 'sylvia_robinson_slap',
    name: 'Sylvia Robinson Old-School Hip-Hop Tape Slap Echo',
    category: 'lead_vocal',
    producer: 'Sylvia Robinson',
    description: 'Trigger a tight, warm 15 IPS slapback tape echo (80-110ms) on key rap punchlines and nouns using \'JClones AC2 (Tape Emulator)\' driven hard into tape saturation, adding instant 1970s analog weight and vintage vibe.',
    plugins: ['JClones AC2']
  },
  {
    id: 'aphex_twin_glitch',
    name: 'Aphex Twin Glitchy Granular Stutter',
    category: 'lead_vocal',
    producer: 'Aphex Twin',
    description: 'Automate a tiny, ultra-short loop buffer or extreme rate tremolo/gate using \'JS: Noise Gate\' with sidechain trigger, combined with high-speed pitch LFO sweeps, to turn a single spoken ending syllable into a digital granular glitch that resets on the next beat.',
    plugins: ['JS: Noise Gate']
  },
  {
    id: 'william_orbit_ray',
    name: 'William Orbit Ambient "Ray of Light" Filter Sweep',
    category: 'lead_vocal',
    producer: 'William Orbit',
    description: 'Throw a key transition lyric or vocal tail into a high-feedback modulated delay (\'JS: Floaty (Modulated Delay)\'), and automate \'JS: Moog 4-Pole Filter\' lowpass cutoff to sweep from 200Hz up to 15kHz, letting the echo bloom into glorious digital brightness.',
    plugins: ['JS: Delay (Floaty)', 'JS: Moog 4-Pole Filter']
  },
  {
    id: 'geoff_emerick_adt',
    name: 'Geoff Emerick Vintage Abbey Road Automatic Double Tracking (ADT)',
    category: 'lead_vocal',
    producer: 'Geoff Emerick',
    description: 'Emulate the legendary Abbey Road tape-doubling effect on key vocal phrase entries. Automate the wet mix of a tiny pitch-drift delay (15-30ms delay with 1-2Hz slow LFO) using \'JClones AC2 (Tape Emulator)\' to create organic, shifting chorus doubles that mimic a real tape speed variation.',
    plugins: ['JClones AC2']
  },
  {
    id: 'finneas_monster_low',
    name: 'Finneas "Bad Guy" Low-Octave Monster Vocal',
    category: 'lead_vocal',
    producer: 'Finneas',
    description: 'Parallel-pitch shift a whispering key vocal noun down 12 semitones using \'JS: Pitch Shifter 2\' panned center, heavily compressing it with \'Tukan NC76\', creating a menacing, low-frequency monster double that sits directly under the dry lead vocal on the beat.',
    plugins: ['JS: Pitch Shifter 2', 'Tukan NC76']
  },
  {
    id: 'eddie_kramer_rotary',
    name: 'Eddie Kramer Rotary Speaker Orbit',
    category: 'lead_vocal',
    producer: 'Eddie Kramer',
    description: 'Route high-register vocal ad-libs or long falsetto tails into a vintage Leslie rotary speaker emulator (\'JS: Phaser\' or \'JS: Saturated Chorus\' with fast frequency rate and depth) to make the vocal swirl in a warm, pulsing mechanical circle.',
    plugins: ['JS: Phaser', 'JS: Saturated Chorus']
  },
  {
    id: 'kanye_808s_glitch',
    name: 'Kanye West "808s & Heartbreak" Robotic Glitch Throw',
    category: 'lead_vocal',
    producer: 'Kanye West',
    description: 'Send particular emotional sustained vocal syllables into \'JS: Saturated Chorus\' with a fast rate and heavy pitch-quantized auto-pitch simulator, mixed with high-gain \'JS: Distortion (Fuzz)\', to create a heartbreaking, robotic vocal glitch.',
    plugins: ['JS: Saturated Chorus', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'bob_ezrin_epic_opera',
    name: 'Bob Ezrin Epic Opera Reverb Explosion',
    category: 'lead_vocal',
    producer: 'Bob Ezrin',
    description: 'Automate the wet mix of \'Tukan Lexikan 2\' hall reverb from 5% to 60% with a 6-second decay on the final dramatic note of a rock ballad, instantly expanding the dry, intimate vocal into an enormous, cavernous stadium-rock arena space.',
    plugins: ['Tukan Lexikan 2']
  },
  {
    id: 'max_martin_double_stage',
    name: 'Max Martin "Double-Stage" Pop Leveler',
    category: 'lead_vocal',
    producer: 'Max Martin',
    description: 'Run an aggressive 1176-style peak limiter (\'Tukan NC76\') with fast attack/release into an opto leveler (\'JClones CA2A\'). Automate the dual compression thresholds dynamically during transitions to maintain a perfectly uniform, locked-in vocal volume in explosive pop hooks.',
    plugins: ['Tukan NC76', 'JClones CA2A']
  },
  {
    id: 'tony_maserati_glossy_presence',
    name: 'Tony Maserati "Glossy Presence" Saturation',
    category: 'lead_vocal',
    producer: 'Tony Maserati',
    description: 'Dynamically boost a high-shelf at 12kHz by +6dB with \'JS: ReJJ/ReEQ\' on key choruses, driving it directly into analog console saturation with \'JClones AC1\'. This adds a high-end vintage gloss and gorgeous presence to the lead vocal without causing harsh digital sibilance.',
    plugins: ['JS: ReJJ/ReEQ', 'JClones AC1']
  },
  {
    id: 'manny_marroquin_dynamic_space',
    name: 'Manny Marroquin "Dynamic Space" Pitch-Spread Reverb',
    category: 'lead_vocal',
    producer: 'Manny Marroquin',
    description: 'Feed a parallel vocal send into micro-pitch shifting (+/- 7 cents via \'JS: Pitch Shifter 2\') and route it into a massive hall reverb (\'Tukan Lexikan 2\'). Automate the send level to swell during vocal rests to let the wider space blossom, then instantly duck it when the lead returns.',
    plugins: ['JS: Pitch Shifter 2', 'Tukan Lexikan 2']
  },
  {
    id: 'flood_moulder_dark_width',
    name: 'Flood & Alan Moulder "Depeche Mode" Dark Chorus Width',
    category: 'lead_vocal',
    producer: 'Flood & Alan Moulder',
    description: 'Set up an automated flanger/chorus layer in parallel. During verse-to-chorus build-ups, automate the LFO rate and wet mix of \'JS: Flanger\' and \'JS: Saturated Chorus\' to rise on sustained vowels, instantly expanding the vocal image to the extreme edges of the stereo field.',
    plugins: ['JS: Flanger', 'JS: Saturated Chorus']
  },
  {
    id: 'kanye_dean_runaway_vocoder',
    name: 'Kanye West & Mike Dean "Runaway" Vocoder Distortion',
    category: 'lead_vocal',
    producer: 'Kanye West & Mike Dean',
    description: 'Run parallel backing vocal or lead vocals through a pitch shifter set to a perfect fifth (+7 semitones via \'JS: Pitch Shifter 2\'), drive it aggressively into extreme fuzzy overdrive (\'JS: Distortion (Fuzz)\'), and sweep an automated \'JS: Moog 4-Pole Filter\' to recreate the legendary singing synth-guitar tone.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Distortion (Fuzz)', 'JS: Moog 4-Pole Filter']
  },
  {
    id: 'daniel_lanois_solitary_spring',
    name: 'Daniel Lanois "Solitary" Vintage Spring Echo',
    category: 'lead_vocal',
    producer: 'Daniel Lanois',
    description: 'Feed the lead vocal into a dark analog style delay (\'JS: Delay\') with high feedback, routing it into a tape emulator (\'JClones AC2\') with heavy wow/flutter. Automate the delay wet mix to swell on single solitary words, letting the warm tape flutter fade away organically.',
    plugins: ['JS: Delay', 'JClones AC2']
  },
  {
    id: 'dave_pensado_hiphop_edge',
    name: 'Dave Pensado "Hip-Hop Edge" Exaggerated Exciter',
    category: 'lead_vocal',
    producer: 'Dave Pensado',
    description: 'Throw key hip-hop punchlines or fast rap syllables into a parallel high-pass filter (cutting below 5kHz via \'JS: ReJJ/ReEQ\') and saturate it to the maximum using \'JS: Bad Buss Mojo Waveshaper\'. Blend the gritty, ultra-crisp signal back in with the dry lead for extreme clarity and edge.',
    plugins: ['JS: ReJJ/ReEQ', 'JS: Bad Buss Mojo Waveshaper']
  },
  {
    id: 'spike_stent_parallel_pump',
    name: 'Spike Stent "Parallel Pump" Indie Vocal Drive',
    category: 'lead_vocal',
    producer: 'Spike Stent',
    description: 'Route the lead vocal to an auxiliary channel. Apply aggressive 1176 style limiting (\'Tukan NC76\') set to "all-buttons-in" mode and blend with subtle fuzz distortion (\'JS: Distortion (Fuzz)\'). Automate the parallel blend level to climb during the main chorus sections, lending an industrial, indie rock energy.',
    plugins: ['Tukan NC76', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'jimmy_iovine_upfront_fet',
    name: 'Jimmy Iovine "Classic Rock" Up-Front In-Your-Face FET',
    category: 'lead_vocal',
    producer: 'Jimmy Iovine',
    description: 'Slam the lead vocal with a fast, solid-state FET compressor (\'JS: 1175 Compressor\') with a 4:1 ratio. Automate the release parameter to run fast during fast vocal passages to pull out breathing details, then slow it down during sustained high notes to keep the compression smooth and extremely punchy.',
    plugins: ['JS: 1175 Compressor']
  },
  {
    id: 'rich_costey_muse_wah',
    name: 'Rich Costey "Futuristic Muse" High-Resonant Wah',
    category: 'lead_vocal',
    producer: 'Rich Costey',
    description: 'Pass the lead vocal through a low-pass/band-pass filter with high resonance (\'JS: Moog 4-Pole Filter\'). Automate the cutoff frequency to sweep in sync with the song\'s tempo on dramatic pre-choruses, followed by a wide \'JS: Saturated Chorus\' to create a dynamic, synth-like talkbox vocal performance.',
    plugins: ['JS: Moog 4-Pole Filter', 'JS: Saturated Chorus']
  },
  {
    id: 'phil_spector_mono_spill',
    name: 'Phil Spector "Wall of Sound" Mono Reverb Spill',
    category: 'lead_vocal',
    producer: 'Phil Spector',
    description: 'Compress the lead vocal aggressively, sum it to absolute mono, and run it through a dark plate reverb (\'Tukan Lexikan 2\'). Automate the saturation drive (\'JClones AC1\') to push the reverb tail into warm analog tape compression, creating a cohesive, vintage, and incredibly dense mono wall of sound.',
    plugins: ['Tukan Lexikan 2', 'JClones AC1']
  },
  {
    id: 'tony_visconti_gated_room',
    name: 'Tony Visconti "Bowie Heroes" Gated Room',
    category: 'lead_vocal',
    producer: 'Tony Visconti',
    description: 'Recreate the legendary Hansa Studios room setup. Place a deep room reverb (\'Tukan Lexikan 2\') on a parallel track, followed immediately by a fast noise gate (\'JS: Noise Gate\') sidechain-linked to the lead vocal channel. Set the gate threshold high so the room reflections burst open only during Bowie-style explosive vocal peaks.',
    plugins: ['Tukan Lexikan 2', 'JS: Noise Gate']
  },
  {
    id: 'dr_dre_surgical_air',
    name: 'Dr. Dre "Surgical Air" West Coast Sheen',
    category: 'lead_vocal',
    producer: 'Dr. Dre',
    description: 'Aggressively boost the high-shelf EQ at 12kHz by +8dB using \'JS: ReJJ/ReEQ\', then send it into a fast, transparent limiter (\'Tukan NC76\') with a high ratio. Automate the threshold during choruses to keep the vocal locked at the absolute front of the mix with crystalline, upfront, razor-sharp presence.',
    plugins: ['JS: ReJJ/ReEQ', 'Tukan NC76']
  },
  {
    id: 'jack_endino_grunge_grit',
    name: 'Jack Endino "Grunge Grit" Parallel Saturation',
    category: 'lead_vocal',
    producer: 'Jack Endino',
    description: 'Bandpass the vocal double from 400Hz to 4kHz using \'JS: RBJ Highpass/Lowpass Filters\', drive it hard with a heavy fuzz clipper (\'JS: Distortion (Fuzz)\'), and blend it at 15% wet underneath the clean lead. Automate the parallel fader to rise during intense grunge choruses for raw, bone-crushing grit and sustain.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'alan_parsons_ducked_delay',
    name: 'Alan Parsons "Progressive Echo" Ducked Gated Delay',
    category: 'lead_vocal',
    producer: 'Alan Parsons',
    description: 'Set up an automated auxiliary delay send (\'JS: Delay\') followed by a sidechain gate (\'JS: Noise Gate\'). The gate stays closed while the lead vocal is singing, then opens instantly during rests. Automate the feedback and wet parameters on key phrase endings to create a pristine, trailing progressive rock echo.',
    plugins: ['JS: Delay', 'JS: Noise Gate']
  },
  {
    id: 'rick_rubin_dry_proximity',
    name: 'Rick Rubin "Def Jam Dry" Intimate Proximity',
    category: 'lead_vocal',
    producer: 'Rick Rubin',
    description: 'Completely strip away all reverb and delay sends. Use console tape emulation (\'JClones AC1\') to add a thick low-mid saturation warmth around 200Hz, and level the signal with an opto compressor (\'Tukan NC76\'). Automate the makeup gain to pull up mouth breathing details, placing the dry performance directly in the listener’s ears.',
    plugins: ['JClones AC1', 'Tukan NC76']
  },
  {
    id: 'john_congleton_ring_mod',
    name: 'John Congleton "Art-Rock" Ring Mod Swell',
    category: 'lead_vocal',
    producer: 'John Congleton',
    description: 'Introduce a highly unconventional, dissonant edge. Automate the wet mix of a subtle ring modulator (\'JS: Ring Modulator\') with a high-frequency carrier from 0% to 25% on key emotional screech, scream, or high-register vocal points, adding a cold, mechanical, and abrasive metallic art-rock texture.',
    plugins: ['JS: Ring Modulator']
  },
  {
    id: 'pharrell_clavinet_formant',
    name: 'Pharrell Williams "Clavinet Formant" Percussive Accent',
    category: 'lead_vocal',
    producer: 'Pharrell Williams',
    description: 'Set up a high-resonance bandpass filter (\'JS: Moog 4-Pole Filter\') on a secondary vocal track. Automate a 1/16th-note tremolo (\'JS: Tremolo\') to sync up only on key rhythmic consonants and vowel hits in the hook, giving the vocal layer a percussive, clavinet-like synthesized formant quality.',
    plugins: ['JS: Moog 4-Pole Filter', 'JS: Tremolo']
  },
  {
    id: 'chris_coady_shoegaze_shimmer',
    name: 'Chris Coady "Shoegaze Shimmer" Pitch-Shift Delay',
    category: 'lead_vocal',
    producer: 'Chris Coady',
    description: 'Send the lead vocal to a parallel path containing a micro-pitch shifter (\'JS: Pitch Shifter 2\' set to +12 cents) and a slow, lush stereo chorus (\'JS: Saturated Chorus\'), feeding into a long modulated delay. Automate the parallel fader to swell during dense shoegaze guitar choruses, creating a dreamy, swirling vocal halo.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Saturated Chorus', 'JS: Delay']
  },
  {
    id: 'roy_thomas_baker_tape_flange',
    name: 'Roy Thomas Baker "Tape Flange" Sweep',
    category: 'lead_vocal',
    producer: 'Roy Thomas Baker',
    description: 'Emulate authentic manual tape flanging by routing the vocal through a speed modulator. During transitional fill measures, automate the flanger LFO rate and wet mix (\'JS: Flanger\') to swell, creating a dramatic, whooshing comb-filtering effect that swoops across the stereo image and pulls the listener into the next section.',
    plugins: ['JS: Flanger']
  },
  {
    id: 'butch_vig_garbage_sub_octave',
    name: 'Butch Vig "Garbage" Sub-Octave Blend',
    category: 'lead_vocal',
    producer: 'Butch Vig',
    description: 'Send the lead vocal to a parallel sub-octave shifter (\'JS: Pitch Shifter 2\' set to -12 semitones) and drive it hard using a wave-shaping saturation plugin (\'JS: Bad Buss Mojo Waveshaper\'). Automate the fader to blend it at 10% during heavy rock choruses, adding a menacing, industrial low-end reinforcement underneath the main performance.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Bad Buss Mojo Waveshaper']
  },
  {
    id: 'nigel_godrich_radiohead_space',
    name: 'Nigel Godrich "Radiohead Space" Tape Drift',
    category: 'lead_vocal',
    producer: 'Nigel Godrich',
    description: 'Process the lead vocal through a modulated delay (\'JS: Delay (Floaty)\') and a tape emulator (\'JClones AC2\') set to high wow and flutter. Automate the wet mix to rise on long sustained vowels, creating a ghostly, beautifully unstable, and drifting analog tape echo that floats gracefully in the background.',
    plugins: ['JS: Delay (Floaty)', 'JClones AC2']
  },
  {
    id: 'michael_brauer_motion_pan',
    name: 'Michael Brauer "Motion Panning" Multi-Bus Throw',
    category: 'lead_vocal',
    producer: 'Michael Brauer',
    description: 'Route dynamic vocal sends to a dedicated parallel panning channel using \'JS: Auto-Pan\' and \'JS: Stereo Field Manipulator\'. Automate the send level to trigger only on accented adjectives, flinging wide, rhythmic stereo reflections around the main centered lead track.',
    plugins: ['JS: Auto-Pan', 'JS: Stereo Field Manipulator']
  },
  {
    id: 'jjp_overdrive_presence',
    name: 'Jack Joseph Puig "Overdrive Presence" Console Saturation',
    category: 'lead_vocal',
    producer: 'Jack Joseph Puig',
    description: 'Drive the vocal aggressively into console channel modeling (\'JClones AC1\') and blend in a subtle parallel fuzz distortion (\'JS: Distortion (Fuzz)\'). Automate the overdrive parameters to spike during explosive chorus transitions, providing a gritty, upfront analog warmth that keeps the vocal on top of heavy synth/guitar walls.',
    plugins: ['JClones AC1', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'serban_ghenea_pop_air',
    name: 'Serban Ghenea "Pop Vocal Air" Dynamic Sheen',
    category: 'lead_vocal',
    producer: 'Serban Ghenea',
    description: 'Create a hyper-modern pop sheen. Use \'JS: ReJJ/ReEQ\' to apply a massive high-shelf boost (+10dB at 10kHz) and feed it directly into an 1176-style peak compressor (\'Tukan NC76\') set to a ultra-fast release. Automate the makeup gain to pull out intimate breath details without adding harshness.',
    plugins: ['JS: ReJJ/ReEQ', 'Tukan NC76']
  },
  {
    id: 'mutt_lange_stacked_doubler',
    name: 'Mutt Lange "Ultra-Stacked" Parallel Doubler',
    category: 'lead_vocal',
    producer: 'Mutt Lange',
    description: 'Recreate massive arena rock choruses. Run a parallel track through a micro-pitch shifter (\'JS: Pitch Shifter 2\' panned wide +/- 8 cents) and a thick chorus (\'JS: Saturated Chorus\'). Automate this wide, shimmering double to swell by +6dB exactly on the first beat of the chorus to make the vocal instantly double in size.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Saturated Chorus']
  },
  {
    id: 'stephen_street_jangle_slap',
    name: 'Stephen Street "Jangle Stereo Slap" Delay',
    category: 'lead_vocal',
    producer: 'Stephen Street',
    description: 'Apply different rhythmic delay times on Left and Right channels (e.g., 120ms Left, 140ms Right via \'JS: Delay\') combined with a Haas-effect width expander (\'JS: Stereo Field Manipulator\'). Automate the fader to bounce in on transitional drum-fills for a wide, vintage 80s indie-pop spatial reflection.',
    plugins: ['JS: Delay', 'JS: Stereo Field Manipulator']
  },
  {
    id: 'tom_elmhirst_ballad_reverb',
    name: 'Tom Elmhirst "Cavernous Ballad" Plate Swell',
    category: 'lead_vocal',
    producer: 'Tom Elmhirst',
    description: 'Configure \'Tukan Lexikan 2\' as a massive plate reverb with a 5-second decay. Automate the auxiliary send fader to climb from 5% to 45% exclusively on the final emotional vowel of a ballad verse, letting the vocal trail wash out beautifully into an expansive, reflective acoustic space.',
    plugins: ['Tukan Lexikan 2']
  },
  {
    id: 'jimmy_douglass_triplet_echo',
    name: 'Jimmy Douglass "Triplet Syncopation" Delay Throw',
    category: 'lead_vocal',
    producer: 'Jimmy Douglass',
    description: 'Set up a highly synced 1/4-triplet tape delay (\'JS: Delay\'). Draw a fast automation envelope on the delay send wet mix to capture and repeat only the final word of key rap phrases, keeping the triplets locked perfectly into the pocket of a syncopated groove.',
    plugins: ['JS: Delay']
  },
  {
    id: 'sylvia_massy_megaphone_throw',
    name: 'Sylvia Massy "Megaphone Fuzz" Filter Break',
    category: 'lead_vocal',
    producer: 'Sylvia Massy',
    description: 'Throw the vocal into a gritty, mid-focused telephone/megaphone filter by rolling off low and high frequencies (500Hz - 3.5kHz via \'JS: RBJ Highpass/Lowpass Filters\') and driving it heavily with \'JS: Distortion (Fuzz)\'. Automate this effect to engage solely on dramatic pre-chorus breaks for an aggressive, radio-style vocal accent.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'andy_wallace_stereo_spread',
    name: 'Andy Wallace "Vintage Stereo Spread" Parallel Delay',
    category: 'lead_vocal',
    producer: 'Andy Wallace',
    description: 'Recreate the legendary rock mixing signature. Run the lead vocal through a very short delay (e.g., 15-30ms) panned hard opposite to the dry vocal, combined with a 1176-style peak limiter (\'Tukan NC76\') to squash dynamic peaks. Automate the wet mix to rise on key phrases, creating a massive, ultra-wide stereo spread that punches directly through dense walls of rock guitars.',
    plugins: ['JS: Delay', 'JS: Stereo Field Manipulator', 'Tukan NC76']
  },
  {
    id: 'cla_blue_stripe_push',
    name: 'Chris Lord-Alge "In-Your-Face" Blue-Stripe Push',
    category: 'lead_vocal',
    producer: 'Chris Lord-Alge',
    description: 'Slam the lead vocal with a modeled blue-stripe FET compressor (\'JS: 1175 Compressor\') at an 8:1 ratio, and push a massive +8dB shelf boost at 8kHz and a +4dB boost at 3kHz using \'JS: ReJJ/ReEQ\'. Automate the compressor input level dynamically during choruses to pin the vocal at the absolute front of the mix with relentless, hyper-compressed energy.',
    plugins: ['JS: 1175 Compressor', 'JS: ReJJ/ReEQ']
  },
  {
    id: 'bob_clearmountain_dual_echo',
    name: 'Bob Clearmountain "Dual-Echo" Chamber Wash',
    category: 'lead_vocal',
    producer: 'Bob Clearmountain',
    description: 'Feed the lead vocal into a dual-mono delay network set to non-harmonious times (e.g., 180ms Left, 240ms Right) and route the delay output directly into a lush plate reverb (\'Tukan Lexikan 2\'). Automate the echo sends on final words of verses to create a pristine, cascading stereo tail that melts seamlessly into the background.',
    plugins: ['JS: Delay', 'Tukan Lexikan 2']
  },
  {
    id: 'steve_albini_room_explosion',
    name: 'Steve Albini "In Utero" Room Explosion',
    category: 'lead_vocal',
    producer: 'Steve Albini',
    description: 'Mimic organic room microphone response. Route the vocal into a dense stereo room reverb (\'Tukan Lexikan 2\') driven hard by console channel saturation (\'JClones AC1\'). Set a rapid noise gate (\'JS: Noise Gate\') to burst open on loud, peak-level screams and snap shut immediately on silence, capturing raw, explosive acoustic energy.',
    plugins: ['Tukan Lexikan 2', 'JS: Noise Gate', 'JClones AC1']
  },
  {
    id: 'brian_eno_oblique_drift',
    name: 'Brian Eno "Oblique Stratagem" Pitch Drift',
    category: 'lead_vocal',
    producer: 'Brian Eno',
    description: 'Run a parallel vocal channel through a micro-pitch shifter set to +/- 15 cents, modulated by a slow, sweeping phaser (\'JS: Phaser\') and a floating delay (\'JS: Delay (Floaty)\'). Automate the feedback and phaser rate to float freely, creating a haunting, beautiful, and ever-changing ambient vocal cloud.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Phaser', 'JS: Delay (Floaty)']
  },
  {
    id: 'george_martin_abbey_road_adt',
    name: 'George Martin "Abbey Road" Artificial Double Tracking (ADT)',
    category: 'lead_vocal',
    producer: 'George Martin',
    description: 'Recreate the historic ADT effect. Send the vocal to a parallel tape delay path (\'JS: Delay\' set to 20-40ms) and use tape emulation (\'JClones AC2\') to introduce subtle, random speed variations (wow & flutter). Automate the delay time by +/- 5ms to simulate manual tape machine speed manipulation, producing a rich, organic double-tracked chorus.',
    plugins: ['JS: Delay', 'JClones AC2']
  },
  {
    id: 'lee_scratch_perry_black_ark',
    name: 'Lee "Scratch" Perry "Black Ark" Dub Sweep',
    category: 'lead_vocal',
    producer: 'Lee "Scratch" Perry',
    description: 'Route the vocal send to a tape delay (\'JS: Delay\') with feedback set to the edge of self-oscillation. Insert a gritty phaser (\'JS: Phaser\') and mild saturation (\'JS: Distortion (Fuzz)\') in the feedback loop. Sweep the delay time and phaser rate manually during instrumental breaks to generate dub-style psychedelic feedback vortexes.',
    plugins: ['JS: Delay', 'JS: Phaser', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'trent_reznor_bit_smasher',
    name: 'Trent Reznor "Industrial Bit-Smasher" Saturation',
    category: 'lead_vocal',
    producer: 'Trent Reznor',
    description: 'Destroy the vocal signal to fit in an industrial mix. Run the lead through a bitcrusher (\'JS: Bit Reduction/Dither\') reducing to 6-bit depth, and drive it into fuzzy distortion (\'JS: Distortion (Fuzz)\'). Automate the cutoff frequency of a highly resonant low-pass filter (\'JS: Moog 4-Pole Filter\') to sweep during heavy rhythm sections for a tearing, synthetic, machine-like vocal snarl.',
    plugins: ['JS: Bit Reduction/Dither', 'JS: Moog 4-Pole Filter', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'dave_fridmann_tube_blowout',
    name: 'Dave Fridmann "Psychedelic Tube Blowout" Compression',
    category: 'lead_vocal',
    producer: 'Dave Fridmann',
    description: 'Emulate highly pushed, colorful analog console preamp channels. Drive the vocal hard into console emulation (\'JClones AC1\') and apply extreme 1176-style compression (\'JS: 1175 Compressor\') to pull up tiny whispering details. During dramatic chorus climaxes, automate the dry-wet of a slow, deep chorus (\'JS: Saturated Chorus\') to swell, creating a massive, blown-out psychedelic vocal wall.',
    plugins: ['JClones AC1', 'JS: 1175 Compressor', 'JS: Saturated Chorus']
  },
  {
    id: 'bruce_swedien_acusonic_double',
    name: 'Bruce Swedien "Acusonic Double" Wide-Field Dimension',
    category: 'lead_vocal',
    producer: 'Bruce Swedien',
    description: 'Utilize Swedien\'s Acusonic co-production technique. Double track the lead vocal, panning the takes wide and treating them with an opto compressor (\'JClones CA2A\') for smooth levelling. Expand the stereo image further with \'JS: Stereo Field Manipulator\' (set to 140% width) and a subtle, high-quality chorus (\'JS: Saturated Chorus\') to deliver a pristine, ultra-wide, and three-dimensional pop vocal space.',
    plugins: ['JS: Stereo Field Manipulator', 'JClones CA2A', 'JS: Saturated Chorus']
  },
  {
    id: 'quincy_jones_dynamic_dimension',
    name: 'Quincy Jones "Thriller Pristine" Dynamic Dimension',
    category: 'lead_vocal',
    producer: 'Quincy Jones',
    description: 'Set up a pristine dual-compressor chain using a smooth opto leveler (\'JClones CA2A\') into a clean peak limiter (\'Tukan NC76\'). Automate \'JS: Stereo Channel Volume/Pan/Polarity Control\' on wide-panned backing vocals to dynamically wrap around the lead vocal, keeping the main performance focused, dynamic, and incredibly spacious.',
    plugins: ['JClones CA2A', 'Tukan NC76', 'JS: Stereo Channel Control']
  },
  {
    id: 'steve_lillywhite_stadium_swirl',
    name: 'Steve Lillywhite "Stadium Rock" Swirling Delay',
    category: 'lead_vocal',
    producer: 'Steve Lillywhite',
    description: 'Pass the vocal into a modulated chorus-delay (\'JS: Delay (Floaty)\') and a sweeping phaser (\'JS: Phaser\'). Automate the wet mix to rise on chorus lead-ins, mimicking Lillywhite\'s iconic, swirling stadium-scale vocal sound that lifts the chorus above a wall of roaring guitars.',
    plugins: ['JS: Delay (Floaty)', 'JS: Phaser']
  },
  {
    id: 'nile_rodgers_dance_gloss',
    name: 'Nile Rodgers "Let\'s Dance" Upfront Gloss',
    category: 'lead_vocal',
    producer: 'Nile Rodgers',
    description: 'Achieve a high-energy, upfront disco-pop tone. Slam the vocal with an 1176-style compressor (\'JS: 1175 Compressor\') set to a fast attack/release, then boost high-end air at 12kHz using \'JS: Shelving Filter\'. Automate the input gain dynamically to keep the performance pinned at the absolute front of a dense, funky dance rhythm section.',
    plugins: ['JS: 1175 Compressor', 'JS: Shelving Filter']
  },
  {
    id: 'sophie_hyperpop_formant_glitch',
    name: 'SOPHIE "PC Music" Formant-Shifted Glitch',
    category: 'lead_vocal',
    producer: 'SOPHIE',
    description: 'Inject a futuristic, hyper-pop aesthetic. Run the vocal through a pitch-shifter (\'JS: Pitch Shifter 2\' set to +12 semitones in parallel) into an aggressive bitcrusher (\'JS: Bit Reduction/Dither\') and a resonant bandpass filter (\'JS: Moog 4-Pole Filter\'). Automate the filter cutoff and pitch mix rapidly to create high-register, synthesized bubblegum-vocal textures.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Bit Reduction/Dither', 'JS: Moog 4-Pole Filter']
  },
  {
    id: 'jack_antonoff_cassette_wobble',
    name: 'Jack Antonoff "Bleachers" Vintage Cassette Wobble',
    category: 'lead_vocal',
    producer: 'Jack Antonoff',
    description: 'Send the vocal to a parallel path with tape emulation (\'JClones AC2\') set to extreme wow and flutter, followed by a tight 1/8-note delay (\'JS: Delay\'). Automate the parallel fader to swell during intimate verses, giving the lead a warm, slightly unstable cassette-tape nostalgia.',
    plugins: ['JClones AC2', 'JS: Delay']
  },
  {
    id: 'danger_mouse_dusty_slap',
    name: 'Danger Mouse "Gnarls" Dusty Tape Slap',
    category: 'lead_vocal',
    producer: 'Danger Mouse',
    description: 'Apply a bandpass filter (cutting below 300Hz and above 4kHz via \'JS: RBJ Highpass/Lowpass Filters\') to create a warm, vintage telephone feel. Drive it into analog tape saturation (\'JClones AC1\') and feed it into a tight, dark slapback delay (\'JS: Delay\' set to 90ms). Automate the saturation and delay level on key phrase endings for an iconic retro-soul vocal aesthetic.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JClones AC1', 'JS: Delay']
  },
  {
    id: 'tchad_blake_gritty_width',
    name: 'Tchad Blake "Binaural Grit" Dynamic Width',
    category: 'lead_vocal',
    producer: 'Tchad Blake',
    description: 'Route the vocal to a parallel channel containing a waveshaper (\'JS: Bad Buss Mojo Waveshaper\') and a stereo width expander (\'JS: Stereo Field Manipulator\'). Automate the waveshaper drive and stereo width dynamically in response to vocal intensity, creating a gritty, expansive, and highly unconventional stereo image.',
    plugins: ['JS: Bad Buss Mojo Waveshaper', 'JS: Stereo Field Manipulator']
  },
  {
    id: 'bill_laswell_dub_vortex',
    name: 'Bill Laswell "Ambient Dub" Space Vortex',
    category: 'lead_vocal',
    producer: 'Bill Laswell',
    description: 'Route the lead vocal into a warm analog delay (\'JS: Delay\') feeding a massive, dark hall reverb (\'Tukan Lexikan 2\'). Automate the delay feedback and the reverb wet mix to climb to 80% on long, sustained vocal notes, washing the vocal out into a deep, meditative, and swirling ambient dub vortex.',
    plugins: ['JS: Delay', 'Tukan Lexikan 2']
  },
  {
    id: 'dangelo_smoky_intimacy',
    name: 'D\'Angelo "Voodoo" Smoky Tape Intimacy',
    category: 'lead_vocal',
    producer: 'D\'Angelo & Questlove',
    description: 'Set up a warm, intimate vocal tone. Use tape emulation (\'JClones AC1\' or \'JClones AC2\') to saturate the low-mids (around 200Hz), and compress gently with an opto compressor (\'JClones CA2A\'). Automate a microscopic slapback delay (\'JS: Time Adjustment Delay\' set to 15ms) to shift the double slightly behind the beat, giving the vocal a smoky, laid-back groove.',
    plugins: ['JClones AC1', 'JClones CA2A', 'JS: Time Adjustment Delay']
  },
  {
    id: 'timbaland_vocal_syncopation',
    name: 'Timbaland "Shock Value" Syncopated Delay Throw',
    category: 'lead_vocal',
    producer: 'Timbaland',
    description: 'Take dynamic vocal ad-libs or percussive lead vowels, and send them to a synced 3/16-note delay (\'JS: Delay\') combined with a fast auto-panner (\'JS: Auto-Pan\'). Automate the send level to trigger only on rhythmic pick-ups, making the repeats bounce syncopatedly across the stereo field in the gaps of the beat.',
    plugins: ['JS: Delay', 'JS: Auto-Pan']
  },
  {
    id: 'mike_e_clark_carnival_calliope',
    name: 'Mike E. Clark "Carnival Calliope" Swirl',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Recreate Clark\'s signature creepy carnival vibe. Route the vocal through a pitch-shifter (\'JS: Pitch Shifter 2\' set to +4 or +7 semitones) and feed it into a fast, deep flanger (\'JS: Flanger\'). Automate the wet mix to swell dramatically during transitions, creating a swirling, dizzying calliope-like vocal accent.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Flanger']
  },
  {
    id: 'mike_e_clark_acid_rap_grit',
    name: 'Mike E. Clark "Acid Rap" Overdrive',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Drive the vocal aggressively using a vintage waveshaper (\'JS: Bad Buss Mojo Waveshaper\') and blend in parallel fuzz distortion (\'JS: Distortion (Fuzz)\'). Automate the overdrive depth dynamically on intense vocal delivery spikes to capture that gritty, raw Esham Detroit Acid Rap edge.',
    plugins: ['JS: Bad Buss Mojo Waveshaper', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'mike_e_clark_funhouse_double',
    name: 'Mike E. Clark "Funhouse" Stereo Doubler',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Create a massive, wider-than-life horrorcore double. Set up a Haas-effect delay network (\'JS: Stereo Field Manipulator\' at 150% width) with asymmetrical delays (15ms Left, 35ms Right via \'JS: Delay\'). Automate this wide double to swell during choruses, making the lead vocal instantly expand and surround the listener.',
    plugins: ['JS: Stereo Field Manipulator', 'JS: Delay']
  },
  {
    id: 'mike_e_clark_psychopathic_thrash',
    name: 'Mike E. Clark "Psychopathic" Metallic Swell',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Throw the vocal into a cold, abrasive metallic space. Automate the wet mix of a high-frequency ring modulator (\'JS: Ring Modulator\') from 0% to 30% exclusively on screaming punchlines, followed by a resonant low-pass filter (\'JS: Moog 4-Pole Filter\') to sweep dynamically for an eerie, industrial-rap texture.',
    plugins: ['JS: Ring Modulator', 'JS: Moog 4-Pole Filter']
  },
  {
    id: 'mike_e_clark_detroit_metal_scream',
    name: 'Mike E. Clark "Detroit Metal" Scream Crusher',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Designed for rap-metal crossovers. Slam the vocal with an 1176 style limiter (\'JS: 1175 Compressor\') at 20:1, run it into a harsh high-pass filter (\'JS: RBJ Highpass/Lowpass Filters\' cutting below 400Hz), and feed it into console saturation (\'JClones AC1\') to make aggressive screams slice perfectly through screaming guitars.',
    plugins: ['JS: 1175 Compressor', 'JS: RBJ Highpass/Lowpass Filters', 'JClones AC1']
  },
  {
    id: 'mike_e_clark_ringmaster_gate',
    name: 'Mike E. Clark "Ringmaster" Gated Megaphone',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Apply a steep bandpass telephone/megaphone filter (cutting below 500Hz and above 3kHz via \'JS: RBJ Highpass/Lowpass Filters\') driven by a tight, fast gate (\'JS: Noise Gate\'). Automate the gate release to snap shut instantly between syllables, keeping the distorted megaphone vocal extremely punchy and percussive.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JS: Noise Gate']
  },
  {
    id: 'mike_e_clark_sub_basement_growl',
    name: 'Mike E. Clark "Sub-Basement" Octave Growl',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Add a menacing, subterranean shadow. Send a parallel vocal to a pitch shifter (\'JS: Pitch Shifter 2\' set to -12 semitones) and compress it heavily with a fast FET compressor (\'JS: 1175 Compressor\'). Automate the fader to sneak the sub-octave growl in at 15% mix during dark verse segments for a spooky, demonic weight.',
    plugins: ['JS: Pitch Shifter 2', 'JS: 1175 Compressor']
  },
  {
    id: 'mike_e_clark_carousel_panner',
    name: 'Mike E. Clark "Carousel" Auto-Pan Sweep',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Route wide backing ad-libs into a sweeping phaser (\'JS: Phaser\') followed by a fast tempo-synced auto-panner (\'JS: Auto-Pan\'). Automate the panning depth and rate to spin rapidly around the stereo field during gaps, simulating a spinning carnival carousel.',
    plugins: ['JS: Phaser', 'JS: Auto-Pan']
  },
  {
    id: 'mike_e_clark_wicked_delay',
    name: 'Mike E. Clark "Wicked" Feedback vortex',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Set up an auxiliary tape-delay (\'JS: Delay\' or \'JS: Delay (Floaty)\') with high feedback, driving into a cavernous plate reverb (\'Tukan Lexikan 2\'). Automate the delay send and feedback to spike on the final word of key punchlines or sinister laughs, letting the sound self-oscillate and dissolve into a creepy, washing abyss.',
    plugins: ['JS: Delay', 'Tukan Lexikan 2']
  },
  {
    id: 'mike_e_clark_gothic_choir',
    name: 'Mike E. Clark "Gothic Choir" ADT Double',
    category: 'lead_vocal',
    producer: 'Mike E. Clark',
    description: 'Simulate an army of wicked voices. Double track the main vocal, apply micro-pitch detuning (\'JS: Pitch Shifter 2\' panned wide +/- 12 cents), and route into a lush, slow chorus (\'JS: Saturated Chorus\'). Automate this wide backing layer to swell during thematic horrorcore hooks, creating a massive, gothic choir density.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Saturated Chorus']
  },
  {
    id: 'three6_memphis_pitch_drop',
    name: 'DJ Paul & Juicy J "Memphis Pitch-Drop" Horrorcore',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Set a pitch shifter (\'JS: Pitch Shifter 2\') in parallel to -12 semitones and drive it hard into \'JS: Distortion (Fuzz)\'. Automate the pitch fader to slide downwards on dark, repetitive vocal chants, bringing out that eerie, classic 90s Memphis horrorcore atmosphere.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'three6_chopped_stutter',
    name: 'DJ Paul & Juicy J "Chopped & Stutter" Gate',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Automate a square-wave tremolo or gate (\'JS: Tremolo\') to sync at 1/16th or 1/8th note values on repeating triplets or hook vocals. Automate the wet mix from 0% to 100% on key transitions to create a perfectly sliced, percussive stutter effect.',
    plugins: ['JS: Tremolo']
  },
  {
    id: 'three6_tape_hiss_telephone',
    name: 'DJ Paul & Juicy J "Smoked-Out" Tape Telephone',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Filter out the high and low end (bandpass 400Hz - 3.5kHz via \'JS: RBJ Highpass/Lowpass Filters\') and run it through a heavy tape emulator (\'JClones AC2\') with saturated drive. Automate the mix to engage during pre-verse hype sections, simulating a dusty, smoked-out cassette tape telephone vocal.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JClones AC2']
  },
  {
    id: 'three6_tear_the_club_fet',
    name: 'DJ Paul & Juicy J "Tear the Club" Screaming FET',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Drive a dynamic vocal group track aggressively through a fast FET compressor (\'JS: 1175 Compressor\') set to All-Buttons-In mode. Automate the compressor drive and high-shelf EQ boost (\'JS: ReJJ/ReEQ\') to spike during aggressive crowd chants or vocal hooks, keeping the energy rowdy and up-front.',
    plugins: ['JS: 1175 Compressor', 'JS: ReJJ/ReEQ']
  },
  {
    id: 'three6_sippin_on_some_syrup',
    name: 'DJ Paul & Juicy J "Sippin\' on Syrup" Sluggish Delay',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Create a sluggish, druggy vocal space. Feed the vocal into \'JS: Delay\' set to a slow 120ms slapback, routing the feedback directly into a lush, modulated chorus (\'JS: Saturated Chorus\') with deep pitch-modulation. Automate the delay feed to rise during hooks to melt the vocal into a dreamy, heavy-lidded state.',
    plugins: ['JS: Delay', 'JS: Saturated Chorus']
  },
  {
    id: 'three6_dark_hall_echo',
    name: 'DJ Paul & Juicy J "Mystic Stylez" Dark Hall Echo',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Feed the lead vocal send into \'Tukan Lexikan 2\' configured as a huge, dark cavernous space. Automate the send level to swell exactly on key phrase endings, then pass the reverb tail through an automated low-pass filter (\'JS: Moog 4-Pole Filter\') to sweep the high end away, letting the echo sink organically into a pitch-black abyss.',
    plugins: ['Tukan Lexikan 2', 'JS: Moog 4-Pole Filter']
  },
  {
    id: 'three6_mafia_wide_double',
    name: 'DJ Paul & Juicy J "Mafia Posse" Wide Doubler',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Recreate a dense gang-vocal posse cut. Pan two parallel pitch shifters (\'JS: Pitch Shifter 2\' set to -5 and +5 cents) hard left and right, and feed them into a stereo field expander (\'JS: Stereo Field Manipulator\' set to 150%). Automate this widening effect to expand dynamically on call-and-response backing vocals to surround the lead.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Stereo Field Manipulator']
  },
  {
    id: 'three6_crunchy_preamp',
    name: 'DJ Paul & Juicy J "SP-1200 Crunchy" Preamp',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Run the vocal through a bit reduction plugin (\'JS: Bit Reduction/Dither\') set to 12-bit, followed by vintage console preamp drive (\'JClones AC1\'). Automate the drive parameters to crunch on aggressive rap verses, adding that classic gritty 12-bit sampler crunch and mid-range bite.',
    plugins: ['JS: Bit Reduction/Dither', 'JClones AC1']
  },
  {
    id: 'three6_creepy_phaser_pan',
    name: 'DJ Paul & Juicy J "Hypnotize" Creepy Phaser Pan',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Route atmospheric background vocal chants into a slow, deep phaser (\'JS: Phaser\') followed by a tempo-synced auto-panner (\'JS: Auto-Pan\'). Automate the phaser depth and panning rate to rise and sweep during hooks to create an eerie, hypnotic, and circular disorienting motion.',
    plugins: ['JS: Phaser', 'JS: Auto-Pan']
  },
  {
    id: 'three6_sub_octave_shadow',
    name: 'DJ Paul & Juicy J "Sub-Octave Shadow" Growl',
    category: 'lead_vocal',
    producer: 'DJ Paul & Juicy J',
    description: 'Send parallel backing vocals to a pitch shifter (\'JS: Pitch Shifter 2\') set to -12 semitones, driving it into a high-resonance low-pass filter (\'JS: Moog 4-Pole Filter\') to isolate the sub-bass frequencies. Automate this low-end growl to slide under the main lead vocal during ominous verses, lending a terrifying, demonic weight.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Moog 4-Pole Filter']
  },

  // MICHAEL SEYER - "SEVEN SUMMERS" DREAMY BEDROOM POP
  {
    id: 'michael_seyer_summer_breeze_chorus',
    name: 'Michael Seyer "Summer Breeze" Modulated Chorus',
    category: 'lead_vocal',
    producer: 'Michael Seyer',
    description: 'Establish a warm, nostalgic indie vocal with a dreamy modulated chorus (\'JS: Saturated Chorus\') and smooth opto compression (\'JClones CA2A\'). Automate the chorus rate and depth to swell during bridge sections, making the vocal drift into an immersive, sun-drenched breeze.',
    plugins: ['JS: Saturated Chorus', 'JClones CA2A']
  },
  {
    id: 'michael_seyer_lazy_afternoon_tape_flutter',
    name: 'Michael Seyer "Lazy Afternoon" Warm Tape Wobble',
    category: 'lead_vocal',
    producer: 'Michael Seyer',
    description: 'Saturate the vocal using tape emulation (\'JClones AC2\') pushed to a soft compression threshold with active wow and flutter, feeding a short, warm slap delay (\'JS: Delay\'). Automate the wow/flutter depth on key sustained syllables to give the vocal a gorgeous, slightly out-of-tune, nostalgic vinyl warmth.',
    plugins: ['JClones AC2', 'JS: Delay']
  },
  {
    id: 'michael_seyer_bedroom_intimate_lofi',
    name: 'Michael Seyer "Bedroom Intimacy" Low-Pass Air',
    category: 'lead_vocal',
    producer: 'Michael Seyer',
    description: 'Filter out extreme low-end rumble and excessive high-end crispness using \'JS: RBJ Highpass/Lowpass Filters\' to focus the vocal in the warm mid-range, then gently level with \'JClones CA2A\' and a small pinch of \'JS: Bit Reduction/Dither\' (16-bit dithered). Automate the high-cut filter to open up on key emotive lines, revealing a close, raw, personal whisper.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JClones CA2A', 'JS: Bit Reduction/Dither']
  },
  {
    id: 'michael_seyer_jazzy_spring_space',
    name: 'Michael Seyer "Jazzy Spring" Resonant Plate',
    category: 'lead_vocal',
    producer: 'Michael Seyer',
    description: 'Run the vocal through a short tape slapback delay (\'JS: Delay\' set to 85ms) into a bright, nostalgic plate reverb (\'Tukan Lexikan 2\'). Automate the reverb decay and send level to swell during instrumental breaths, washing the lead in a spacious, retro 1970s jazz lounge echo.',
    plugins: ['JS: Delay', 'Tukan Lexikan 2']
  },
  {
    id: 'michael_seyer_hazy_double_detune',
    name: 'Michael Seyer "Hazy Double" Stereo Detune',
    category: 'lead_vocal',
    producer: 'Michael Seyer',
    description: 'Create Seyer\'s iconic cozy wide vocal space. Feed a double-tracked vocal to two pitch shifters (\'JS: Pitch Shifter 2\' set to -8 cents and +8 cents) panned wide, combined with \'JS: Stereo Field Manipulator\' at 130% width. Automate the stereo width from 100% to 130% on chorus entries to smoothly wrap the cozy chorus around the listener\'s head.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Stereo Field Manipulator']
  },

  // STIR CRAZY - DETROIT HORRORCORE INDUSTRIAL GRIT
  {
    id: 'stir_crazy_grave_digger_preamp',
    name: 'Stir Crazy "Grave Digger" Overdriven Channel',
    category: 'lead_vocal',
    producer: 'Stir Crazy',
    description: 'Drive the vocal aggressively through a vintage waveshaper (\'JS: Bad Buss Mojo Waveshaper\') and a gritty preamp simulator (\'JClones AC1\'). Automate the drive parameters and waveshaping saturation to spike on aggressive punchlines, adding that heavy, gravelly, overdriven Detroit crunch.',
    plugins: ['JS: Bad Buss Mojo Waveshaper', 'JClones AC1']
  },
  {
    id: 'stir_crazy_psych_ward_flanger',
    name: 'Stir Crazy "Psych Ward" Gated Flanger',
    category: 'lead_vocal',
    producer: 'Stir Crazy',
    description: 'Create a claustrophobic, anxious vocal texture. Pass the lead through a deep, sweeping jet flanger (\'JS: Flanger\') coupled with a lightning-fast noise gate (\'JS: Noise Gate\'). Automate the gate range and decay to slice off vocal tails instantly, creating an ultra-sharp, metallic, and modern horrorcore vocal stutter.',
    plugins: ['JS: Flanger', 'JS: Noise Gate']
  },
  {
    id: 'stir_crazy_carnival_trap_ringmod',
    name: 'Stir Crazy "Carnival Trap" Metallic Ring Mod',
    category: 'lead_vocal',
    producer: 'Stir Crazy',
    description: 'Recreate a twisted, nightmarish carnival atmosphere. Route the vocal into \'JS: Ring Modulator\' and \'JS: Auto-Pan\'). Automate the ring modulator frequency and mix to rise from 0% to 40% exclusively during creepy vocal call-outs or transition fills, sending a metallic, robotic shiver across the stereo field.',
    plugins: ['JS: Ring Modulator', 'JS: Auto-Pan']
  },
  {
    id: 'stir_crazy_insane_asylum_echo',
    name: 'Stir Crazy "Insane Asylum" Cavernous Feedback',
    category: 'lead_vocal',
    producer: 'Stir Crazy',
    description: 'Send the vocal into a long tape delay (\'JS: Delay\') feeding a heavy, dark room reverb (\'Tukan Lexikan 2\'). Automate the delay feedback and high-cut filter cutoffs to increase on the final syllables of bars, letting the vocal trail out into an unsettling, feedback-heavy, and cavernous abyss.',
    plugins: ['JS: Delay', 'Tukan Lexikan 2']
  },
  {
    id: 'stir_crazy_shadow_creature_octave',
    name: 'Stir Crazy "Shadow Creature" Demonic Sub-Octave',
    category: 'lead_vocal',
    producer: 'Stir Crazy',
    description: 'Blend a terrifying shadow vocal underneath. Run a parallel vocal through a pitch shifter (\'JS: Pitch Shifter 2\' set to -12 semitones) and compress it heavily using \'JS: 1175 Compressor\'. Automate the parallel track volume fader to rise and fall, creating a sinister, low-register demonic growl that mirrors the main vocal during intense sections.',
    plugins: ['JS: Pitch Shifter 2', 'JS: 1175 Compressor']
  },

  // NAV - PRISTINE XO TRAP GLOSS
  {
    id: 'nav_brown_boy_air',
    name: 'NAV "Brown Boy" Crisp Air Equalizer',
    category: 'lead_vocal',
    producer: 'NAV',
    description: 'Achieve a modern, expensive-sounding trap vocal. Drive a fast FET compressor (\'JS: 1175 Compressor\') to lock the vocal upfront, then boost a high-shelf EQ band at 12kHz (\'JS: ReJJ/ReEQ\') to inject pristine, silky high-end air. Automate the high-shelf boost to increase on hook entries, giving the vocal a brilliant, diamond-cut shimmer.',
    plugins: ['JS: 1175 Compressor', 'JS: ReJJ/ReEQ']
  },
  {
    id: 'nav_perfect_timing_doubler',
    name: 'NAV "Perfect Timing" Stereo Doubler',
    category: 'lead_vocal',
    producer: 'NAV',
    description: 'Create a massive, wide backing image for melodic choruses. Route the vocal into two parallel pitch shifters (\'JS: Pitch Shifter 2\' set to -7 and +7 cents) panned hard left and right, and route them through \'JS: Stereo Field Manipulator\' at 140% width. Automate the stereo width parameter to expand wide on choruses, beautifully wrapping around the listener.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Stereo Field Manipulator']
  },
  {
    id: 'nav_tap_slapback_gloss',
    name: 'NAV "Tap" Melodic Slapback Echo',
    category: 'lead_vocal',
    producer: 'NAV',
    description: 'Feed the vocal into a snappy delay (\'JS: Delay\' set to 95ms) with subtle feedback, running into a lush modulated chorus (\'JS: Saturated Chorus\'). Automate the dry/wet mix of the delay on sustained notes to add a luxurious, glossy, and space-filling tail to melodic hooks.',
    plugins: ['JS: Delay', 'JS: Saturated Chorus']
  },
  {
    id: 'nav_reckless_cloud_reverb',
    name: 'NAV "Reckless" Cloud Space Plate',
    category: 'lead_vocal',
    producer: 'NAV',
    description: 'Engulf the lead vocal in an expansive, high-end trap space. Send the signal into a bright plate reverb (\'Tukan Lexikan 2\') and set an ultra-fast opto leveler (\'JClones CA2A\') on the reverb send. Automate the reverb send levels to swell on vocal phrase endings, letting the vocal melt into a dreamy, cloud-like atmosphere.',
    plugins: ['Tukan Lexikan 2', 'JClones CA2A']
  },
  {
    id: 'nav_phone_filter_sweep',
    name: 'NAV "Price on My Head" Filter Sweeper',
    category: 'lead_vocal',
    producer: 'NAV',
    description: 'Apply bandpass filtering (cut below 400Hz and above 3.5kHz with \'JS: RBJ Highpass/Lowpass Filters\') to create a tight telephone effect. Automate the low-pass and high-pass cutoffs to sweep wide open at the start of verse transitions, smoothly returning the vocal to its full, crisp, and high-fidelity presence.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters']
  },

  // RZA - SHAOLIN GRIT & DIRTY ANALOG CHROMATIC
  {
    id: 'rza_shaolin_12bit_preamp',
    name: 'RZA "Shaolin 36 Chambers" 12-Bit Preamp',
    category: 'lead_vocal',
    producer: 'RZA',
    description: 'Emulate the legendary, gritty character of an SP-1200 sampler. Run the vocal through bit-reduction (\'JS: Bit Reduction/Dither\' set to 12-bit) followed by a driving console preamp emulator (\'JClones AC1\'). Automate the preamp input drive to crunch on aggressive delivery, adding raw harmonic grit and mid-range bite.',
    plugins: ['JS: Bit Reduction/Dither', 'JClones AC1']
  },
  {
    id: 'rza_enter_the_wu_tape_wobble',
    name: 'RZA "Enter the Wu" Saturated Tape Hiss',
    category: 'lead_vocal',
    producer: 'RZA',
    description: 'Filter out the extreme low and high end using \'JS: RBJ Highpass/Lowpass Filters\' (250Hz - 5kHz) and feed it into tape emulation (\'JClones AC2\') driven hard to the point of tape compression. Automate the tape speed and wow/flutter to inject subtle, pitch-unstable tape wobble during dark spoken-word intros.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JClones AC2']
  },
  {
    id: 'rza_liquid_swords_chamber',
    name: 'RZA "Liquid Swords" Dark Echo Chamber',
    category: 'lead_vocal',
    producer: 'RZA',
    description: 'Route the vocal send into a dark, gritty stone chamber reverb (\'Tukan Lexikan 2\') and pass the wet output through a resonant low-pass filter (\'JS: Moog 4-Pole Filter\'). Automate the filter cutoff to sweep open on key bars, letting the echo emerge from a dark, menacing dungeon before receding back into the shadows.',
    plugins: ['Tukan Lexikan 2', 'JS: Moog 4-Pole Filter']
  },
  {
    id: 'rza_grim_reaper_growl',
    name: 'RZA "Grim Reaper" Sub-Octave Shadow',
    category: 'lead_vocal',
    producer: 'RZA',
    description: 'Generate an ominous, demonic backing voice. Send parallel backing vocals to a pitch shifter (\'JS: Pitch Shifter 2\' set to -12 semitones) and feed it directly into fuzz distortion (\'JS: Distortion (Fuzz)\'). Automate this gritty, low-frequency growl to blend in and out behind the lead vocal, adding terrifying weight to ominous lyrics.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'rza_cream_slap_vinyl',
    name: 'RZA "C.R.E.A.M." Slapback & Tape Dust',
    category: 'lead_vocal',
    producer: 'RZA',
    description: 'Recreate a dusty, vintage vinyl aesthetic. Run the vocal into a tape slapback delay (\'JS: Delay\' set to 110ms) driven heavily by console channel saturation (\'JClones AC1\'). Automate the delay feedback to swell on key phrase endings, dissolving the vocal into a retro, gritty echo washed in warm tape saturation.',
    plugins: ['JS: Delay', 'JClones AC1']
  },

  // AD-LIBS
  {
    id: 'travis_demonic_drop',
    name: 'Travis Scott / Mike Dean "Demonic Pitch-Drop"',
    category: 'ad_lib',
    producer: 'Travis Scott',
    description: 'Automate a pitch shifter (\'JS: Pitch Shifter 2\') down 12 semitones instantly on an ad-lib entering, paired with high-feedback ping-pong delay (\'JS: Delay (Ping Pong)\'), dropping the ad-lib into a deep, cavernous abyss.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Delay']
  },
  {
    id: 'carti_baby_helium',
    name: 'Playboi Carti "Baby Voice" Helium Lift',
    category: 'ad_lib',
    producer: 'Playboi Carti',
    description: 'Automate formant/pitch shifting (\'JS: Pitch Shifter 2\') up by +12 semitones on high-energy ad-libs ("What!", "Yeah!"), saturated aggressively with \'JS: Distortion (Fuzz)\' to make the tiny vocals pierce the sub-heavy beat.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'migos_triplet_stutter',
    name: 'Migos / Quavo "Triplet Machine Gun" Stutter',
    category: 'ad_lib',
    producer: 'Migos',
    description: 'Trigger an extreme tempo-synced gate (\'JS: Noise Gate\') or tremolo locked to 1/8 triplets on sustained ad-lib vowels, chopping them rhythmically in time with the trap hi-hats.',
    plugins: ['JS: Noise Gate', 'JS: Tremolo']
  },
  {
    id: 'rocky_chopped_warp',
    name: 'A$AP Rocky "Chopped & Screwed" Reverse Warp',
    category: 'ad_lib',
    producer: 'A$AP Rocky',
    description: 'Throw an ad-lib through a reverse delay simulation or negative time-offset (\'JS: Delay\'), automating \'JClones AC2\' tape slowdown (wow and flutter) to warp and melt the vocal tail into the beat drop.',
    plugins: ['JS: Delay', 'JClones AC2']
  },
  {
    id: 'juice_emo_flanger',
    name: 'Juice WRLD / Nick Mira "Emo Wash" Flanger Swell',
    category: 'ad_lib',
    producer: 'Juice WRLD',
    description: 'Automate the wet mix of a thick flanger (\'JS: Flanger\') and a long 4-second hall reverb (\'Tukan Lexikan 2\') to swell from 10% to 100% on emotional ad-libs, pushing the vocal backwards into a huge cinematic wash.',
    plugins: ['JS: Flanger', 'Tukan Lexikan 2']
  },
  {
    id: 'thug_slime_pan',
    name: 'Young Thug "Slime" Auto-Pan Laser',
    category: 'ad_lib',
    producer: 'Young Thug',
    description: 'Hard-pan short, staccato ad-libs using a rapid LFO (\'JS: Auto-Pan\') syncing to 1/16 notes. As the ad-lib finishes, automate the width parameter to collapse back to mono, sounding like a stereo laser beam retracting.',
    plugins: ['JS: Auto-Pan']
  },
  {
    id: 'missy_backmasking',
    name: 'Missy Elliott / Timbaland "Reverse Backmasking"',
    category: 'ad_lib',
    producer: 'Missy Elliott',
    description: 'Automate a combination of \'JS: Pitch Shifter 2\' (formant shifted) and \'JS: Delay\' set to high feedback and reversed logic, turning standard ad-lib interjections into alien, reversed percussive backmasking.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Delay']
  },
  {
    id: 'pop_smoke_drill_bark',
    name: 'Pop Smoke / 808Melo "Brooklyn Drill" Distorted Bark',
    category: 'ad_lib',
    producer: 'Pop Smoke',
    description: 'Route ad-libs (grunts, barks) into a parallel distortion channel (\'JS: Bad Buss Mojo Waveshaper\') set to extreme drive, gating out the tails instantly (\'JS: Noise Gate\') so the ad-lib punches like a distorted 808 kick.',
    plugins: ['JS: Bad Buss Mojo Waveshaper', 'JS: Noise Gate']
  },
  {
    id: 'kendrick_multiple_personality',
    name: 'Kendrick Lamar "Multiple Personality" Micro-Pitch',
    category: 'ad_lib',
    producer: 'Kendrick Lamar',
    description: 'Automatically toggle left and right micro-pitch lanes (+5 cents and -5 cents via \'JS: Pitch Shifter 2\') on and off for alternating ad-lib phrases, giving the illusion of multiple different voices answering the lead vocal.',
    plugins: ['JS: Pitch Shifter 2']
  },
  {
    id: 'weeknd_filter_sweep',
    name: 'The Weeknd / Illangelo "Cinematic High-Pass Filter Sweep"',
    category: 'ad_lib',
    producer: 'The Weeknd',
    description: 'Send a long, melodic ad-lib to an infinite delay loop, then automate the high-pass filter (\'JS: RBJ Highpass/Lowpass Filters\') from 200Hz up to 5kHz smoothly across two bars, letting the ad-lib dissolve into pure high-end air.',
    plugins: ['JS: Delay', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'jid_formant_shift',
    name: 'JID / Christo "Rapid-Fire Formant Shifting"',
    category: 'ad_lib',
    producer: 'JID',
    description: 'Automate the formant parameter of \'JS: Pitch Shifter 2\' rhythmically across fast ad-lib syllables, bouncing between high chipmunk tones and low demonic pitches on every other beat.',
    plugins: ['JS: Pitch Shifter 2']
  },
  {
    id: 'cudi_lunar_hum',
    name: 'Kid Cudi "Lunar Hum" Space Echo',
    category: 'ad_lib',
    producer: 'Kid Cudi',
    description: 'Send melodic humming ad-libs into \'JS: Delay (Lo-Fi)\' combined with \'Tukan Lexikan 2\' hall reverb, automating the delay feedback to near self-oscillation while keeping the dry signal muted, creating an endless space hum.',
    plugins: ['JS: Delay (Lo-Fi)', 'Tukan Lexikan 2']
  },
  {
    id: 'snoop_dre_telephone',
    name: 'Snoop Dogg / Dr. Dre "G-Funk Telephone" Double',
    category: 'ad_lib',
    producer: 'Snoop Dogg',
    description: 'Aggressively band-pass filter (\'JS: RBJ Highpass/Lowpass Filters\' 400Hz-3kHz) an ad-lib and layer it with \'JS: Distortion (Fuzz)\' to create a gritty, compressed vintage telephone vocal answering the lead.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'eminem_whisper_pan',
    name: 'Eminem / Dr. Dre "Schizophrenic Whisper" Panning',
    category: 'ad_lib',
    producer: 'Eminem',
    description: 'Hard pan whispered ad-libs alternating 100% Left and 100% Right on consecutive words, squashed completely flat by \'Tukan NC76\', making the voices sound like they are whispering directly into the listener\'s ears.',
    plugins: ['JS: Auto-Pan', 'Tukan NC76']
  },
  {
    id: 'tyler_tape_sat',
    name: 'Tyler, The Creator "Gritty Lo-Fi Tape Saturation"',
    category: 'ad_lib',
    producer: 'Tyler, The Creator',
    description: 'Process ad-libs through \'JClones AC2\' pushed to maximum input drive with high wow and flutter, automating a low-pass filter to slowly roll off the highs, simulating a degrading cassette tape.',
    plugins: ['JClones AC2', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'frank_prism_choir',
    name: 'Frank Ocean "Prism" Multi-Octave Choir',
    category: 'ad_lib',
    producer: 'Frank Ocean',
    description: 'Duplicate the ad-lib into three parallel channels using \'JS: Pitch Shifter 2\': one +12 semitones, one -12 semitones, and one dry. Automate the volume of the octaves to swell in and out, creating an artificial glowing choir.',
    plugins: ['JS: Pitch Shifter 2']
  },
  {
    id: 'cole_reverse_swell',
    name: 'J. Cole / Omen "Soulful Reverse Reverb Swell"',
    category: 'ad_lib',
    producer: 'J. Cole',
    description: 'Take the first syllable of a vocal ad-lib, reverse it, apply a heavy 3-second \'Tukan Lexikan 2\' plate reverb, and reverse it back, automating the volume to swell right before the actual ad-lib hits.',
    plugins: ['Tukan Lexikan 2']
  },
  {
    id: 'drake_underwater_echo',
    name: 'Drake / 40 "Underwater Muffled Echo"',
    category: 'ad_lib',
    producer: 'Drake',
    description: 'Apply a steep 800Hz low-pass filter (\'JS: RBJ Highpass/Lowpass Filters\') to an ad-lib and send it to \'JS: Delay (Ping Pong)\', creating a dark, murky, underwater echo that doesn\'t clash with the bright lead.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JS: Delay']
  },
  {
    id: 'uzi_anime_sparkle',
    name: 'Lil Uzi Vert "Anime Sparkle" High-Shelf Boost',
    category: 'ad_lib',
    producer: 'Lil Uzi Vert',
    description: 'Aggressively boost a high-shelf EQ (\'JS: ReJJ/ReEQ\') at 12kHz by +10dB on energetic ad-libs, sending them through \'JS: Saturated Chorus\' to create a hyper-bright, sparkling synthetic texture.',
    plugins: ['JS: ReJJ/ReEQ', 'JS: Saturated Chorus']
  },
  {
    id: 'busta_monster_growl',
    name: 'Busta Rhymes "Monster Growl" Sub-Harmonic Generation',
    category: 'ad_lib',
    producer: 'Busta Rhymes',
    description: 'Send aggressive ad-libs into a pitch shifter (\'JS: Pitch Shifter 2\') tuned down -12 semitones, heavily compressed and low-passed at 500Hz, blending it subtly underneath the dry ad-lib for added chest-rattling weight.',
    plugins: ['JS: Pitch Shifter 2', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'rosalia_flamenco_staccato',
    name: 'Rosalía / El Guincho "Flamenco Handclap" Vocal Staccato',
    category: 'ad_lib',
    producer: 'Rosalía',
    description: 'Automate an ultra-fast noise gate (\'JS: Noise Gate\') combined with \'JS: Distortion (Fuzz)\' on short rhythmic vocal ad-libs to make them snap and hit as hard as organic handclaps or castanets in the stereo field.',
    plugins: ['JS: Noise Gate', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'kanye_yeezus_bitcrush',
    name: 'Kanye West "Yeezus" Brutalist Bitcrush',
    category: 'ad_lib',
    producer: 'Kanye West',
    description: 'Route screaming ad-libs into \'JS: Bit Reduction/Dither\' (reducing to 4-8 bits) and \'JS: Bad Buss Mojo Waveshaper\', creating a harsh, digital, tearing distortion that violently cuts through heavy synths.',
    plugins: ['JS: Bit Reduction/Dither', 'JS: Bad Buss Mojo Waveshaper']
  },
  {
    id: 'paak_vintage_soul_slap',
    name: 'Anderson .Paak "Vintage Soul" Slapback Plate',
    category: 'ad_lib',
    producer: 'Anderson .Paak',
    description: 'Throw raspy ad-libs into a fast 80ms delay (\'JS: Delay\') feeding directly into a short, bright plate reverb (\'Tukan Lexikan 2\'), keeping it extremely dry but with a sharp 1970s analog reflection.',
    plugins: ['JS: Delay', 'Tukan Lexikan 2']
  },
  {
    id: 'gambino_helium_chorus',
    name: 'Childish Gambino "Redbone" Helium Chorus',
    category: 'ad_lib',
    producer: 'Childish Gambino',
    description: 'Automate formant shifting up (+5 to +7) without changing the pitch (\'JS: Pitch Shifter 2\'), and run it through a wide, slow \'JS: Saturated Chorus\' to create an alien, funk-psychedelic backing vocal texture.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Saturated Chorus']
  },
  {
    id: 'mac_jazzy_vinyl',
    name: 'Mac Miller "Swimming" Jazzy Vinyl Pitch-Drift',
    category: 'ad_lib',
    producer: 'Mac Miller',
    description: 'Process melodic hums or background vocals through \'JClones AC2\' with extreme tape wow/flutter and a subtle \'JS: Auto-Pan\' sweeping slowly across the stereo spectrum, giving them a woozy, aquatic jazz feel.',
    plugins: ['JClones AC2', 'JS: Auto-Pan']
  },
  {
    id: 'future_pitch_dive',
    name: 'Future "Codeine" Slurred Pitch Dive',
    category: 'ad_lib',
    producer: 'Future',
    description: 'Take the tail end of an ad-lib and automate \'JS: Pitch Shifter 2\' to slowly slide down -5 to -12 semitones over 2 beats, slurring the vocal down into a dark, syrupy slow-motion drawl.',
    plugins: ['JS: Pitch Shifter 2']
  },
  {
    id: 'sza_lofi_cassette',
    name: 'SZA / Carter Lang "Lo-Fi Bedroom" Cassette Muffle',
    category: 'ad_lib',
    producer: 'SZA',
    description: 'EQ the ad-libs drastically with \'JS: RBJ Highpass/Lowpass Filters\' (HP at 400Hz, LP at 4kHz) and add a high noise floor / vinyl crackle to make the vocal sound like an intimate, dusty cassette tape recording layered behind the pristine lead.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'toliver_shimmer_echo',
    name: 'Don Toliver "Psychedelic Trap" Shimmering Phased Echo',
    category: 'ad_lib',
    producer: 'Don Toliver',
    description: 'Send the ad-lib into a 1/4 note \'JS: Delay (Ping Pong)\', and route the delay tails into a slow, wide \'JS: Phaser\', making the echoes swirl and shimmer psychedelically around the listener.',
    plugins: ['JS: Delay', 'JS: Phaser']
  },
  {
    id: 'rihanna_pop_gloss',
    name: 'Rihanna / Kuk Harrell "Pop-Gloss" Razor-Sharp Widening',
    category: 'ad_lib',
    producer: 'Rihanna',
    description: 'Squash ad-libs with aggressive \'Tukan NC76\' compression, boost the 10kHz+ air band by +8dB, and use \'JS: Stereo Field Manipulator\' to push them 150% wide, creating a hyper-polished, razor-sharp pop backing vocal halo.',
    plugins: ['Tukan NC76', 'JS: Stereo Field Manipulator']
  },
  {
    id: 'tame_impala_laser_flange',
    name: 'Tame Impala / Kevin Parker "Laser Beam" Flanger Drop',
    category: 'ad_lib',
    producer: 'Tame Impala',
    description: 'On transition ad-libs or heavy sighs, automate the resonance and feedback of \'JS: Flanger\' to maximum while sweeping the delay time, creating a jet-engine laser beam sound that rockets across the mix.',
    plugins: ['JS: Flanger']
  },
  {
    id: 'denzel_moshpit_megaphone',
    name: 'Denzel Curry "Moshpit" Overdriven Megaphone',
    category: 'ad_lib',
    producer: 'Denzel Curry',
    description: 'Route high-energy hype ad-libs into extreme clipping via \'JS: Distortion (Fuzz)\', drastically rolling off the bass (HPF at 500Hz) and treble (LPF at 4kHz) with \'JS: RBJ Highpass/Lowpass Filters\' to sound like an overdriven megaphone cutting through a dense metal-trap mix.',
    plugins: ['JS: Distortion (Fuzz)', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'aaliyah_stutter_step',
    name: 'Aaliyah / Timbaland "Stutter-Step" Rapid Tremolo',
    category: 'ad_lib',
    producer: 'Aaliyah',
    description: 'On smooth R&B vocal tail ad-libs, apply \'JS: Tremolo\' synced tightly to 1/16th or 1/32nd notes, automating the depth to ramp up fully at the phrase end for a classic futuristic stutter fade-out.',
    plugins: ['JS: Tremolo']
  },
  {
    id: 'ski_mask_cartoon',
    name: 'Ski Mask The Slump God "Cartoon Fast-Forward"',
    category: 'ad_lib',
    producer: 'Ski Mask The Slump God',
    description: 'Pitch shift an ad-lib up by an extreme +24 semitones and speed it up dynamically using \'JS: Pitch Shifter 2\' and \'JS: Delay\', creating a ridiculous, cartoonish fast-forward squeak to add playful bounce to the beat.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Delay']
  },
  {
    id: 'james_blake_digital_choir',
    name: 'James Blake "Digital Choir" Granular Freeze',
    category: 'ad_lib',
    producer: 'James Blake',
    description: 'Capture a single sung ad-lib vowel, run it through an infinite feedback loop on \'JS: Delay (Lo-Fi)\' with \'JS: Saturated Chorus\', creating a frozen, haunting digital choir pad that sustains underneath the entire section.',
    plugins: ['JS: Delay (Lo-Fi)', 'JS: Saturated Chorus']
  },
  {
    id: 'vince_staples_metallic',
    name: 'Vince Staples / SOPHIE "Metallic Synth" Ring Modulator',
    category: 'ad_lib',
    producer: 'Vince Staples',
    description: 'Process spoken ad-libs through \'JS: Ring Modulator\' with a high-frequency carrier, making the vocal tone sound like a cold, metallic synth stab or a scraping piece of sheet metal.',
    plugins: ['JS: Ring Modulator']
  },
  {
    id: 'gunna_drip_liquid',
    name: 'Gunna "Drip" Liquid Chorus Sweeps',
    category: 'ad_lib',
    producer: 'Gunna',
    description: 'Soften melodic ad-libs by routing them into \'JS: Saturated Chorus\' with a deep, slow LFO sweep, combined with an automated \'JS: RBJ Highpass/Lowpass Filters\' sweeping down from 10kHz to 2kHz, making the vocal sound like it\'s dissolving into water.',
    plugins: ['JS: Saturated Chorus', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'jpegmafia_bitcrush',
    name: 'JPEGMafia "Internet Glitch" Random Bit-Crushing',
    category: 'ad_lib',
    producer: 'JPEGMafia',
    description: 'Automate \'JS: Bit Reduction/Dither\' bit depth parameters randomly between 2-bit and 16-bit on loud ad-lib screams, causing digital chaos and unpredictable, broken-audio aesthetic spikes.',
    plugins: ['JS: Bit Reduction/Dither']
  },
  {
    id: 'earl_depressive_tape',
    name: 'Earl Sweatshirt "Depressive" Mono-Fi Tape Degradation',
    category: 'ad_lib',
    producer: 'Earl Sweatshirt',
    description: 'Compress the ad-lib heavily, sum it to strict mono, and run it through \'JClones AC2\' with severe high-frequency roll-off and prominent tape hiss to create a stark, claustrophobic, lo-fi depression effect.',
    plugins: ['JClones AC2']
  },
  {
    id: 'burna_afrobeats_delay',
    name: 'Burna Boy "Afrobeats" Wide Shimmer Delay',
    category: 'ad_lib',
    producer: 'Burna Boy',
    description: 'Use a pitch-shifted delay throw (delaying +1 octave, using \'JS: Pitch Shifter 2\' inside the delay feedback loop) on the end of a chanted ad-lib, spreading it to 200% stereo width to create a shimmering, celebratory afro-fusion halo.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Delay']
  },
  {
    id: 'skepta_sub_drop',
    name: 'Skepta "Grime" Sub-Bass Vocal Drop',
    category: 'ad_lib',
    producer: 'Skepta',
    description: 'Take a deep, low-register ad-lib or grunt, pitch it down -12 semitones, squash it with \'JS: 1175\', and boost the 60Hz-80Hz sub frequencies heavily, using the vocal ad-lib itself as an impact bass drop for the track.',
    plugins: ['JS: Pitch Shifter 2', 'JS: 1175 Compressor']
  },

  // BACKING VOCALS
  {
    id: 'queen_bohemian_wall',
    name: 'Queen / Roy Thomas Baker "Bohemian Wall"',
    category: 'backing_vocal',
    producer: 'Queen / Roy Thomas Baker',
    description: 'Overdub multiple backing vocal takes, hard pan them 100% Left and Right, and squash them aggressively with \'Tukan NC76\'. Automate a slow, rich \'JS: Saturated Chorus\' across the bus to merge the voices into a single, massive choral wall.',
    plugins: ['Tukan NC76', 'JS: Saturated Chorus']
  },
  {
    id: 'mj_percussive_stacks',
    name: 'Michael Jackson / Bruce Swedien "Percussive Breath" Stacks',
    category: 'backing_vocal',
    producer: 'Michael Jackson / Bruce Swedien',
    description: 'Aggressively high-pass backing vocal rhythmic layers at 300Hz and use a fast-attack gate (\'JS: Noise Gate\') to emphasize the percussive consonants and breaths, making the backing vocals function as part of the drum groove.',
    plugins: ['JS: Noise Gate']
  },
  {
    id: 'destinys_child_rnb_silk',
    name: 'Destiny\'s Child / Darkchild "R&B Silk" Micro-Tuning',
    category: 'backing_vocal',
    producer: 'Destiny\'s Child / Darkchild',
    description: 'Apply subtle \'JS: Pitch Shifter 2\' (+4 cents Left, -4 cents Right) on R&B harmonies, rolling off the highs above 8kHz smoothly. This thickens the chord structures into a smooth, silky R&B bed without clashing with the lead.',
    plugins: ['JS: Pitch Shifter 2']
  },
  {
    id: 'def_leppard_gated_choir',
    name: 'Def Leppard / Mutt Lange "Hysteria" Gated Reverb Choir',
    category: 'backing_vocal',
    producer: 'Def Leppard / Mutt Lange',
    description: 'Send a massive stack of backing vocals into \'Tukan Lexikan 2\' hall reverb and immediately gate the reverb tail (\'JS: Noise Gate\') to cut off perfectly on the snare beat, creating a huge, synthetic arena-rock vocal explosion.',
    plugins: ['Tukan Lexikan 2', 'JS: Noise Gate']
  },
  {
    id: 'beach_boys_phil_spector',
    name: 'The Beach Boys / Brian Wilson "Phil Spector Echo"',
    category: 'backing_vocal',
    producer: 'The Beach Boys / Brian Wilson',
    description: 'Run tight vocal harmonies through an entirely mono bus, heavily saturate them with \'JS: Distortion (Fuzz)\', and send them into a long, dark \'JS: Delay\' feeding a mono \'Tukan Lexikan 2\' plate, recreating the 1960s "Wall of Sound".',
    plugins: ['JS: Distortion (Fuzz)', 'JS: Delay', 'Tukan Lexikan 2']
  },
  {
    id: 'steely_dan_smooth_jazz',
    name: 'Steely Dan "Smooth Jazz" Pinpoint EQ Separation',
    category: 'backing_vocal',
    producer: 'Steely Dan',
    description: 'Create extreme tonal contrast between lead and backing vocals by scooping the mid-range (1kHz-3kHz) out of the backing vocals using \'JS: ReJJ/ReEQ\', allowing the lead vocal to sit perfectly in the center pocket.',
    plugins: ['JS: ReJJ/ReEQ']
  },
  {
    id: 'enya_celtic_ethereal',
    name: 'Enya "Celtic Ethereal" Infinite Reverb Wash',
    category: 'backing_vocal',
    producer: 'Enya',
    description: 'Send backing vocals to an ultra-long (8+ seconds) dark \'Tukan Lexikan 2\' reverb. Automate the backing vocal track volume to swell in slowly beneath the lead, completely blurring the consonants into an evolving ambient pad.',
    plugins: ['Tukan Lexikan 2']
  },
  {
    id: 'outkast_pfunk_phased',
    name: 'Outkast "SpottieOttie" P-Funk Phased Harmonies',
    category: 'backing_vocal',
    producer: 'Outkast',
    description: 'Run a bus of soulful backing vocals through a thick, slow \'JS: Phaser\' and \'JS: Auto-Pan\', making the choir swirl heavily from speaker to speaker like a vintage 1970s funk record.',
    plugins: ['JS: Phaser', 'JS: Auto-Pan']
  },
  {
    id: 'fleetwood_mac_warmth',
    name: 'Fleetwood Mac / Ken Caillat "Acoustic Warmth" Tape Saturation',
    category: 'backing_vocal',
    producer: 'Fleetwood Mac / Ken Caillat',
    description: 'Send gentle acoustic backing vocals into \'JClones AC2\' (Tape Emulator) at 15 IPS, driving the input just enough to smooth out the transient peaks, resulting in a buttery, warm 1970s California soft-rock harmony.',
    plugins: ['JClones AC2']
  },
  {
    id: 'bon_iver_messina',
    name: 'Bon Iver "Messina" Prism Vocoder',
    category: 'backing_vocal',
    producer: 'Bon Iver',
    description: 'Duplicate a backing vocal into 4 separate channels. Run each through \'JS: Pitch Shifter 2\' tuned to different intervals of a chord (e.g., +3, +7, -5, -12 semitones). Squash them with \'JClones CA2A\' to create a synthetic, robotic indie-folk choir.',
    plugins: ['JS: Pitch Shifter 2', 'JClones CA2A']
  },
  {
    id: 'beatles_abbey_adt',
    name: 'The Beatles "Abbey Road" Artificial Double Tracking',
    category: 'backing_vocal',
    producer: 'The Beatles',
    description: 'Emulate classic 1960s automatic double-tracking. Route the backing vocal into a tape-style delay (\'JS: Delay\' set to 28ms) and use LFO pitch modulation via \'JS: Saturated Chorus\' on the delayed path to create a wide, organic double.',
    plugins: ['JS: Delay', 'JS: Saturated Chorus']
  },
  {
    id: 'imogen_heap_harmony_prism',
    name: 'Imogen Heap "Hide and Seek" Digital Harmonizer',
    category: 'backing_vocal',
    producer: 'Imogen Heap',
    description: 'Build a lush, crystalline vocal-harmonizer engine. Set up four instances of \'JS: Pitch Shifter 2\' panned wide left and right, and route them through a high-pass filter (\'JS: RBJ Highpass/Lowpass Filters\') at 400Hz. Automate the pitch offsets to shift on chord changes.',
    plugins: ['JS: Pitch Shifter 2', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'celine_dion_gatica_depth',
    name: 'Celine Dion "Power Ballad" Gatica Sidechain Space',
    category: 'backing_vocal',
    producer: 'Celine Dion / Humberto Gatica',
    description: 'Tuck a massive backing vocal choir behind the main singer. Run the harmonies through a deep hall reverb (\'Tukan Lexikan 2\'), then place a compressor (\'JClones CA2A\') on the reverb return, sidechained to the lead vocal to clear space.',
    plugins: ['Tukan Lexikan 2', 'JClones CA2A']
  },
  {
    id: 'dolly_parton_nashville_spread',
    name: 'Dolly Parton "Nashville Sound" Smooth Acoustic Wider',
    category: 'backing_vocal',
    producer: 'Dolly Parton',
    description: 'Create a smooth, warm country-harmony cushion. Route acoustic harmonies into a stereo width enhancer (\'JS: Stereo Field Manipulator\' set to 130% width) and squash with a clean leveler (\'JClones CA2A\') to keep them perfectly balanced.',
    plugins: ['JS: Stereo Field Manipulator', 'JClones CA2A']
  },
  {
    id: 'ewf_horn_stabs_punch',
    name: 'Earth, Wind & Fire "Brass Stack" Horn-Style Punch',
    category: 'backing_vocal',
    producer: 'Earth, Wind & Fire',
    description: 'Recreate punchy, brassy R&B backing stacks. Apply a sharp mid-range boost at 2.5kHz and a tight high-pass filter at 180Hz (\'JS: ReJJ/ReEQ\'), then drive into an ultra-fast FET compressor (\'JS: 1175 Compressor\') for rapid, drum-like stabs.',
    plugins: ['JS: ReJJ/ReEQ', 'JS: 1175 Compressor']
  },
  {
    id: 'sinatra_riddle_orchestral_room',
    name: 'Frank Sinatra "Nelson Riddle" Deep Stage Space',
    category: 'backing_vocal',
    producer: 'Frank Sinatra',
    description: 'Place backing vocalists deep in the back of an orchestral-style stage. Apply a pre-delay of 45ms and feed into a warm, natural plate reverb (\'Tukan Lexikan 2\'), using \'JS: ReJJ/ReEQ\' to cut the highs above 5kHz so they sit beautifully in the rear.',
    plugins: ['Tukan Lexikan 2', 'JS: ReJJ/ReEQ']
  },
  {
    id: 'radiohead_godrich_kid_a',
    name: 'Radiohead "Kid A" Displaced Ghostly Harmonies',
    category: 'backing_vocal',
    producer: 'Radiohead / Nigel Godrich',
    description: 'Generate an alienated, haunting background wash. Route backing harmonies into dual tape delays (\'JS: Delay\' set to 420ms and 540ms) panned hard left and right, and feed them into a lush phaser (\'JS: Phaser\') to dissolve the words into a dreamy haze.',
    plugins: ['JS: Delay', 'JS: Phaser']
  },
  {
    id: 'kanye_gospel_beam_stack',
    name: 'Kanye West "Ultralight Beam" Gospel Choir Wall',
    category: 'backing_vocal',
    producer: 'Kanye West',
    description: 'Emulate a giant, room-shaking church choir. Run the backing vocals through heavy parallel saturators (\'JClones AC1\') to add thick harmonic weight, then send them into an expansive, bright church hall reverb (\'Tukan Lexikan 2\') with a long tail.',
    plugins: ['JClones AC1', 'Tukan Lexikan 2']
  },
  {
    id: 'travis_dean_astroworld_tuned',
    name: 'Travis Scott "Astroworld" Saturated Psychedelic Stacks',
    category: 'backing_vocal',
    producer: 'Travis Scott / Mike Dean',
    description: 'Form a dark, trippy vocal canvas. Apply aggressive pitch shifting (\'JS: Pitch Shifter 2\' set to -12 semitones), run through heavy console overdrive (\'JClones AC1\'), and automate a low-pass filter (\'JS: RBJ Highpass/Lowpass Filters\') to sweep open and closed.',
    plugins: ['JS: Pitch Shifter 2', 'JClones AC1', 'JS: RBJ Highpass/Lowpass Filters']
  },
  {
    id: 'kendrick_mortal_man_subconscious',
    name: 'Kendrick Lamar "Mortal Man" Pitch-Shifted Alter-Ego',
    category: 'backing_vocal',
    producer: 'Kendrick Lamar / Sounwave',
    description: 'Blend pitch-shifted high and low backing takes behind the main voice. Apply \'JS: Pitch Shifter 2\' (+12 semitones on Left, -12 semitones on Right) and squeeze with \'Tukan NC76\' to create Kendricks signature inner-monologue harmony stacks.',
    plugins: ['JS: Pitch Shifter 2', 'Tukan NC76']
  },
  {
    id: 'drake_marvins_room_underwater',
    name: 'Drake "Marvins Room" Low-Pass R&B Harmony',
    category: 'backing_vocal',
    producer: 'Drake / Noah "40" Shebib',
    description: 'Tuck smooth backing vocals underneath the mix using 40s signature low-pass aesthetic. Run harmonies through \'JS: RBJ Highpass/Lowpass Filters\' with a 1.2kHz cutoff, followed by a wide, slow \'JS: Saturated Chorus\' and massive \'Tukan Lexikan 2\' hall space.',
    plugins: ['JS: RBJ Highpass/Lowpass Filters', 'JS: Saturated Chorus', 'Tukan Lexikan 2']
  },
  {
    id: 'cudi_hum_gargantuan_choir',
    name: 'Kid Cudi "Day n Nite" Gargantuan Humming Stack',
    category: 'backing_vocal',
    producer: 'Kid Cudi / Dot da Genius',
    description: 'Build Cudis iconic, rumbling hum harmonies. Group multiple hum takes, boost 200Hz warm frequencies with \'JS: ReJJ/ReEQ\', compress tightly using \'JClones CA2A\', and feed into a rich tape echo (\'JS: Delay\' set to 300ms) for a spacious, haunting atmosphere.',
    plugins: ['JS: ReJJ/ReEQ', 'JClones CA2A', 'JS: Delay']
  },
  {
    id: 'rocky_lvs_screwed_harmonies',
    name: 'A$AP Rocky "L.S.D." Screwed-and-Chopped Choir',
    category: 'backing_vocal',
    producer: 'A$AP Rocky / Hector Delgado',
    description: 'Create a trippy, slowed down harmony background. Take background vocal stacks, drop them by exactly -7 semitones via \'JS: Pitch Shifter 2\', apply heavy tape saturation using \'JClones AC2\', and space out with a ping-pong \'JS: Delay\' set to dotted quarter notes.',
    plugins: ['JS: Pitch Shifter 2', 'JClones AC2', 'JS: Delay']
  },
  {
    id: 'bone_thugs_crossroads_harmony',
    name: 'Bone Thugs-n-Harmony "Crossroads" Rap-Singing Stack',
    category: 'backing_vocal',
    producer: 'DJ U-Neek / Bone Thugs-n-Harmony',
    description: 'Emulate the fast, rapid-fire gospel-rap harmonies of the mid-90s. High-pass backing tracks at 250Hz, use \'JS: Stereo Field Manipulator\' to spread them wide (140%), and use a fast-attack FET compressor (\'JS: 1175 Compressor\') to keep the rapid syllables perfectly lock-step.',
    plugins: ['JS: Stereo Field Manipulator', 'JS: 1175 Compressor']
  },
  {
    id: 'eminem_lose_yourself_double',
    name: 'Eminem "Lose Yourself" Angry Double-Track Stacks',
    category: 'backing_vocal',
    producer: 'Eminem / Dr. Dre',
    description: 'Replicate aggressive hip-hop double tracks. Run hard-panned backing takes through \'JS: ReJJ/ReEQ\' with a strong presence boost at 3kHz, then apply extreme limiting using \'Tukan NC76\' so the raw vocal anger cuts through any heavy rock-rap beat.',
    plugins: ['JS: ReJJ/ReEQ', 'Tukan NC76']
  },
  {
    id: 'wayne_lollipop_vocoded_layers',
    name: 'Lil Wayne "Lollipop" Auto-Tuned Harmony Bus',
    category: 'backing_vocal',
    producer: 'Lil Wayne / Deezle',
    description: 'Achieve the classic late-2000s robotic backing textures. Run the harmonies through \'JS: Pitch Shifter 2\' set to instant correction speed, add extreme overdrive via \'JS: Distortion (Fuzz)\' to add digital hair, and float them using a wide stereo delay.',
    plugins: ['JS: Pitch Shifter 2', 'JS: Distortion (Fuzz)']
  },
  {
    id: 'tyler_igor_pitch_chaos',
    name: 'Tyler, The Creator "IGOR" Lo-Fi Pitch Choir',
    category: 'backing_vocal',
    producer: 'Tyler, The Creator',
    description: 'Recreate Tylers distorted, pitch-warped backing choral stacks. Feed the backing vocals into \'JS: Distortion (Fuzz)\' set to a light crunch, pitch them up +5 semitones using \'JS: Pitch Shifter 2\', and add severe high/low-pass filtering to craft a vintage, damaged tape feel.',
    plugins: ['JS: Distortion (Fuzz)', 'JS: Pitch Shifter 2']
  },
  {
    id: 'wutang_rza_gritty_basement',
    name: 'Wu-Tang Clan / RZA "36 Chambers" Gritty Basement Backing',
    category: 'backing_vocal',
    producer: 'RZA / Wu-Tang Clan',
    description: 'Emulate raw, gritty 90s East Coast underground backing. Route the backup voices through a lo-fi tape saturation (\'JClones AC2\' tape simulator at 7.5 IPS), high-pass tightly, and keep them centered to maintain a raw mono basement energy.',
    plugins: ['JClones AC2']
  },
  {
    id: 'lauryn_miseducation_neo_soul',
    name: 'Lauryn Hill "Miseducation" Warm Neo-Soul Harmonies',
    category: 'backing_vocal',
    producer: 'Lauryn Hill',
    description: 'Recreate lush, velvet-warm neo-soul vocal stacks. Apply a subtle boost at 400Hz and a gentle scoop at 2kHz via \'JS: ReJJ/ReEQ\', drive into a smooth opto-compressor (\'JClones CA2A\') for natural leveling, and send into a plate \'Tukan Lexikan 2\' for classic organic space.',
    plugins: ['JS: ReJJ/ReEQ', 'JClones CA2A', 'Tukan Lexikan 2']
  }
];
