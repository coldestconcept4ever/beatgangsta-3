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
  }
];
