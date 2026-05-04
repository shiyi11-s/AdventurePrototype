A simple adventure game by Shiyi Sun based on a simple adventure game engine by [Adam Smith](https://github.com/rndmcnlly).

Code requirements:
- **4+ scenes based on `AdventureScene`**: CandyJar, Past, Present, Future
- **2+ scenes *not* based on `AdventureScene`**: Preload, Intro, Ending1, Ending2
- **2+ methods or other enhancement added to the adventure game engine to simplify my scenes**:
    - Enhancement 1: `shake(obj)` — shakes an object. Used when something can't be interacted with yet (e.g. the locked box without the silver key, the worn-out cage in the Present).
    - Enhancement 2: `describe(obj, message)` — attaches a `pointerover` message to an object in one chainable call so I don't have to repeat `.setInteractive().on('pointerover', () => this.showMessage(...))` for every static label.

Experience requirements:
- **4+ locations in the game world**: CandyJar, Past, Present, Future.
- **2+ interactive objects in most scenes**: in Past, the window and the birdcage; in Present, the worn cage, the chalk score, the reflected window, and Door 3; in Future, the silver key, the locked box, the flute, and Door 4.
- **Many objects have `pointerover` messages**: hovering the birdcage shows a description of it; hovering the chalk score shows a message about the notes; etc.
- **Many objects have `pointerdown` effects**: clicking the birdcage with the right items frees the bird; clicking the locked box with the silver key opens it and reveals a flute; clicking the window toggles open/closed.
- **Some objects are themselves animated**: the birdcage pulses when the bird is freed; the nightingale flies out of the cage and through the window; in the Future the bird flies in carrying the silver key, drops it (Bounce.out tween), then flies away; picked-up items float up and disappear.

Asset sources:
- **All in-game images** (`assets/*.png` — backgrounds, doors, windows, birdcages, nightingale sprites, chalk drawings) were generated with **OpenAI ChatGPT image generation**. The unifying prompt direction was **"dreamlike, cool / cold palette"** (如梦境一般，清冷) plus the specific asset name for each request (e.g. *"inside of a candy jar"*, *"a nightingale flying"*, *"a worn-out empty birdcage"*, *"chalk drawing on the floor — original / rained-on"*, etc.). The 15 generated PNGs were saved unmodified into `assets/`. Because these are AI-generated images, no human visual artist is credited; the model used was OpenAI's image generation feature inside ChatGPT.
- **Background music**: `assets/tchaikovsky-the-seasons-june-barcarolle.mp3` is a recording of *June: Barcarolle* from Tchaikovsky's *The Seasons*, Op. 37a. The composition itself (Tchaikovsky, 1875) is in the public domain. The recording was downloaded from **[flutetunes.com](https://www.flutetunes.com/tunes.php?id=211)** and is used as the looping BGM during Ending 1.
- **Text — Ending 1 poem**: An English translation of "Тихо вечер догорает" by Aleksey Pleshcheyev (Алексей Плещеев), 1845. The original Russian poem is in the public domain. The English version in `game.js` is a paraphrased / abridged rendering of the public Russian source for length and tone, and is credited in-game with the line `— Aleksey Pleshcheyev, 1845`. Reference for the original Russian text: [ru.wikisource.org — Тихо вечер догорает](https://ru.wikisource.org/wiki/%D0%A2%D0%B8%D1%85%D0%BE_%D0%B2%D0%B5%D1%87%D0%B5%D1%80_%D0%B4%D0%BE%D0%B3%D0%BE%D1%80%D0%B0%D0%B5%D1%82_(%D0%9F%D0%BB%D0%B5%D1%89%D0%B5%D0%B5%D0%B2)).
- **Text — Ending 2**: Original prose, written by me.
- **Emoji glyphs** (🍬 🔑 🗝️ 📦 🎶 🎵 💀 🚪 🚶) are still used in-game for items the AI didn't generate sprites for (key, silver key, box, flute, bones, fallback labels). Their rendering is provided by whatever emoji font the player's browser/OS supplies (Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, etc.); the code points are part of the [Unicode Standard](https://unicode.org/emoji/charts/full-emoji-list.html).

Code sources:
- `adventure.js` and `index.html` were created for this project by [Adam Smith](https://github.com/rndmcnlly) and edited by me (added `shake` and `describe` engine helpers).
- `game.js` was sketched by [Adam Smith](https://github.com/rndmcnlly) and rewritten by me (all scenes, the Preload pipeline, the asset hookup, and both ending sequences).
