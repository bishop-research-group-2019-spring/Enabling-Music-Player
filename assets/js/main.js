//Magenta did playback successfully but not related to what the input was at all
//Middle C is the pitch 60 -- full mapping of pitch values to notes can be found here: http://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
//library of magenta models w/ associated urls (which are given as argument to mm function) found here: http://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
var pitches = []; //used to hold the 4 pitches currently being played
var key_of_c_pitches = [ //16 notes across one octave up and down from middle c
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
  83, //B
  84, //C
];
var recording = [];
var is_recording = false;
var is_drum = true;
note_count = 0;
var key_down = false;
var two_button_mode = false;
//mapping to of instruments to program vals
var instruments = {
  drums: 0,
  guitar: 26,
  bass: 32,
  piano: 0
};
//upper and lower bounds on valid pitches for instruments - either drums or other
var pitch_ranges = {
  drums: {
    upper: 81,
    lower: 35
  },
  non_drums: {
    upper: 108,
    lower: 21
  }
}
var instrument = instruments.drums;

$(document).ready(function () {
  player = new mm.SoundFontPlayer(
    "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
  );
  console.log("player obj before caling playNote:");
  console.log(player);
  pitches = [59, 60, 62, 64];
});

//button listeners
$("#top-left-button").click(() => {
  playNote(0);
});

$("#top-right-button").click(() => {
  if (!two_button_mode) {
    playNote(1);
  }
});

$("#bottom-right-button").click(() => {
  if (!two_button_mode) {
    playNote(2);
  }
});

$("#bottom-left-button").click(() => {
  playNote(3);
});

$("#bottom-button").click(() => {
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

    case 32: //space
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
      endTime: note_count + 0.25,
      // quantizedStartStep: note_count,
      // quantizedEndStep: note_count + 2,
      program: instrument,
      isDrum: is_drum
    };
    recording.push(note_in_context);
    note_count = note_count + 0.25;
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

  setTimeout(function(){key_down = false;}, 330);
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
    $("#record-button").css("color", "red");
    stopRecording();
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
  console.log("inside of stop_button.click");
  player.stop();
  console.log("after call of player.stop()");
})

$("#play_button").click(() => {
  console.log(recording);
  let sequence = setSequence();

  console.log("sequence before quantization function");
  console.log(sequence);
  console.log("sequence after quantization function");

  sequence = mm.sequences.quantizeNoteSequence(sequence, 4);
  console.log(sequence)

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

    let qns = mm.sequences.quantizeNoteSequence(sequence, 4);
    let total_quantized_steps = 0;
    //get the correct number of quantized steps by finding the ending of the last note in qns.notes
    for (let i = 0; i < qns.notes.length; i++) {
      if (total_quantized_steps < qns.notes[i].quantizedEndStep) {
        total_quantized_steps = qns.notes[i].quantizedEndStep;
      }
    }

    qns.totalQuantizedSteps = total_quantized_steps;

    music_rnn
      .continueSequence(qns, 20, 1.5)
      .then(async (sample) => {

        //get all notes from sample with the expected instrument into ml_sequence
        let ml_sequence = sample.notes;
        for (let i = 0; i < ml_sequence.length; i++) {
          ml_sequence[i].program = instrument;
        }

        //will return a new note array with the notes in recording followed by the notes in ml_sequence with the correct timing
        let joined_note_sequence = join_sequences([qns.notes, ml_sequence]);
        console.log("joined_note_sequence:");
        console.log(joined_note_sequence);


        //successfully plays the recorded notes followed by the model genarated notes but has the wrong timing for the recorded notes
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

    let qns = mm.sequences.quantizeNoteSequence(sequence, 4);
    let total_quantized_steps = 0;
    console.log("total_quantized_steps:" + total_quantized_steps);
    //get the correct number of quantized steps by finding the ending of the last note in qns.notes
    for (let i = 0; i < sequence.notes.length; i++) {
      if (total_quantized_steps < sequence.notes[i].quantizedEndStep) {
        total_quantized_steps = sequence.notes[i].quantizedEndStep;
      }
    }

    console.log("qns:");
    console.log(qns);
    /*
    {
      notes: joined_note_sequence.sequence,
      quantizationInfo: {stepsPerQuarter: 4},
      teompo: [{time: 0, qpm: 120}],
      totalQuantizedSteps:joined_note_sequence.length
    }
    */
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
  console.log("note_sequences from within join_sequences:");
  console.log(note_sequences);
  let sequences = note_sequences;
  let joined_sequence = [];
  let offset = 0;
  for (let i = 0; i < sequences.length; i++) {
    //find the last notes end time for the current sequence and set that to be the starting note of the next sequence
    let max = 0;
    for (let j = 0; j < sequences[i].length; j++) {

      //update start and end time for this note to reflect offset
      sequences[i][j].quantizedStartStep = sequences[i][j].quantizedStartStep + offset;
      sequences[i][j].quantizedEndStep = sequences[i][j].quantizedEndStep + offset;


      //update max if this endtime is the greatest seen so far
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