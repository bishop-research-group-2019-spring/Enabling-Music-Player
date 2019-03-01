var player;
var currentInstr = "piano";

$(document).ready(function() {
  // player = new mm.Player();
  player = new mm.SoundFontPlayer(
    "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
  );

  console.log("player obj before caling playNote:");
  console.log(player);
});

var piano = [
  { notes: [{ pitch: 77, program: 78, startTime: 0.0, endTime: 0.4 }] },
  { notes: [{ pitch: 77, program: 50, startTime: 0.0, endTime: 0.4 }] },
  { notes: [{ pitch: 77, program: 49, startTime: 0.0, endTime: 0.4 }] },
  { notes: [{ pitch: 88, startTime: 0.0, endTime: 0.4 }] }
];

var drums = [
  {
    notes: [
      { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true }
    ],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 11
  },
  {
    notes: [
      { pitch: 40, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true }
    ],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 11
  },
  {
    notes: [
      { pitch: 30, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true }
    ],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 11
  },
  {
    notes: [
      { pitch: 60, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true }
    ],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 11
  }
];

//bind keyboard notes to clicking of large buttons on web page
$("#top-left-button").click(() => {
  play(35);
});

$("#top-right-button").click(() => {
  play(44);
});

$("#bottom-left-button").click(() => {
  play(55);
});

$("#bottom-right-button").click(() => {
  play(66);
});

//bind notes to pressing of keys (S,D,X,C)
$(document).keydown(e => {
  console.log("code of button press:");
  console.log(e.which);

  switch (e.which) {
    case 83: //S
      play(35);
      break;

    case 68: //D
      play(44);
      break;

    case 88: //X
      play(55);
      break;

    case 67: //C
      play(66);
      break;

    case 65: //A
      tabInstrument();
      setActiveInstrument();
      break;
  }
});

// Change the instrument for switching tabs
$(".list-group").click(() => {
  setActiveInstrument();
});

// Toggles between the instrument list
function tabInstrument() {
  if ($("#piano").hasClass("active")) {
    $('#list-tab a[href="#guitar"').tab("show");
  } else if ($("#guitar").hasClass("active")) {
    $('#list-tab a[href="#piano"').tab("show");
  }
}

// Changes the instrument sound based on current active tab
function setActiveInstrument() {
  if ($("#piano").hasClass("active")) {
    currentInstr = "piano";
  } else if ($("#guitar").hasClass("active")) {
    currentInstr = "drum";
  }
}

function play(pitch) {
  switch (currentInstr) {
    case "piano":
      player.start(piano[0]);
      break;
    case "drum":
    console.log("here");
      player.start({
        notes: [
          {
            pitch: pitch,
            quantizedStartStep: 10,
            quantizedEndStep: 11,
            isDrum: true
          }
        ],
        quantizationInfo: { stepsPerQuarter: 4 },
        tempos: [{ time: 0, qpm: 120 }],
        totalQuantizedSteps: 11
      });
      break;
    default:
      break;
  }
}
