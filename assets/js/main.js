// Middle C is the pitch 60 -- full mapping of pitch values to notes 
// can be found here: http://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies.
//
// Library of magenta models w/ associated urls (which are given as argument to mm function) 
// found here: http://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies

// Used to hold the 4 pitches currently being played
var pitches = [];
// 16 notes across one octave up and down from middle c
var key_of_c_pitches = [
  48, //C
  50, //D
  52, //E
  53, //F
  55, //G
  57, //A
  59, //B
  60, //middle C
  62, //D
  64, //E
  65, //F
  67, //G
  69, //A
  71, //B
  72, //C
  74, //D
  76, //E
  77, //F
  79, //G
  81, //A
  83 //B
];
var recording = [];
var is_recording = false; var info_recording = false;
var is_drum = true;
note_count = 0;
var key_down = false;
var two_button_mode = false;
// Mapping to of instruments to program vals
var instruments = {
  drums: 0,
  guitar: 26,
  bass: 32,
  piano: 0
};
// Upper and lower bounds on valid pitches for instruments - either drums or other
var pitch_ranges = {
  drums: {
    upper: 81,
    lower: 48
  },
  non_drums: {
    upper: 72,
    lower: 48
  }
}
var instrument = instruments.drums;

$(document).ready(function () {
  player = new mm.SoundFontPlayer(
    "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
  );
  pitches = [59, 48, 62, 64];
});

$("#enterApp").click(() => {
  $(".overlay").css("display", "none");
});

// Button listeners
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

// Two Button Mode
$("#left-button").click(() => {
  playNote(0);
});

$("#right-button").click(() => {
  playNote(1);
});

$("#bottom-button").click(() => {
  shufflePitches();
})

$("#two-bottom-button").click(() => {
  shufflePitches();
})

$(document).keydown(e => {
  switch (e.which) {
    case 83: //S
      if (!key_down) {
        key_down = true;
        playNote(0);
        console.log("played pitch " + pitches[0]);
      }
      break;

    case 68: //D
      if (!key_down) {
        key_down = true;
        playNote(1);
        console.log("played pitch " + pitches[1]);
      }
      break;

    case 88: //X
      if (two_button_mode) {
        break;
      }
      if (!key_down) {
        key_down = true;
        playNote(2);
        console.log("played pitch " + pitches[2]);
      }
      break;

    case 67: //C
      if (two_button_mode) {
        break;
      }
      if (!key_down) {
        key_down = true;
        playNote(3);
        console.log("played pitch " + pitches[3]);
      }
      break;

    case 90: //Z
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

// Get 4 new pitches with values between 1 and 100
var shufflePitches = () => {
  if (is_drum) {
    for (let i = 0; i < pitches.length; i++) {
      pitches[i] = Math.floor(pitch_ranges.drums.lower + ((Math.random() * 100) % (pitch_ranges.drums.upper - pitch_ranges.drums.lower)));
    }
  } else {
    for (let i = 0; i < pitches.length; i++) {
      let index = Math.floor((Math.random() * 100) % key_of_c_pitches.length);
      pitches[i] = key_of_c_pitches[index];
    }
  }


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
    endTime: 0.3,
    program: instrument,
    isDrum: is_drum
  };

  if (is_recording) {
    let note_in_context = {
      pitch: pitches[index],
      startTime: note_count,
      endTime: note_count + 0.5,
      // quantizedStartStep: note_count,
      // quantizedEndStep: note_count + 2,
      program: instrument,
      isDrum: is_drum
    };
    recording.push(note_in_context);
    note_count = note_count + 0.5;
  }

  player.start({
    notes: [note],
    quantizationInfo: {
      stepsPerQuarter: 4
    },
    tempos: [{
      time: 0,
      qpm: 120
    }],
    totalQuantizedSteps: 2
  });

  setTimeout(function () {
    key_down = false;
  }, 330);
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
    $("#record-button").css("background-color", "#dc3545");
    $("#record-button").css("color", "white");
    startRecording();
  } else {
    $("#record-button").css("background-color", "rgb(247,247,247)");
    $("#record-button").css("color", "#dc3545");
    stopRecording();
  }
});

$("#info-record-button").click(() => {
  if (!info_recording) {
    $("#info-record-button").css("background-color", "#dc3545");
    $("#info-record-button").css("color", "white");
    info_recording = true;
  } else {
    $("#info-record-button").css("background-color", "rgb(247,247,247)");
    $("#info-record-button").css("color", "#dc3545");
    info_recording = false;
  }
});

$("#switch-button").click(() => {
  if (!two_button_mode) {
    $("#big-button-holder").css("display", "none");
    $("#two-button-holder").css("display", "block");
    $('#switch-button').val('Original Mode');
    two_button_mode = true;
  } else {
    $("#two-button-holder").css("display", "none");
    $("#big-button-holder").css("display", "block");
    $('#switch-button').val('2 Button Mode');
    two_button_mode = false;
  }
});

$("#stop-button").click(() => {
  player.stop();
})

$("#play_button").click(() => {
  let sequence = setSequence();

  sequence = mm.sequences.quantizeNoteSequence(sequence, 4);

  mm.Player.tone.context.resume();
  player.start(sequence);
});

$("#play-magenta").click(() => {
  if (recording.length > 0) {
    music_rnn = new mm.MusicRNN(
      "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn"
    );
    music_rnn.initialize();

    let sequence = setSequence();

    let qns = mm.sequences.quantizeNoteSequence(sequence, 4);
    let total_quantized_steps = 0;
    // Get the correct number of quantized steps by finding the ending of the last note in qns.notes
    for (let i = 0; i < qns.notes.length; i++) {
      if (total_quantized_steps < qns.notes[i].quantizedEndStep) {
        total_quantized_steps = qns.notes[i].quantizedEndStep;
      }
    }

    qns.totalQuantizedSteps = total_quantized_steps;

    music_rnn
      .continueSequence(qns, 20, 1.5)
      .then(async (sample) => {
        // Get all notes from sample with the expected instrument into ml_sequence
        let ml_sequence = sample.notes;
        for (let i = 0; i < ml_sequence.length; i++) {
          ml_sequence[i].program = instrument;
          ml_sequence[i].isDrum = is_drum;
        }

        // Will return a new note array with the notes in recording followed by the notes in ml_sequence with the correct timing
        let joined_note_sequence = join_sequences([qns.notes, ml_sequence]);

        // Successfully plays the recorded notes followed by the model genarated notes but has the wrong timing for the recorded notes
        player.start({
          notes: joined_note_sequence.sequence,
          quantizationInfo: {
            stepsPerQuarter: 4
          },
          teompo: [{
            time: 0,
            qpm: 120
          }],
          totalQuantizedSteps: joined_note_sequence.length
        })
      });

  }
});

// Converts the recorded sequence to a midi file.
$("#download-button").click(() => {
  if (recording.length == 0) {
    alert("Please finish recording before downloading.");
  } else {
    let sequence = setSequence();

    sequence = mm.sequences.quantizeNoteSequence(sequence, 4);
    let total_quantized_steps = 0;
    // console.log("total_quantized_steps:" + total_quantized_steps);
    // Get the correct number of quantized steps by finding the ending of the last note in qns.notes
    for (let i = 0; i < sequence.notes.length; i++) {
      if (total_quantized_steps < sequence.notes[i].quantizedEndStep) {
        total_quantized_steps = sequence.notes[i].quantizedEndStep;
      }
    }

    sequence.totalQuantizedSteps = total_quantized_steps;
    mm.Player.tone.context.resume();

    const midi = mm.sequenceProtoToMidi(sequence);
    const file = new Blob([midi], {
      type: 'audio/midi'
    });

    // Saves with msSaveOrOpenBlob application and otherwise
    // creates a temporary element for downloading the sequence.
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
    quantizationInfo: {
      stepsPerQuarter: 4
    },
    tempos: [{
      time: 0,
      qpm: 120
    }],
    totalQuantizedSteps: recording.length,
    program: instrument,
    isDrum: is_drum
  };
}

var join_sequences = (note_sequences) => {
  let sequences = note_sequences;
  let joined_sequence = [];
  let offset = 0;
  for (let i = 0; i < sequences.length; i++) {
    // Find the last note's end time for the current sequence and set that to be the starting note of the next sequence
    let max = 0;
    for (let j = 0; j < sequences[i].length; j++) {

      // Update start and end time for this note to reflect offset
      sequences[i][j].quantizedStartStep = sequences[i][j].quantizedStartStep + offset;
      sequences[i][j].quantizedEndStep = sequences[i][j].quantizedEndStep + offset;


      // Update max if this endtime is the greatest seen so far
      if (sequences[i][j].quantizedEndStep > max) {
        max = sequences[i][j].quantizedEndStep;
      }

      joined_sequence.push(sequences[i][j]);
    }

    offset = max;
  }

  return {
    "sequence": joined_sequence,
    "length": offset
  };
}

// WebMidi.enable(function (err) {
//   if (err) console.log("WebMidi not enabled!", err);

//   midi inputs and outputs
//   console.log(WebMidi.inputs);
//   console.log(WebMidi.outputs);

//   var input = WebMidi.getInputByName("MPK Mini Mk II");
//   console.log(input);

//   Listen for a 'note on' message on all channels
//   input.addListener('noteon', "all",
//     function (e) {
//       console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
//       var note = Math.floor(Math.random() * Math.floor(4));
//       console.log(note);
//       playNote(note);
//     }
//   );
// });