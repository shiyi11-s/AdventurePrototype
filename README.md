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
- (For each image/audio/video asset used, describe how it was created. What tool did you use to create it? Was it based on another work? If so, how did you change it, and where can we learn more about the original work for comparison? Use [Markdown link syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#links).)
For the stage 2 still just emojis

Code sources:
- `adventure.js` and `index.html` were created for this project [Adam Smith](https://github.com/rndmcnlly) and edited by me.
- `game.js` was sketched by [Adam Smith](https://github.com/rndmcnlly) and rewritten by me.