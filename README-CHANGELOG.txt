🎸 Ukulele Songbook
README / CHANGELOG

------------------------------------------------------------
Version 6.0 - Transpose
------------------------------------------------------------

Release Date:
Current Release

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
