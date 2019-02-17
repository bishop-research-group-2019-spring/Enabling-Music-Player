console.log("inside of Magenta-effort.js script");

$("#top-left-button").click(() => {
    console.log("inside of click listener");
    player = new mm.Player();

    DRUMS = {
        notes: [
          { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
          { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
          { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
          { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
          { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
          { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
          { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
          { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
          { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
          { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
          { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
          { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
          { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
          { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
          { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
          { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
          { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
          { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
        ],
        quantizationInfo: {stepsPerQuarter: 4},
        tempos: [{time: 0, qpm: 120}],
        totalQuantizedSteps: 11
    };
    
    player.start(DRUMS);
    console.log("after player.start(DRUMS)");
});
