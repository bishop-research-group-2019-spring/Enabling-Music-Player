// Middle C is the pitch 60 -- full mapping of pitch values to notes 
// can be found here: http://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies.
//
// Library of magenta models w/ associated urls (which are given as argument to mm function) 
// found here: http://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies

// Used to hold the 4 pitches currently being played
var pitches = [];

var recording = [];
var is_recording = false;
var info_recording = false;
var is_drum = true;
note_count = 0;
var key_down = false;
var two_button_mode = false;
var sound_on = false;
var play_note_called = false;
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
  if (sound_on) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    var read_text = $.trim($(".game").text().replace(/[\s+\t]+/g, ' '));
    var message = new SpeechSynthesisUtterance(read_text);
    window.speechSynthesis.speak(message);
  }
});

// Button listeners
$("#top-left-button").click(() => {
  if (sound_on) {
    speak("S");
    setTimeout(function () {
      playNote(0);
    }, 500);
  } else {
    playNote(0);
  }
});

$("#top-right-button").click(() => {
  if (sound_on) {
    speak("D");
    setTimeout(function () {
      playNote(1);
    }, 500);
  } else {
    playNote(1);
  }
});

$("#bottom-right-button").click(() => {
  if (sound_on) {
    speak("C");
    setTimeout(function () {
      playNote(2);
    }, 500);
  } else {
    playNote(2);
  }
});

$("#bottom-left-button").click(() => {
  if (sound_on) {
    speak("X");
    setTimeout(function () {
      playNote(3);
    }, 500);
  } else {
    playNote(3);
  }
});

// Two Button Mode
$("#left-button").click(() => {
  if (sound_on) {
    speak("S");
    setTimeout(function () {
      playNote(0);
    }, 500);
  } else {
    playNote(0);
  }
});

$("#right-button").click(() => {
  if (sound_on) {
    speak("D");
    setTimeout(function () {
      playNote(1);
    }, 500);
  } else {
    playNote(1);
  }
});

$("#bottom-button").click(() => {
  speak("Z (shuffle)");
  shufflePitches();
})

$("#two-bottom-button").click(() => {
  speak("Z (shuffle)");
  shufflePitches();
})

$(document).keydown(e => {
  switch (e.which) {
    case 83: //S
      if (!key_down) {
        key_down = true;
        if (sound_on) {
          speak("S");
          setTimeout(function () {
            playNote(0);
          }, 500);
        } else {
          playNote(0);
        }
      }
      break;

    case 68: //D
      if (!key_down) {
        key_down = true;
        if (sound_on) {
          speak("D");
          setTimeout(function () {
            playNote(1);
          }, 500);
        } else {
          playNote(1);
        }
      }
      break;

    case 88: //X
      if (two_button_mode) {
        break;
      }
      if (!key_down) {
        key_down = true;
        if (sound_on) {
          speak("X");
          setTimeout(function () {
            playNote(2);
          }, 500);
        } else {
          playNote(2);
        }
      }
      break;

    case 67: //C
      if (two_button_mode) {
        break;
      }
      if (!key_down) {
        key_down = true;
        if (sound_on) {
          speak("C");
          setTimeout(function () {
            playNote(3);
          }, 500);
        } else {
          playNote(3);
        }
      }
      break;

    case 90: //Z
      speak("Z (shuffle)");
      shufflePitches();
      break;

    case 65: //A
      tabInstrument();
      break;

    case 82: //R
      checkRecording();
      break;
  }
});

// Change the instrument for clicking tabs
$('#list-tab a[href="#drums"').click(() => {
  speak("Drums");
  instrument = instruments.drums;
  is_drum = true;
});

$('#list-tab a[href="#guitar"').click(() => {
  speak("Guitar");
  instrument = instruments.guitar;
  is_drum = false;
});

$('#list-tab a[href="#bass"').click(() => {
  speak("Bass");
  instrument = instruments.bass;
  is_drum = false;
});

$('#list-tab a[href="#piano"').click(() => {
  speak("Piano");
  instrument = instruments.piano;
  is_drum = false;
});

// Toggles between the instrument list
function tabInstrument() {
  var instrumentName = '';

  if ($("#drums").hasClass("active")) {
    $('#list-tab a[href="#guitar"').tab("show");
    instrument = instruments.guitar;
    instrumentName = 'Guitar';
    is_drum = false;
  } else if ($("#guitar").hasClass("active")) {
    $('#list-tab a[href="#bass"').tab("show");
    instrument = instruments.bass;
    instrumentName = 'Bass';
    is_drum = false;
  } else if ($("#bass").hasClass("active")) {
    $('#list-tab a[href="#piano"').tab("show");
    instrument = instruments.piano;
    instrumentName = 'Piano';
    is_drum = false;
  } else if ($("#piano").hasClass("active")) {
    $('#list-tab a[href="#drums"').tab("show");
    instrument = instruments.drums;
    instrumentName = 'Drums';
    is_drum = true;
  }

  if (sound_on) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(instrumentName));
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
      pitches[i] = Math.floor(pitch_ranges.non_drums.lower + ((Math.random() * 100) % (pitch_ranges.non_drums.upper - pitch_ranges.non_drums.lower)));
    }
  }


  if (pitchesDontMatch()) {
    return;
  } else {
    shufflePitches();
  }
};

var playNote = index => {
  if (!play_note_called) {
    play_note_called = true;
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
      play_note_called = false;
    }, 330);
  }
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
  checkRecording();
});

var checkRecording = () => {
  if (!is_recording) {
    $("#record-button").css("background-color", "#dc3545");
    $("#record-button").css("color", "white");
    speak("Now recording");
    startRecording();
  } else {
    $("#record-button").css("background-color", "rgb(247,247,247)");
    $("#record-button").css("color", "#dc3545");
    speak("Stopped recording");
    stopRecording();
  }
}

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
    speak("Two Button Mode activated.");
    two_button_mode = true;
  } else {
    $("#two-button-holder").css("display", "none");
    $("#big-button-holder").css("display", "block");
    $('#switch-button').val('2 Button Mode');
    speak("Original Mode activated.");
    two_button_mode = false;
  }
});

$("#stop-button").click(() => {
  player.stop();
});

$('#soundMode').change(function () {
  if (!sound_on) {
    sound_on = true;
    var read_text;
    if ($('.overlay').css('display') != 'none') {
      read_text = $.trim($(".overlay").text().replace(/[\s+\t]+/g, ' '));
    } else {
      read_text = $.trim($(".game").text().replace(/[\s+\t]+/g, ' '));
    }
    var message = new SpeechSynthesisUtterance("Sound Mode enabled. " + read_text);
    window.speechSynthesis.speak(message);
  } else {
    sound_on = false;
    if (window.speechSynthesis.speaking) {
      // SpeechSyn is currently speaking, cancel the current utterance(s)
      window.speechSynthesis.cancel();
    }
  }

});

$("#play_button").click(() => {
  let sequence = setSequence();

  sequence = mm.sequences.quantizeNoteSequence(sequence, 4);

  mm.Player.tone.context.resume();
  if (sound_on) {
    speak("Play.")
    setTimeout(function () {
      player.start(sequence);
    }, 1000);
  } else {
    player.start(sequence);
  }
});

$("#play-magenta").click(() => {
  speak("Play with Magenta.");
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

        if (sound_on) {
          setTimeout(function () {
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
          }, 500);
        } else {
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
        }
      });

  }
});

// Converts the recorded sequence to a midi file.
$("#download-button").click(() => {
  if (recording.length == 0) {
    speak("Download.")
  } else {
    speak("Now downloading.");
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

var speak = (text) => {
  if (sound_on) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    var read_text = $.trim(text.replace(/[\s+\t]+/g, ' '));
    var message = new SpeechSynthesisUtterance(read_text);
    window.speechSynthesis.speak(message);
  }
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