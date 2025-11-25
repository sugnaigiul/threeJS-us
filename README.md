# termiGemini — Interactive Three.js Audio Visualizer

A small, browser-based interactive Three.js project that renders a 3D scene, loads OBJ/MTL models, and reacts to audio with spawned animated "notes" and audio-reactive speaker spheres.

This repository contains a lightweight demo you can open locally that uses plain HTML/CSS/JS with Three.js loaded via importmap in `index.html`.

---

## Live demo / How to run

Open `index.html` in the github page section.

---

## Key features

- Three.js scene with imported OBJ/MTL models (uses `MTLLoader` + `OBJLoader`).
- Interactive "Play Music" button to start audio playback and spawning of 3D note objects.
- Audio-reactive animations:
  - Four speaker spheres scale in response to different frequency bands.
  - Spawned musical "notes" are animated (grow, move, rotate, fade) and respond to audio.
- Clickable invisible (transparent) sphere in the scene that also starts/stops audio and spawning when pressed.
- Responsive canvas that adapts to window resize.
- Uses PBR-like materials for spawned notes and basic scene lighting for MTL/Phong materials.

---

## Files & important code locations

- `index.html` — Page shell and importmap for Three.js modules.
- `script.js` — Main application logic (scene setup, loaders, audio, spawning, interactions).
  - Loading models from `models/` (`ois-textured.mtl/.obj`, `keynote.mtl/.obj`, etc.).
  - Audio setup and Analyser used to get frequency data and animate objects.
  - Spawning logic for note objects derived from a `keynote` template.
  - A clickable sphere (transparent) and a `Play Music` button for interaction.
- `style.css` — Styling (fonts, layout, canvas style and control button).
- `models/` — OBJ/MTL model assets used by the scene.
- `sounds/` — Sample audio files referenced by the player.

---

## Controls & Interaction

- Click the orange `Play Music` button or the clickable region in the 3D scene to begin playback.
- Holding the button spawns rapid note bursts from four speaker spheres.
- Release to stop music and spawning.
- You can orbit/zoom/pan the scene using the mouse thanks to `OrbitControls`.

---

## Customization & where to tweak things

- `script.js` contains nearly all the tunable parameters:
  - `songs` array — change or add audio file paths.
  - `MAX_NOTES`, spawn interval and growth parameters — tune how many notes spawn and their visual timing.
  - `analyser.fftSize` — affects frequency resolution used for reactive visuals.
  - Materials and colors applied when cloning the `keynote` template.

---

## License & Credits

This is a small demo project — no license provided in the repo. If you plan to reuse or publish, add a LICENSE file and respect any 3rd-party asset licensing (audio & models).
