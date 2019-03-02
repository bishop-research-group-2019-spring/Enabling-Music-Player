var pitches = [];
var valid_pitches = [
  36,
  46,
  56,
  76,
  79,
  84,
  68,
  78,
  86,
  51,
  67,
  54,
  72,
  57,
  60,
  84
];
var recording = [];
var is_recording = false;
var is_drum = true;
note_count = 0;
var instruments = {
  drums: 0,
  guitar: 26,
  bass: 32,
  piano: 0
};
var instrument = instruments.drums;

$(document).ready(function() {
  // Enables overflow-y attribute for mobile devices.
  if (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  ) {
    $(document.body).css("overflow-y", "auto");
  }

  player = new mm.SoundFontPlayer(
    "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
  );
  console.log("player obj before caling playNote:");
  console.log(player);
  pitches = [36, 46, 56, 76];
});

//button listeners
$("#top-left-button").click(() => {
  playNote(0);
});

$("#top-right-button").click(() => {
  playNote(1);
});

$("#bottom-right-button").click(() => {
  playNote(2);
});

$("#bottom-left-button").click(() => {
  playNote(3);
});

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

    case 65: //A
      tabInstrument();
      break;
  }
});

// Change the instrument for clicking tabs
$('#list-tab a[href="#drums"').click(() => {
  instrument = instruments.drums;
  is_drum = true;
});

$('#list-tab a[href="#guitar"').click(() => {
  instrument = instruments.guitar;
  is_drum = false;
});

$('#list-tab a[href="#bass"').click(() => {
  instrument = instruments.bass;
  is_drum = false;
});

$('#list-tab a[href="#piano"').click(() => {
  instrument = instruments.piano;
  is_drum = false;
});

// Toggles between the instrument list
function tabInstrument() {
  if ($("#drums").hasClass("active")) {
    $('#list-tab a[href="#guitar"').tab("show");
    instrument = instruments.guitar;
    is_drum = false;
  } else if ($("#guitar").hasClass("active")) {
    $('#list-tab a[href="#bass"').tab("show");
    instrument = instruments.bass;
    is_drum = false;
  } else if ($("#bass").hasClass("active")) {
    $('#list-tab a[href="#piano"').tab("show");
    instrument = instruments.piano;
    is_drum = false;
  } else if ($("#piano").hasClass("active")) {
    $('#list-tab a[href="#drums"').tab("show");
    instrument = instruments.drums;
    is_drum = true;
  }
}

//get 4 new pitches with values between 1 and 100
var shufflePitches = () => {
  pitches[0] =
    valid_pitches[Math.floor((Math.random() * 100) % valid_pitches.length)];
  pitches[1] =
    valid_pitches[Math.floor((Math.random() * 100) % valid_pitches.length)];
  pitches[2] =
    valid_pitches[Math.floor((Math.random() * 100) % valid_pitches.length)];
  pitches[3] =
    valid_pitches[Math.floor((Math.random() * 100) % valid_pitches.length)];
  if (pitchesDontMatch()) {
    return;
  } else {
    shufflePitches();
  }
};

var playNote = index => {
  mm.Player.tone.context.resume();
  let note = {
    pitch: pitches[index],
    startTime: 0,
    endTime: 0.5,
    program: instrument,
    isDrum: is_drum
  };

  if (is_recording) {
    let note_in_context = {
      pitch: pitches[index],
      quantizedStartStep: note_count,
      quantizedEndStep: note_count + 2,
      isDrum: is_drum
    };
    recording.push(note_in_context);
    note_count = note_count + 3;
  }
  console.log({
    notes: [note],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 1
  });
  player.start({
    notes: [note],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 1
  });
};

var pitchesDontMatch = () => {
  for (let i = 0; i < pitches.length; i++) {
    for (let j = i; j < pitches.length; j++) {
      if (i != j) {
        if (pitches[i] == pitches[j]) {
          return false;
        }
      }
    }
  }

  return true;
};

$("#record-button").click(() => {
  if (!is_recording) {
    $("#record-button").css("background-color", "red");
    $("#record-button").css("color", "white");
    startRecording();
  } else {
    $("#record-button").css("background-color", "rgb(247,247,247)");
    $("#record-button").css("color", "#007bff");
    stopRecording();
  }
});

$("#play_button").click(() => {
  console.log(recording);
  let sequence = setSequence();
  console.log(sequence);
  mm.Player.tone.context.resume();
  player.start(sequence);
});

$("#play-magenta").click(() => {
  if (recording.length > 0) {
    music_rnn = new mm.MusicRNN(
      "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn"
    );
    music_rnn.initialize();

    rnnPlayer = new mm.Player();

    function play() {
      if (rnnPlayer.isPlaying()) {
        rnnPlayer.stop();
        return;
      }
    }

    let sequence = setSequence();

    console.log("sequence:");
    console.log(sequence);

    const qns = mm.sequences.quantizeNoteSequence(sequence, 4);

    music_rnn
      .continueSequence(sequence, 20, 1.5)
      .then(sample => rnnPlayer.start(sample));
  }
});

// Converts the recorded sequence to a midi file.
$("#download-button").click(() => {
  if (recording.length == 0) {
    alert("Please finish recording before downloading.");
  } else {
    let sequence = setSequence();
    const midi = mm.sequenceProtoToMidi(sequence);
    const file = new Blob([midi], { type: 'audio/midi' });

    // Simple save with msSaveOrOpenBlob application and otherwise
    // creates an element for downloading the sequence.
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, 'enabling_music_player.mid');
    } else {
      const a = document.createElement('a');
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = 'enabling_music_player.mid';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
});

var startRecording = () => {
  recording = [];
  is_recording = true;
  note_count = 0;
};

var stopRecording = () => {
  is_recording = false;
};

function setSequence() {
  return {
    notes: recording,
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: recording.length
  };
}