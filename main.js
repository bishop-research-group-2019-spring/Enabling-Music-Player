let OCTAVES = 7;
const player = new Player();

//link for original magenta based: https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus

//to play note use 'player.playNoteDown(pitch) where pitch is an int

$("#top-left-button").click(() => {
    player.playNoteDown(100);
})

$("#top-right-button").click(() => {
    player.playNoteDown(102);
})

$("#bottom-left-button").click(() => {
    player.playNoteDown(90)
}) 

$("#bottom-right-button").click(() => {
    player.playNoteDown(96);
})