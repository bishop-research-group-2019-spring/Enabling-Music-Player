// let OCTAVES = 7;
// const player = new Player();

/*
 * A separate approach than Piano Genie with a library full
 * of instruments here: https://surikov.github.io/webaudiofontdata/sound/
 */
// Initialize WebAudioFont Player
var instr = null;
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContextFunc();
var player = new WebAudioFontPlayer();

// Load default tone - here is a random piano file from the site's index
player.loader.decodeAfterLoading(audioContext, "0011_FluidR3_GM_sf2_file");

// Set decoded tone variable as our current tone
var currentTone = _tone_0011_FluidR3_GM_sf2_file;

// Change instrument tone with preloaded url path
function changeInstrument(path, name) {
  player.loader.startLoad(audioContext, path, name);
  player.loader.waitLoad(function() {
    instr = window[name];
  });
  player.loader.decodeAfterLoading(audioContext, name);
  currentTone = instr;
}

// Pass the tone and pitch to the queueWaveTable which has
// the following parameters:
// (audioContext, target, preset, when, pitch, duration, volume, slides)
function play(tone, pitch) {
  player.queueWaveTable(
    audioContext,
    audioContext.destination,
    tone,
    0,
    pitch,
    1
  );
  return false;
}

//link for original magenta based: https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus

//to play note use 'player.playNoteDown(pitch) where pitch is an int

//bind keyboard notes to clicking of large buttons on web page
$("#top-left-button").click(() => {
  play(currentTone, 44);
  // player.playNoteDown(100);
});

$("#top-right-button").click(() => {
  play(currentTone, 55);
  // player.playNoteDown(102);
});

$("#bottom-left-button").click(() => {
  play(currentTone, 66);
  // player.playNoteDown(90)
});

$("#bottom-right-button").click(() => {
  play(currentTone, 77);
  // player.playNoteDown(95);
});

//bind notes to pressing of keys (S,D,X,C)
$(document).keydown(e => {
  console.log("code of button press:");
  console.log(e.which);

  switch (e.which) {
    case 83: //S
      play(currentTone, 44);
      // player.playNoteDown(100);
      break;

    case 68: //D
      play(currentTone, 55);
      // player.playNoteDown(102);
      break;

    case 88: //X
      play(currentTone, 66);
      // player.playNoteDown(90);
      break;

    case 67: //C
      play(currentTone, 77);
      // player.playNoteDown(95);
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
    changeInstrument(
      "https://surikov.github.io/webaudiofontdata/sound/0290_Aspirin_sf2_file.js",
      "_tone_0290_Aspirin_sf2_file"
    );
  } else if ($("#guitar").hasClass("active")) {
    changeInstrument(
      "https://surikov.github.io/webaudiofontdata/sound/0011_FluidR3_GM_sf2_file.js",
      "_tone_0011_FluidR3_GM_sf2_file"
    );
  }
}