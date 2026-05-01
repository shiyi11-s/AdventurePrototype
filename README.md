A simple adventure game by Shiyi Sun based on a simple adventure game engine by [Adam Smith](https://github.com/rndmcnlly).

Code requirements:
- **4+ scenes based on `AdventureScene`**: CandyJar, Past, Present, Future
- **2+ scenes *not* based on `AdventureScene`**: Intro, Ending1, Ending2
- **2+ methods or other enhancement added to the adventure game engine to simplify my scenes**:
    - Enhancement 1: shake(obj) — shakes an object. used when something can't be interacted with yet.
    - Enhancement 2: describe(obj, message) — attaches a pointerover message to an object so I don't have to write it out every time.

Experience requirements:
- **4+ locations in the game world**: CandyJar, Past, Present, Future
- **2+ interactive objects in most scenes**: in Past, the window and the birdcage. in Future, the silver key and the locked box.
- **Many objects have `pointerover` messages**: hovering the birdcage shows a description of it. hovering the chalk score shows a message about the notes.
- **Many objects have `pointerdown` effects**: clicking the birdcage with the right items frees the bird. clicking the locked box with the silver key opens it and reveals a flute.
- **Some objects are themselves animated**: the birdcage pulses when the bird is freed. picked-up items float up and disappear.

Asset sources:
- **Visuals**: All in-game visuals are Unicode emoji rendered as Phaser text objects (e.g. 🍬 🔑 🚪 🪟 🪺 🐦 🗝️ 📦 🎶 🎵 💀). No bitmap or vector image files were authored or imported for this stage; the actual glyph rendering is handled by whatever emoji font the player's browser/OS provides (e.g. Segoe UI Emoji on Windows, Apple Color Emoji on macOS, Noto Color Emoji on Linux). The Unicode code points themselves are part of the Unicode Standard ([emoji list](https://unicode.org/emoji/charts/full-emoji-list.html)).
- **Audio**: None used yet.
- **Text — Ending 1 poem**: An English translation of "Тихо вечер догорает" by Aleksey Pleshcheyev (Алексей Плещеев), 1845. The original Russian poem is in the public domain. The translation in `game.js` was paraphrased / abridged by me from the public Russian source for length and tone, and is credited in-game with the line `— Aleksey Pleshcheyev, 1845`. Reference for the original Russian text: [ru.wikisource.org — Тихо вечер догорает](https://ru.wikisource.org/wiki/%D0%A2%D0%B8%D1%85%D0%BE_%D0%B2%D0%B5%D1%87%D0%B5%D1%80_%D0%B4%D0%BE%D0%B3%D0%BE%D1%80%D0%B0%D0%B5%D1%82_(%D0%9F%D0%BB%D0%B5%D1%89%D0%B5%D0%B5%D0%B2)).
- **Text — Ending 2**: Original prose, written by me.
- **Music reference (concept doc only)**: The design notes mention Tchaikovsky's *The Seasons*, "June: Barcarolle" as inspiration for Ending 1's mood. The piece itself is in the public domain but is **not** played in the game at this stage.

Code sources:
- `adventure.js` and `index.html` were created for this project [Adam Smith](https://github.com/rndmcnlly) and edited by me.
- `game.js` was sketched by [Adam Smith](https://github.com/rndmcnlly) and rewritten by me.
