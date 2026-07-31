# Ukulele Songbook v6.5.9.2

## v6.5.9.2 — Sidebar viewport-height fix

- Keeps the complete Academy sidebar within the visible browser window.
- The fixed Academy heading and Back to Songbook button stay visible.
- Only the lesson tree scrolls, with access through Level 7 and all later lessons.


## v6.5.9.2 — Academy Live Exercise Tracker

- Added an Academy-only live step tracker in the main content window.
- Highlights the note, chord, beat, clap or strum required on every metronome click.
- Synchronises automatically with the selected metronome tempo, including tempo changes while running.
- Loops each exercise continuously and resets to the first step when stopped.
- Highlights the matching chord diagram during chord exercises.
- Supports all Academy exercises currently available in Levels 3–6.
- Leaves normal Songbook and ordinary Practice Mode behaviour unchanged.

# Ukulele Songbook v6.5.4

## v6.5.4
- Added Academy Level 2 — Tuning Your Ukulele.
- Added collapsible Academy lesson groups in the left navigation.
- Navigation open/closed state is remembered in the browser.

## v6.5.4
- Added the four Level 0 ukulele type photographs: soprano, concert, tenor and baritone.
- Added responsive image cards and descriptive captions to the Academy page.


- Added a searchable Help Centre linked directly from the project.
- Documented the Songbook, My Songs, set lists, Practice Mode, TAB Composer, printing, fretboard chart and common questions.
- Added standard TAB technique entry up to five characters.
- Supported examples include 5/7, 7\5, 5h7, 7p5, 7b8, 8r7, 5~ and x/X.
- Kept the locked TAB timing and preview geometry unchanged.

# Ukulele Songbook v6.3.16

- TAB arrangements can be reopened from My Songs with **Edit arrangement**.
- Existing My Songs deletion remains available.
- TAB Composer now supports editable four-string tuning labels.
- Saved arrangements retain their structured composer project for later editing.
- The locked TAB timing renderer geometry is unchanged.

v6.3.14
- Locked the proven v6.3.13 TAB renderer with no geometry changes.
- Added Copy preview to clipboard.
- Confirmed Download TXT uses the same renderer output.
- Fixed Print / Save PDF so only the clean preview is printed.
- Added a master Delete arrangement button.
- Deleting an arrangement removes its autosaved draft and, when applicable, its saved My Songs entry.

v6.3.13
- Aligned chord, beat-count and beat-lyric overlays to the fixed four-plus TAB grid.
- TAB measure geometry unchanged.

v6.3.11
- Unified printable preview timing grid.
- Chords, beat labels, TAB notes and aligned lyrics now share identical timing columns.
- Corrected four evenly spaced beat separators and trailing measure spacing.

Ukulele Songbook v6.3.7

- Fixed second-measure preview alignment.
- Beat labels and chord changes now line up with the exact TAB columns in both measures.
- Corrected the two-measure width calculation used by aligned lyrics.
- Existing v6.3.x autosaved arrangements remain compatible.

Ukulele Songbook v6.3.2
========================
- Added a Strumming Pattern field to TAB Composer song information.
- Added chord changes at every 1 & 2 & 3 & 4 & position.
- Blank chord cells continue the previous chord.
- Rebuilt the printable preview with fixed-width TAB, beat and chord alignment.
- Preserved free typing and pasting in lyric text areas with monospaced spacing.
- Added backward compatibility for v6.3.0 composer drafts.

Version 6.2.2 - Collapsible Left Menu
------------------------------------------------------------

New Features:
- Added Minimise / Maximise controls for the left menu.
- The song content expands to nearly the full screen when the menu is hidden.
- Added a floating Maximise Menu button so the menu can always be restored.
- The chosen menu state is remembered on the device.
- Menu controls are hidden when printing.

------------------------------------------------------------

Version 6.2.2 - One-Page Fretboard Printing
==============================================

PRINTING FIXES
- Rebuilt the fretboard print stylesheet so the normal application is removed from the print layout rather than merely hidden.
- Eliminated the blank first page and separated heading page seen in some browsers.
- The heading, complete fretboard and explanatory legend now fit together on the first and only printed page.
- Retained the white background and black outlines to minimise printer ink.
- Optimised sizing and margins for A4 landscape printing.


🎸 Ukulele Songbook
README / CHANGELOG

------------------------------------------------------------
Version 6.2 - Printable Fretboard Note Chart
------------------------------------------------------------

Release Date:
Current Release

New Features:
- Added a Fretboard Note Chart accordion.
- Added a full G-C-E-A note chart from open strings through the 12th fret.
- Shows sharps and flats together as enharmonic note names.
- Added a large on-screen chart viewer.
- Added a dedicated Print Chart button.
- Added an A4 landscape print layout.
- Printing uses a white background and black outlines to minimise printer ink.
- App controls, navigation and background styling are hidden when printing the chart.

Files Added:
- js/fretboard-notes.js

Purpose:
Provides a clear fretboard-learning reference that can be viewed on screen or printed economically.

------------------------------------------------------------
Version 6.1 - My Songs Manager
------------------------------------------------------------

Release Date:
Current Release

New Features:
- Added My Songs Manager accordion.
- Users can paste songs directly into the app.
- Added fields for title, artist, version/arrangement, song type, tags, tuning, key, capo, difficulty, tempo, strumming and notes.
- Added preview before saving.
- Added local browser storage for user-added songs.
- My Songs appear in the normal song library alongside built-in songs.
- Added edit and delete support for My Songs.
- Added JSON backup export/import for My Songs.
- Added Export as permanent song workflow.
- Permanent export downloads a TXT song file and a matching song-list.js entry.
- Permanent export creates unique filenames to avoid overwriting existing songs.

Important Design Rule:
- Browser JavaScript cannot directly write into the project songs folder or data/song-list.js.
- My Songs are stored locally first, then can be exported and manually promoted into the permanent library.

Files Added:
- js/my-songs.js

Purpose:
Allows users to add, test and manage their own songs inside the app while still preserving a clean permanent song library.

------------------------------------------------------------
Version 6.0 - Transpose
------------------------------------------------------------

Release Date:
Previous Release

New Features:
- Added display-only song transposition.
- Added compact Transpose controls to the song metadata area.
- Added semitone down/up controls.
- Added Original button to reset back to the song as written.
- Transposes chord lines in the song display.
- Updates chord highlighting after transposition.
- Updates chord diagrams after transposition.
- Updates displayed Key metadata after transposition.
- Supports common chord types including major, minor, 7th, maj7, sus, add, dim and aug chords.
- Supports slash chords such as C/G by transposing both the main chord and bass note.
- Uses sharp chord names by default for v6.0.

Important Design Rule:
- Original song TXT files are never modified.
- Transpose is applied only to the displayed version of the song.

Files Added:
- js/transpose.js

Purpose:
Allows songs to be played in different keys while keeping the original song library clean and unchanged.

------------------------------------------------------------
Version 5.3 - Practice Studio
------------------------------------------------------------

Release Date:
Previous Release

New Features:
- Added Metronome to Practice Mode.
- Added adjustable BPM from 40 to 240.
- Added 3/4, 4/4 and 6/8 beat options.
- Added Tap tempo.
- Added Animated Strumming Trainer.
- Added BPM control for strumming animation.
- Added Practice Timer with 5, 10, 15, 20 and 30 minute sessions.

Purpose:
Expands Practice Mode into a small practice studio for timing, rhythm, strumming and focused practice sessions.

------------------------------------------------------------
Version 5.2.1 - Personal Songbook Polish
------------------------------------------------------------

Release Date:
Previous Release

New Features:
- Added Recently Played songs list.
- Added automatic resume of the last opened song.
- Added collapsible per-song notes.
- Notes are hidden by default to preserve song page space.
- Added localStorage foundations for personal song history and notes.

Files Added:
- js/history.js
- js/song-notes.js

Purpose:
Makes the app feel more like a personal songbook by remembering recently used songs and personal notes.

------------------------------------------------------------
Version 5.2 - Chord Dictionary
------------------------------------------------------------

Release Date:
Previous Release

New Features:
- Added a new Chord Dictionary accordion.
- Added chord lookup from the existing chord database.
- Displays the chord diagram, fingering code, and G C E A string order.
- Added related chord suggestions.
- Related chords can be clicked to explore nearby chord shapes.
- Missing chords are reported clearly.
- Slash chords such as C/G show the base chord fingering where possible.

Files Added:
- js/chord-dictionary.js

Purpose:
Provides a quick chord reference so the app can be used as both a songbook and a ukulele chord lookup tool.

------------------------------------------------------------
Version 5.1.1 - Auto Scroll Speed Fix
------------------------------------------------------------

Release Date:
Previous Release

Changes:
- Fixed Auto Scroll speed scaling.
- Speeds 1–9 now scroll correctly.
- Added smoother speed progression from slow practice speeds to fast navigation.
- Maximum speed remains available for quickly moving through long songs.

------------------------------------------------------------
Version 5.1 - Auto Scroll
------------------------------------------------------------

New Features:
- Added Auto Scroll to the song display.
- Added Start, Pause and Reset controls.
- Added adjustable speed control (1–10).
- Auto Scroll automatically pauses and resets when loading a new song.
- Auto Scroll settings are stored in the browser.

Purpose:
Allows hands-free song scrolling when using the app on a music stand, iPad, tablet, or computer.

------------------------------------------------------------
Version 5.0 - Practice Mode
------------------------------------------------------------

New Features:
- Added a new Practice Mode accordion.

Practice tools:
- Custom Chord Practice
  - Enter any chords such as:
    Am G6 C D
  - Supports space or comma-separated input.
  - Removes duplicate chords.
  - Reports missing chord diagrams.

- Random Chord Trainer
  - Creates random practice sets from the chord database.
  - Supports practice sets of 5, 10, 20 or all available chords.

- Learn This Song
  - Detects chords used in the selected song.
  - Creates a focused practice set.

- Chord Packs
  - Beginner Basics
  - First 10 Chords
  - Campfire Classics
  - Christmas Chords
  - Hawaiian Chill

Files Added:
- data/practice-packs.js
- js/practice.js
- js/practice-storage.js

Purpose:
Transforms the application from a digital songbook into an interactive learning tool.

------------------------------------------------------------
Version 4.9 - Compact Strumming
------------------------------------------------------------

New Features:
- Added compact visual strumming cards.
- Added support for:
  D = Down strum
  U = Up strum
  X = Chuck / muted strum
  - = Rest or hold

- Supports multiple named patterns, for example:

  Verse: D D U U D U
  Chorus: D U X U

Purpose:
Provides a quick visual representation of strumming patterns, especially useful on iPads and music stands.

------------------------------------------------------------
Version 4.8 and Earlier
------------------------------------------------------------

Major Features:
- Song library management.
- Chords, tabs and mixed song support.
- Automatic chord detection and highlighting.
- Large chord diagram database.
- Search, sorting and tagging.
- Favourite songs.
- Performance Mode.
- Set Lists with browser storage.
- Responsive layout for PC, iPad and mobile.
- Synology NAS compatibility.

The application foundation was established during versions 1.0 through 4.8.

Version 6.3.0 - TAB Composer foundation
- Added a new TAB Composer / Song Builder workspace.
- Build arrangements in editable sections with two measures per system.
- Enter fret numbers in a four-string G-C-E-A grid with eighth-note positions.
- Add chord names, section repeats and lyrics.
- Correct mistakes directly in any TAB cell; arrow keys and Enter move through cells.
- Added duplicate, clear and delete controls for systems and sections.
- Added live ASCII text preview designed for local text editors and printing.
- Added browser draft autosave and automatic draft recovery.
- Added Save to My Songs, TXT download and Print / PDF controls.

v6.3.2
- Fixed chord-change input boxes overflowing their measures.
- Chord cells now use exactly the same eight timing columns as the TAB cells.
- Added a responsive single-measure layout on narrower composer widths.

v6.3.7
- Fixed a JavaScript syntax error in the TAB Composer lyric-alignment controls.
- Restored the Open TAB Composer and Start new arrangement buttons.
- Retains all v6.3.4 lyric modes and existing autosaved arrangements.

Version 6.3.15 - Portrait TAB printing
- TAB Composer Print / PDF now requests A4 portrait orientation.
- Uses 12 mm print margins for a clean song-sheet layout.
- The portrait rule is applied only while printing a TAB arrangement, so the fretboard chart keeps its landscape print layout.
- The locked v6.3.13 TAB renderer and timing alignment are unchanged.


v6.5.9.2
- Added Academy Level 6: Rhythm and Timing.
- Academy chord exercises now show chord diagrams and the chord progression in the main content window.
- Exercise guidance only appears while an Academy exercise is loaded.
