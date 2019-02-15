let OCTAVES = 7;
const player = new Player();

//link for original magenta based: https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus

//to play note use 'player.playNoteDown(pitch) where pitch is an int

//bind keyboard notes to clicking of large buttons on web page
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
    player.playNoteDown(95);
})


//bind notes to pressing of keys (S,D,X,C)
$(document).keydown((e) => {
    console.log("code of button press:");
    console.log(e.which);

    switch(e.which){
        case 83: //S
            player.playNoteDown(100);
        break;

        case 68: //D
            player.playNoteDown(102);
        break;

        case 88: //X
            player.playNoteDown(90);
        break;

        case 67: //C
            player.playNoteDown(95);
        break;
    }
})