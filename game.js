// ============================================================
// GLOBAL STATE
// Use a plain object to share state between scenes
// ============================================================
const GameState = {
    birdFreed: false,    // Did the player free the nightingale?
    windowOpen: false,   // Is the window in the Past open?
    sawScore: false,     // Did the player see the musical score?
};

// ============================================================
// PRELOAD SCENE
// Loads every image / audio asset once, up front, so that all
// later scenes can reference them by key without re-fetching.
// ============================================================
class Preload extends Phaser.Scene {
    constructor() {
        super('preload');
    }

    preload() {
        // Backgrounds
        this.load.image('bg-candyjar', 'assets/candy-jar-background.png');
        this.load.image('bg-room',     'assets/room-background.png');

        // Doors
        this.load.image('door',        'assets/door.png');

        // Windows (Past + reflected in Present)
        this.load.image('window-closed', 'assets/closed-window.png');
        this.load.image('window-open',   'assets/opened-window.png');

        // Birdcages — Past has the fresh cage, Present has the worn one
        this.load.image('cage-closed',      'assets/closed-birdcage.png');
        this.load.image('cage-open',        'assets/opened-birdcage.png');
        this.load.image('cage-with-bird',   'assets/nightingale-incage-version.png');
        this.load.image('cage-worn-closed', 'assets/worn-out-closed-birdcage.png');
        this.load.image('cage-worn-open',   'assets/worn-out-opened-birdcage.png');

        // Nightingale flying
        this.load.image('bird-fly',     'assets/nightingale-flyversion1.png');
        this.load.image('bird-fly-key', 'assets/birdfly-version2.png');

        // Chalk drawing in Present
        this.load.image('chalk',        'assets/chalkpaint.png');
        this.load.image('chalk-rained', 'assets/rained-chalkpaint.png');

        // Audio for Ending 1
        this.load.audio('barcarolle', 'assets/tchaikovsky-the-seasons-june-barcarolle.mp3');

        // Simple "loading" feedback
        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2;
        this.add.text(cx, cy, 'Loading...', {
            fontSize: '32px', color: '#888888'
        }).setOrigin(0.5);
    }

    create() {
        this.scene.start('intro');
    }
}

// ============================================================
// INTRO SCENE  (plain Phaser.Scene — no AdventureScene needed)
// ============================================================
class Intro extends Phaser.Scene {
    constructor() {
        super('intro');
    }

    create() {
        // Reset state every new run
        GameState.birdFreed = false;
        GameState.windowOpen = false;
        GameState.sawScore = false;

        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2;

        this.add.text(cx, cy - 160,
            "You haven't opened it in years.",
            { fontSize: '36px', color: '#cccccc' }
        ).setOrigin(0.5);

        this.add.text(cx, cy - 100,
            "You don't remember what you put inside.",
            { fontSize: '28px', color: '#aaaaaa' }
        ).setOrigin(0.5);

        const jar = this.add.text(cx, cy + 20, '🍬', { fontSize: '120px' })
            .setOrigin(0.5)
            .setInteractive();

        this.add.text(cx, cy + 140, 'A candy jar.  Click to open.',
            { fontSize: '24px', color: '#888888' }
        ).setOrigin(0.5);

        jar.on('pointerover', () => jar.setAlpha(0.7));
        jar.on('pointerout',  () => jar.setAlpha(1));
        jar.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('candyjar'));
        });
    }
}

// ============================================================
// SCENE 1 — CandyJar  (AdventureScene)
// ============================================================
class CandyJar extends AdventureScene {
    constructor() {
        super('candyjar', 'Inside the Candy Jar');
    }

    onEnter() {
        // ---- Background fills the play area (left 75%) ----
        this.add.image(this.w * 0.375, this.h * 0.5, 'bg-candyjar')
            .setDisplaySize(this.w * 0.75, this.h);

        // ---- Key (still an emoji — no sprite for the small brass key) ----
        let key = this.add.text(this.w * 0.38, this.h * 0.85, '🔑 a small key')
            .setFontSize(this.s * 2);
        this.describe(key, 'An old brass key. Still shiny.')
            .on('pointerdown', () => {
                if (!this.hasItem('key')) {
                    this.gainItem('key');
                    this.showMessage('You pick up the key.');
                    this.tweens.add({
                        targets: key,
                        y: `-=${this.s * 2}`,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => key.destroy()
                    });
                }
            });

        // ---- Door 1 — Past ----
        const door1 = this.add.image(this.w * 0.15, this.h * 0.6, 'door')
            .setOrigin(0.5)
            .setScale(0.64);
        this.describe(door1, 'Door 1 — something waits behind it. (The Past)')
            .on('pointerdown', () => this.gotoScene('past'));

        // ---- Door 2 — Present ----
        const door2 = this.add.image(this.w * 0.6, this.h * 0.6, 'door')
            .setOrigin(0.5)
            .setScale(0.64);
        this.describe(door2, 'Door 2 — time has changed what lies beyond. (The Present)')
            .on('pointerdown', () => this.gotoScene('present'));
    }
}

// ============================================================
// SCENE 2 — Past  (AdventureScene)
// ============================================================
class Past extends AdventureScene {
    constructor() {
        super('past', 'The Past');
    }

    onEnter() {
        // ---- Background ----
        this.add.image(this.w * 0.375, this.h * 0.5, 'bg-room')
            .setDisplaySize(this.w * 0.75, this.h);

        // ---- Window (toggles open/closed) ----
        let windowObj = this.add.image(this.w * 0.6, this.h * 0.32,
                GameState.windowOpen ? 'window-open' : 'window-closed')
            .setOrigin(0.5)
            .setScale(0.18)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(GameState.windowOpen
                    ? 'A cool breeze drifts in.'
                    : 'It\'s shut tight. The glass is fogged.');
            })
            .on('pointerdown', () => {
                GameState.windowOpen = !GameState.windowOpen;
                windowObj.setTexture(GameState.windowOpen ? 'window-open' : 'window-closed');
                this.showMessage(GameState.windowOpen
                    ? 'You open the window.'
                    : 'You close the window.');
                this.shake(windowObj);
            });

        // ---- Birdcage (with nightingale visible until freed) ----
        // Forward-declared so the closure inside cage.pointerdown can fade it later.
        let cageOverlay = null;

        // Bottom layer: bird-in-cage (or open cage after the bird leaves).
        const cageKeyInitial = GameState.birdFreed ? 'cage-open' : 'cage-with-bird';
        let cage = this.add.image(this.w * 0.22, this.h * 0.55, cageKeyInitial)
            .setOrigin(0.5)
            .setScale(GameState.birdFreed ? 0.32 : 0.22)
            .setInteractive()
            .on('pointerover', () => {
                if (GameState.birdFreed) {
                    this.showMessage('The cage door swings open. It\'s empty now.');
                } else {
                    this.showMessage('A nightingale sits inside, singing softly.');
                }
            })
            .on('pointerdown', () => {
                if (GameState.birdFreed) {
                    this.showMessage('Already empty.');
                    return;
                }
                if (this.hasItem('key')) {
                    if (!GameState.windowOpen) {
                        this.showMessage('You should open the window first, so the bird can fly free.');
                        return;
                    }
                    this.loseItem('key');
                    GameState.birdFreed = true;

                    // Fade out the closed-cage overlay so the bird is visible escaping
                    if (cageOverlay) {
                        this.tweens.add({
                            targets: cageOverlay,
                            alpha: 0,
                            duration: 600,
                            onComplete: () => cageOverlay.destroy()
                        });
                    }

                    // Swap to the open-cage texture (and its scale)
                    cage.setTexture('cage-open');
                    cage.setScale(0.32);

                    this.showMessage('You unlock the cage. The nightingale sings one last note — then flies out the window.');
                    this.tweens.add({
                        targets: cage,
                        alpha: 0.6,
                        duration: 800,
                        yoyo: true,
                        repeat: 1
                    });

                    // ---- Bird flies out of cage, through the window ----
                    const bird = this.add.image(cage.x + this.s * 3, cage.y, 'bird-fly')
                        .setOrigin(0.5)
                        .setScale(0.11);
                    // Step 1: lift out of the cage
                    this.tweens.add({
                        targets: bird,
                        y: cage.y - this.s * 4,
                        duration: 500,
                        ease: 'Sine.out',
                        onComplete: () => {
                            // Step 2: fly across to the window
                            this.tweens.add({
                                targets: bird,
                                x: this.w * 0.6,
                                y: this.h * 0.32,
                                duration: 800,
                                ease: 'Sine.inOut',
                                onComplete: () => {
                                    // Step 3: dart out through the window and fade
                                    this.tweens.add({
                                        targets: bird,
                                        x: this.w + this.s * 5,
                                        y: this.h * 0.05,
                                        alpha: 0,
                                        duration: 700,
                                        ease: 'Sine.in',
                                        onComplete: () => bird.destroy()
                                    });
                                }
                            });
                        }
                    });
                } else {
                    this.showMessage('It\'s locked. You need a key.');
                }
            });

        // Top layer: closed-cage bars drawn over the bird so it reads as 'trapped'.
        // Added AFTER the bird-cage so its z-index is above it.
        if (!GameState.birdFreed) {
            cageOverlay = this.add.image(this.w * 0.22, this.h * 0.55, 'cage-closed')
                .setOrigin(0.5)
                .setScale(0.44);
        }

        // ---- Back button ----
        this.describe(
            this.add.text(this.w * 0.05, this.h * 0.9, '← Back to candy jar')
                .setFontSize(this.s * 1.5)
                .setColor('#ffffff'),
            'Return to the candy jar.'
        ).on('pointerdown', () => this.gotoScene('candyjar'));
    }
}

// ============================================================
// SCENE 3 — Present  (AdventureScene)
// ============================================================
class Present extends AdventureScene {
    constructor() {
        super('present', 'The Present');
    }

    onEnter() {
        // ---- Background ----
        this.add.image(this.w * 0.375, this.h * 0.5, 'bg-room')
            .setDisplaySize(this.w * 0.75, this.h)
            .setTint(0x9999aa); // wash the room a touch cooler / older

        // ---- Worn birdcage (state-dependent) ----
        const cageTextureKey = GameState.birdFreed ? 'cage-worn-open' : 'cage-worn-closed';
        const cage = this.add.image(this.w * 0.18, this.h * 0.5, cageTextureKey)
            .setOrigin(0.5)
            .setScale(0.32)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(GameState.birdFreed
                    ? 'The cage door is still open. The bird is long gone.'
                    : 'Small bones rattle inside. The nightingale never left.');
            })
            .on('pointerdown', () => this.shake(cage));

        // If the bird never flew, overlay a small bones glyph so it's clear
        if (!GameState.birdFreed) {
            this.add.text(this.w * 0.18, this.h * 0.55, '💀', {
                fontSize: `${this.s * 2.4}px`
            }).setOrigin(0.5);
        }

        // ---- Chalk drawing (clear vs rained-on) ----
        const chalkTextureKey = GameState.windowOpen ? 'chalk-rained' : 'chalk';
        let chalk = this.add.image(this.w * 0.4, this.h * 0.7, chalkTextureKey)
            .setOrigin(0.5)
            .setScale(0.18)
            .setInteractive()
            .on('pointerover', () => {
                if (GameState.windowOpen) {
                    this.showMessage('Rain came through the open window. The notes are smeared — almost unreadable.');
                } else {
                    this.showMessage('A musical score drawn carefully in chalk. You memorize the notes.');
                    GameState.sawScore = true;
                }
            })
            .on('pointerdown', () => {
                if (GameState.windowOpen) {
                    this.showMessage('You try to make out the notes, but they\'re too blurry.');
                } else {
                    GameState.sawScore = true;
                    this.showMessage('You study the score carefully. The melody stays with you.');
                    this.tweens.add({
                        targets: chalk,
                        scaleX: chalk.scaleX * 1.1,
                        scaleY: chalk.scaleY * 1.1,
                        duration: 300,
                        yoyo: true
                    });
                }
            });

        // ---- Read-only window reflection (shows what state Past left it in) ----
        const reflectedWindow = this.add.image(this.w * 0.6, this.h * 0.32,
                GameState.windowOpen ? 'window-open' : 'window-closed')
            .setOrigin(0.5)
            .setScale(0.16)
            .setAlpha(0.85)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(GameState.windowOpen
                    ? 'Rain has gotten in. The chalk drawing is ruined.'
                    : 'Closed. The chalk drawing is preserved.');
            });

        // ---- Door 3 — Future ----
        const door3 = this.add.image(this.w * 0.6, this.h * 0.7, 'door')
            .setOrigin(0.5)
            .setScale(0.15);
        this.describe(door3, 'Door 3 — where does this lead? (The Future)')
            .on('pointerdown', () => this.gotoScene('future'));

        // ---- Back button ----
        this.describe(
            this.add.text(this.w * 0.05, this.h * 0.9, '← Back to candy jar')
                .setFontSize(this.s * 1.5)
                .setColor('#ffffff'),
            'Return to the candy jar.'
        ).on('pointerdown', () => this.gotoScene('candyjar'));
    }
}

// ============================================================
// SCENE 4 — Future  (AdventureScene)
// ============================================================
class Future extends AdventureScene {
    constructor() {
        super('future', 'The Future');
    }

    onEnter() {
        // ---- Background ----
        this.add.image(this.w * 0.375, this.h * 0.5, 'bg-room')
            .setDisplaySize(this.w * 0.75, this.h)
            .setTint(0xc8c8e0); // cooler still — far future

        // ---- Nightingale brings silver key (only if freed) ----
        if (GameState.birdFreed) {
            // Silver key emoji — hidden until the bird drops it.
            let silverKey = this.add.text(this.w * 0.2, this.h * 0.4,
                    '🗝️ silver key\n(left by the nightingale)')
                .setFontSize(this.s * 1.6)
                .setOrigin(0.5)
                .setAlpha(0);
            this.describe(silverKey, 'The nightingale remembered you.')
                .on('pointerdown', () => {
                    if (silverKey.alpha < 1) return; // not delivered yet
                    if (!this.hasItem('silverkey')) {
                        this.gainItem('silverkey');
                        this.showMessage('You pick up the silver key.');
                        this.tweens.add({
                            targets: silverKey,
                            y: `-=${this.s * 2}`,
                            alpha: 0,
                            duration: 500,
                            onComplete: () => silverKey.destroy()
                        });
                    }
                });

            // Bird sprite carrying the key — flies in, drops it, flies away.
            const bird = this.add.image(this.w + this.s * 5, this.h * 0.1, 'bird-fly-key')
                .setOrigin(0.5)
                .setScale(0.13);

            // Step 1: bird flies in to a hover point just above the drop spot
            this.tweens.add({
                targets: bird,
                x: this.w * 0.2,
                y: this.h * 0.4 - this.s * 4,
                duration: 1300,
                ease: 'Sine.inOut',
                onComplete: () => {
                    // Step 2: drop the key — switch to bare-bird sprite, key falls into place
                    bird.setTexture('bird-fly');
                    this.tweens.add({
                        targets: silverKey,
                        alpha: { from: 0, to: 1 },
                        y: { from: this.h * 0.4 - this.s * 2, to: this.h * 0.4 },
                        duration: 500,
                        ease: 'Bounce.out'
                    });
                    // Step 3: bird flies off out the top-left
                    this.time.delayedCall(550, () => {
                        this.tweens.add({
                            targets: bird,
                            x: -this.s * 5,
                            y: -this.s * 4,
                            alpha: 0,
                            duration: 1100,
                            ease: 'Sine.in',
                            onComplete: () => bird.destroy()
                        });
                    });
                }
            });
        } else {
            this.add.text(this.w * 0.2, this.h * 0.4, '(no one came)', {
                fontSize: `${this.s * 1.5}px`,
                color: '#888888'
            }).setOrigin(0.5).setAlpha(0.6);
        }

        // ---- Locked box (no sprite — emoji) ----
        let box = this.add.text(this.w * 0.45, this.h * 0.55, '📦 locked box')
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(this.hasItem('silverkey')
                    ? 'You have the silver key. You could open this.'
                    : 'It\'s locked with a silver lock.');
            })
            .on('pointerdown', () => {
                if (this.hasItem('silverkey')) {
                    this.loseItem('silverkey');
                    box.setText('📦 open box');
                    this.showMessage('The box opens. Inside: a flute.');
                    this.tweens.add({
                        targets: box,
                        scaleX: 1.15,
                        scaleY: 1.15,
                        duration: 400,
                        yoyo: true
                    });

                    // Reveal flute
                    this.time.delayedCall(600, () => {
                        this.add.text(this.w * 0.45, this.h * 0.65, '🎶 flute')
                            .setFontSize(this.s * 2)
                            .setInteractive()
                            .on('pointerover', () => {
                                this.showMessage(this.hasItem('flute')
                                    ? 'You\'re already holding it.'
                                    : 'A slender silver flute.');
                            })
                            .on('pointerdown', () => {
                                if (!this.hasItem('flute')) {
                                    this.gainItem('flute');
                                    this.showMessage('You pick up the flute.');
                                }
                            });
                    });
                } else {
                    this.showMessage('It won\'t open. You need a silver key.');
                    this.shake(box);
                }
            });

        // ---- Door 4 — The way out ----
        const door4 = this.add.image(this.w * 0.6, this.h * 0.72, 'door')
            .setOrigin(0.5)
            .setScale(0.15)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem('flute') && GameState.sawScore) {
                    this.showMessage('You could play the melody now. Or just leave.');
                } else {
                    this.showMessage('A door leading out. Something feels unfinished.');
                }
            })
            .on('pointerdown', () => {
                if (this.hasItem('flute') && GameState.sawScore) {
                    this.showMessage('Play the melody, or just leave?');
                    door4.disableInteractive();
                    door4.setAlpha(0.4);
                    this.add.text(this.w * 0.4, this.h * 0.84, '🎵 Play the melody')
                        .setFontSize(this.s * 1.8)
                        .setInteractive()
                        .on('pointerdown', () => this.gotoScene('ending1'));

                    this.add.text(this.w * 0.4, this.h * 0.91, '🚶 Just leave')
                        .setFontSize(this.s * 1.8)
                        .setInteractive()
                        .on('pointerdown', () => this.gotoScene('ending2'));
                } else {
                    this.gotoScene('ending2');
                }
            });

        // ---- Back button ----
        this.describe(
            this.add.text(this.w * 0.05, this.h * 0.9, '← Back')
                .setFontSize(this.s * 1.5)
                .setColor('#ffffff'),
            'Go back to the present.'
        ).on('pointerdown', () => this.gotoScene('present'));
    }
}

// ============================================================
// ENDING 1  (plain Phaser.Scene)
// Plays Tchaikovsky's June: Barcarolle as background music.
// ============================================================
class Ending1 extends Phaser.Scene {
    constructor() {
        super('ending1');
    }

    create() {
        const cx = this.cameras.main.width / 2;

        this.cameras.main.setBackgroundColor('#0a0a1a');

        // ---- BGM ----
        this.bgm = this.sound.add('barcarolle', { volume: 0.6, loop: true });
        this.bgm.play();

        // ---- Title ----
        this.add.text(cx, 80, '🎵 Ending 1: The Nightingale\'s Song', {
            fontSize: '38px', color: '#e8d5a3'
        }).setOrigin(0.5);

        const poem = [
            "Let us go to the shore, where the waves will kiss our feet,",
            "where the stars with mysterious sorrow shine down on us in the night.",
            "",
            "There the fragrant breeze will loosen your hair and play;",
            "come away — the poplar sways, mournful, and calls us away.",
            "",
            "All will be forgotten, when the moon gleams in the dark blue above,",
            "all — as the nightingale sings its hymn to nature, and to God.",
            "",
            "— Aleksey Pleshcheyev, 1845"
        ];

        poem.forEach((line, i) => {
            this.add.text(cx, 180 + i * 52, line, {
                fontSize: '22px',
                color: line.startsWith('—') ? '#888888' : '#cccccc',
                fontStyle: line.startsWith('—') ? 'italic' : 'normal'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: this.children.list[this.children.list.length - 1],
                alpha: 1,
                duration: 800,
                delay: i * 300
            });
        });

        this.add.text(cx, 780, 'Click anywhere to play again.', {
            fontSize: '20px', color: '#555555'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            // Fade music out, then restart
            if (this.bgm) {
                this.tweens.add({
                    targets: this.bgm,
                    volume: 0,
                    duration: 800,
                    onComplete: () => this.bgm.stop()
                });
            }
            this.cameras.main.fade(900, 0, 0, 0);
            this.time.delayedCall(900, () => this.scene.start('intro'));
        });
    }
}

// ============================================================
// ENDING 2  (plain Phaser.Scene)
// ============================================================
class Ending2 extends Phaser.Scene {
    constructor() {
        super('ending2');
    }

    create() {
        const cx = this.cameras.main.width / 2;

        this.cameras.main.setBackgroundColor('#0d0d0d');

        this.add.text(cx, 120, 'Ending 2: The Empty Jar', {
            fontSize: '38px', color: '#888888'
        }).setOrigin(0.5);

        const lines = [
            "You look at the candy jar.",
            "You remember putting something precious inside, once.",
            "A plastic bracelet that caught the light, maybe. Or something else.",
            "You can't quite remember.",
            "",
            "You open it.",
            "",
            "Nothing.",
            "Just the flat brass bottom, staring back at you."
        ];

        lines.forEach((line, i) => {
            this.add.text(cx, 240 + i * 58, line, {
                fontSize: line === 'Nothing.' ? '32px' : '24px',
                color: line === 'Nothing.' ? '#ffffff' : '#888888',
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: this.children.list[this.children.list.length - 1],
                alpha: 1,
                duration: 1000,
                delay: i * 400
            });
        });

        this.add.text(cx, 820, 'Click anywhere to play again.', {
            fontSize: '20px', color: '#333333'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}

// ============================================================
// GAME CONFIG
// ============================================================
const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Preload, Intro, CandyJar, Past, Present, Future, Ending1, Ending2],
    title: 'The Candy Jar',
    backgroundColor: '#1a1a1a'
});
