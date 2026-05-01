/* class Demo1 extends AdventureScene {
    constructor() {
        super("demo1", "First Room");
    }

    onEnter() {

        let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Metal, bent."))
            .on('pointerdown', () => {
                this.showMessage("No touching!");
                this.tweens.add({
                    targets: clip,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });

        let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("It's a nice key.")
            })
            .on('pointerdown', () => {
                this.showMessage("You pick up the key.");
                this.gainItem('key');
                this.tweens.add({
                    targets: key,
                    y: `-=${2 * this.s}`,
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                    onComplete: () => key.destroy()
                });
            })

        let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem("key")) {
                    this.showMessage("You've got the key for this door.");
                } else {
                    this.showMessage("It's locked. Can you find a key?");
                }
            })
            .on('pointerdown', () => {
                if (this.hasItem("key")) {
                    this.loseItem("key");
                    this.showMessage("*squeak*");
                    door.setText("🚪 unlocked door");
                    this.gotoScene('demo2');
                }
            })

    }
}

class Demo2 extends AdventureScene {
    constructor() {
        super("demo2", "The second room has a long name (it truly does).");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });

        let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: finish,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on('pointerdown', () => this.gotoScene('outro'));
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        this.add.text(50,50, "Adventure awaits!").setFontSize(50);
        this.add.text(50,100, "Click anywhere to begin.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('demo1'));
        });
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Intro, Demo1, Demo2, Outro],
    title: "Adventure Game",
});
*/
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
        let key = this.add.text(this.w * 0.38, this.h * 0.35, '🔑 a small key')
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

        // ---- Door 1 — Past ---- (left quarter of play area)
        this.describe(
            this.add.text(this.w * 0.12, this.h * 0.5, '🚪 Door 1\n(The Past)').setFontSize(this.s * 2),
            'Something waits behind this door.'
        ).on('pointerdown', () => this.gotoScene('past'));

        // ---- Door 2 — Present ---- (right of play area, max 0.55 to stay clear)
        this.describe(
            this.add.text(this.w * 0.55, this.h * 0.5, '🚪 Door 2\n(The Present)').setFontSize(this.s * 2),
            'Time has changed what lies beyond.'
        ).on('pointerdown', () => this.gotoScene('present'));
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
        let windowText = GameState.windowOpen ? '🪟 window (open)' : '🪟 window (closed)';
        let windowObj = this.add.text(this.w * 0.55, this.h * 0.25, windowText)
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(GameState.windowOpen
                    ? 'A cool breeze drifts in.'
                    : 'It\'s shut tight. The glass is fogged.');
            })
            .on('pointerdown', () => {
                GameState.windowOpen = !GameState.windowOpen;
                windowObj.setText(GameState.windowOpen ? '🪟 window (open)' : '🪟 window (closed)');
                this.showMessage(GameState.windowOpen ? 'You open the window.' : 'You close the window.');
                this.shake(windowObj);
            });

        let cageLabel = GameState.birdFreed ? '🪺 empty birdcage' : '🪺 birdcage';
        let cage = this.add.text(this.w * 0.18, this.h * 0.45, cageLabel)
            .setFontSize(this.s * 2)
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
                    cage.setText('🪺 empty birdcage');
                    this.showMessage('You unlock the cage. The nightingale sings one last note — then flies out the window.');
                    this.tweens.add({
                        targets: cage,
                        alpha: 0.5,
                        duration: 800,
                        yoyo: true,
                        repeat: 1
                    });

                    // ---- Bird flies out of cage, through the window ----
                    // Window is at (this.w * 0.55, this.h * 0.25)
                    const bird = this.add.text(cage.x + this.s * 2, cage.y, '🐦')
                        .setFontSize(this.s * 3)
                        .setOrigin(0.5);
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
                                x: this.w * 0.58,
                                y: this.h * 0.27,
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

        // ---- Back button ----
        this.describe(
            this.add.text(this.w * 0.05, this.h * 0.85, '← Back to candy jar').setFontSize(this.s * 1.5),
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
        let cageText = GameState.birdFreed
            ? '🪺 open birdcage'
            : '💀 birdcage (with bones)';

        this.add.text(this.w * 0.12, this.h * 0.35, cageText)
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(GameState.birdFreed
                    ? 'The cage door is still open. The bird is long gone.'
                    : 'Small bones rattle inside. The nightingale never left.');
            })
            .on('pointerdown', () => {
                this.shake(this.children.list.find(c => c.text && c.text.includes('cage')));
            });

        let chalkText = GameState.windowOpen
            ? '🎵 (blurry musical score)'
            : '🎵 musical score in chalk';

        let chalk = this.add.text(this.w * 0.38, this.h * 0.6, chalkText)
            .setFontSize(this.s * 2)
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
                        scaleX: 1.1,
                        scaleY: 1.1,
                        duration: 300,
                        yoyo: true
                    });
                }
            });
        this.add.text(this.w * 0.55, this.h * 0.25,
            GameState.windowOpen ? '🪟 window (open)' : '🪟 window (closed)')
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(GameState.windowOpen
                    ? 'Rain has gotten in. The chalk drawing is ruined.'
                    : 'Closed. The chalk drawing is preserved.');
            });
        this.describe(
            this.add.text(this.w * 0.55, this.h * 0.65, '🚪 Door 3\n(The Future)').setFontSize(this.s * 2),
            'Where does this lead?'
        ).on('pointerdown', () => this.gotoScene('future'));

        this.describe(
            this.add.text(this.w * 0.05, this.h * 0.85, '← Back to candy jar').setFontSize(this.s * 1.5),
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
        // ---- Nightingale brings silver key (only if freed) ----
        if (GameState.birdFreed) {
            // Key is hidden at first — the bird drops it.
            let silverKey = this.add.text(this.w * 0.18, this.h * 0.3, '🗝️ silver key\n(left by the nightingale)')
                .setFontSize(this.s * 2)
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

            // ---- Bird flies in carrying the key, drops it, flies away ----
            const bird = this.add.text(this.w + this.s * 4, this.h * 0.05, '🐦🗝️')
                .setFontSize(this.s * 3)
                .setOrigin(0.5);
            // Step 1: bird flies in to a hover point just above the drop spot
            this.tweens.add({
                targets: bird,
                x: this.w * 0.18,
                y: this.h * 0.3 - this.s * 3,
                duration: 1300,
                ease: 'Sine.inOut',
                onComplete: () => {
                    // Step 2: drop the key — bird becomes empty-beaked, key falls into place
                    bird.setText('🐦');
                    this.tweens.add({
                        targets: silverKey,
                        alpha: { from: 0, to: 1 },
                        y: { from: this.h * 0.3 - this.s * 2, to: this.h * 0.3 },
                        duration: 500,
                        ease: 'Bounce.out'
                    });
                    // Step 3: little hover, then bird flies off out the top-left
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
            this.add.text(this.w * 0.18, this.h * 0.3, '(no one came)')
                .setFontSize(this.s * 1.5)
                .setAlpha(0.4);
        }
        let box = this.add.text(this.w * 0.45, this.h * 0.45, '📦 locked box')
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
                        this.add.text(this.w * 0.45, this.h * 0.58, '🎶 flute')
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
        let door4 = this.add.text(this.w * 0.55, this.h * 0.72, '🚪 Door 4\n(The Way Out)')
            .setFontSize(this.s * 2)
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
                    this.showMessage('Play the melody? (click again to play, or go through the door directly below)');
                    door4.destroy();
                    this.add.text(this.w * 0.38, this.h * 0.78, '🎵 Play the melody')
                        .setFontSize(this.s * 1.8)
                        .setInteractive()
                        .on('pointerdown', () => this.gotoScene('ending1'));

                    this.add.text(this.w * 0.38, this.h * 0.88, '🚶 Just leave')
                        .setFontSize(this.s * 1.8)
                        .setInteractive()
                        .on('pointerdown', () => this.gotoScene('ending2'));
                } else {
                    this.gotoScene('ending2');
                }
            });

        // ---- Back button ----
        this.describe(
            this.add.text(this.w * 0.05, this.h * 0.85, '← Back').setFontSize(this.s * 1.5),
            'Go back to the present.'
        ).on('pointerdown', () => this.gotoScene('present'));
    }
}

// ============================================================
// ENDING 1  (plain Phaser.Scene)
// ============================================================
class Ending1 extends Phaser.Scene {
    constructor() {
        super('ending1');
    }

    create() {
        const cx = this.cameras.main.width / 2;

        this.cameras.main.setBackgroundColor('#0a0a1a');

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

        this.input.on('pointerdown', () => this.scene.start('intro'));
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
    scene: [Intro, CandyJar, Past, Present, Future, Ending1, Ending2],
    title: 'The Candy Jar',
    backgroundColor: '#1a1a1a'
});
