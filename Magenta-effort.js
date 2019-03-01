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

var pitches = [];
var valid_pitches = [36, 46, 56, 76, 79, 84, 68, 78, 86, 51, 67, 54, 72, 57, 60, 84]
var recording = [];
var is_recording = false;
note_count = 0;

$(document).ready(function() {
    player = new mm.Player();
    console.log("player obj before caling playNote:");
    console.log(player);
    pitches = [36, 46, 56, 76];
})

//button listeners
$("#top-left-button").click(() => {
    playNote(0);
});

$("#top-right-button").click(() => {
    playNote(1);
})

$("#bottom-right-button").click(() => {
    playNote(2);
})

$("#bottom-left-button").click(() => {
    playNote(3);
})


$(document).keydown(e => {

    switch (e.which) {
      case 83: //S
        playNote(0);
        console.log("played pitch " + pitches[0]);
        break;
  
      case 68: //D
        playNote(1);
        console.log("played pitch " + pitches[1]);
        break;
  
      case 88: //X
        playNote(2);
        console.log("played pitch " + pitches[2]);
        break;
  
      case 67: //C
        playNote(3);
        console.log("played pitch " + pitches[3]);
        break;
    
      case 32:
        shufflePitches();
        break;
    }
})

//get 4 new pitches with values between 1 and 100
var shufflePitches = () => {
      pitches[0] = valid_pitches[Math.floor((Math.random() * 100) % valid_pitches.length)];
      pitches[1] = valid_pitches[Math.floor((Math.random() * 100) % valid_pitches.length)];
      pitches[2] = valid_pitches[Math.floor((Math.random() * 100) % valid_pitches.length)];
      pitches[3] = valid_pitches[Math.floor((Math.random() * 100) % valid_pitches.length)];
      if(pitchesDontMatch()){
          return;
      } else {
          shufflePitches();
      }
  }

  var playNote = (index) => {
    mm.Player.tone.context.resume();
    let note = { pitch: pitches[index], quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true };

    if(is_recording){
        let note_in_context = {
            pitch: pitches[index], 
            quantizedStartStep: note_count, 
            quantizedEndStep: note_count+1,
            isDrum: true
        }
        recording.push(note_in_context);
        note_count = note_count + 1;
    }

    player.start(
        {notes: 
            [note],
            quantizationInfo: {stepsPerQuarter: 4},
            tempos: [{time: 0, qpm: 120}],
            totalQuantizedSteps:1
        }
    )
}

var pitchesDontMatch = () => {
      for(let i=0; i<pitches.length; i++){
          for(let j = i; j<pitches.length; j++){
            if(i != j){
                if(pitches[i] == pitches[j]){
                    return false;
                }
            }
          }
      }

      return true;
}

$("#record-button").click(() => {
    if(!is_recording){
        $("#record-button").css("background-color", "red");
        $("#record-button").css("color", "white");
        startRecording();
    } else {
        $("#record-button").css("background-color", "rgb(247,247,247)");
        $("#record-button").css("color", "#007bff");
        stopRecording();
    }

})

$("#play_button").click(() => {
    console.log(recording);
    let sequence =
    {
        notes:recording,
        quantizationInfo: {stepsPerQuarter: 4},
        tempos: [{time: 0, qpm: 120}],
        totalQuantizedSteps:recording.length
    }
    console.log(sequence);
    mm.Player.tone.context.resume();
    player.start(sequence);
})

$("#play-magenta").click(() => {
    if(recording.length > 0){
        music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
        music_rnn.initialize();

        rnnPlayer = new mm.Player();

        function play() {
            if (rnnPlayer.isPlaying()) {
              rnnPlayer.stop();
              return;
            }
        }

        
        let sequence = 
        {
            notes: recording,
            quantizationInfo: {stepsPerQuarter: 4},
            tempos: [{time: 0, qpm: 120}],
            totalQuantizedSteps:recording.length
        }

        console.log("sequence:");
        console.log(sequence);
    
        const qns = mm.sequences.quantizeNoteSequence(sequence, 4);


        music_rnn
        .continueSequence(sequence, 20, 1.5)
        .then((sample) => rnnPlayer.start(sample));
    }


})

var startRecording = () => {
    recording = [];
    is_recording = true;
    note_count = 0;
}

var stopRecording = () => {
    is_recording = false;
}
