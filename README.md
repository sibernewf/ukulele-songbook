# Ukulele Songbook v6.3.16

- TAB arrangements can be reopened from My Songs with **Edit arrangement**.
- Existing My Songs deletion remains available.
- TAB Composer now supports editable four-string tuning labels.
- Saved arrangements retain their structured composer project for later editing.
- The locked TAB timing renderer geometry is unchanged.

# Ukulele Songbook v6.3.8

## Changes

- Restored the full four-beat TAB measure layout in the composer preview and text export.
- Each measure now displays four visible `+` beat-boundary columns before the closing bar.
- Added the trailing spacing block after beat 4 so the fourth `+` is no longer mistaken for the end bar.
- Beat labels, chords, notes, lyrics, and the second measure all share the same corrected width calculation.
- Existing v6.3.x autosaved arrangements remain compatible.


## v6.3.14

- Kept the established four-`+` TAB measure geometry unchanged.
- Moved `1  &  2  &  3  &  4  &` onto the same timing grid as the TAB.
- Beat numbers now sit directly above the four `+` beat markers.
- Chord changes now use those same beat and `&` positions.
- Beat-aligned lyrics now use the same shared timing positions.

## v6.3.11

- Rebuilt the printable TAB timing geometry around one shared coordinate grid.
- Beat numbers, ampersands, chord changes, TAB notes and aligned lyrics now use exactly the same eight timing positions.
- Four evenly spaced `+` beat separators are drawn after beats 1, 2, 3 and 4.
- Added the trailing TAB area after the fourth separator without shifting any musical timing positions.
- Preview, TXT download and printing all use the same corrected renderer.

## v6.3.10
- Corrected TAB preview beat-divider alignment.
- Beat separator `+` characters now overlay the fixed timing grid instead of adding extra width after each beat.
- Notes, chords, beat labels and lyrics now share identical fixed columns across both measures.


## v6.3.14
- TAB notes in the printable preview now use the exact same timing columns as chords and beat labels.
- Beat notes align directly with the four fixed `+` markers; off-beat notes align with the corresponding `&` positions.
- Existing beat markers, chord placement, measure widths, and beat-label geometry were left unchanged.


## v6.3.14
- Locked TAB renderer retained unchanged.
- Added Copy preview, Download TXT, and working Print / Save PDF controls.
- Added Delete arrangement to remove the complete draft and its saved My Songs entry.
