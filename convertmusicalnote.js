document.addEventListener("DOMContentLoaded", function() {
    setupCanvas();
    addEventListeners();
});

const notes = [
    { name: "C", enharmonic: "B#" },
    { name: "C#", enharmonic: "Db" },
    { name: "D", enharmonic: null },
    { name: "D#", enharmonic: "Eb" },
    { name: "E", enharmonic: "Fb" },
    { name: "F", enharmonic: "E#" },
    { name: "F#", enharmonic: "Gb" },
    { name: "G", enharmonic: null },
    { name: "G#", enharmonic: "Ab" },
    { name: "A", enharmonic: null },
    { name: "A#", enharmonic: "Bb" },
    { name: "B", enharmonic: "Cb" }
];

let audioContext;
let oscillator;
let canvas, ctx;

function setupCanvas() {
    canvas = document.getElementById("sineCanvas");
    if (canvas) {
        ctx = canvas.getContext("2d");
        clearCanvas();
    } else {
        console.error("Canvas element not found!");
    }
}

function addEventListeners() {
    const submitBtn = document.getElementById("submithertz");
    const playBtn = document.getElementById("play-entered");
    const resetBtn = document.getElementById("addnew");

    submitBtn.addEventListener("click", function(event) {
        event.preventDefault();  // Prevent any form submission behavior
        initiateAudioContext();  // Ensure AudioContext is ready
        const noteResult = frequencyToNote();
        updateDisplay(noteResult);
    });

    playBtn.addEventListener("click", function() {
        initiateAudioContext();  // Ensure AudioContext is ready before playing
        playNote();
    });

    resetBtn.addEventListener("click", resetDisplay);
}

function initiateAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}
function frequencyToNote() {
    const inputElement = document.getElementById("userhertz");
    if (!inputElement) {
        console.error("Input element 'userhertz' not found.");
        return "Input element not found.";
    }

    const input = parseFloat(inputElement.value);
    if (isNaN(input) || input === 0) {
        return "Enter a numerical value for frequency";
    }

    if (input < 27.5 || input > 14080) {
        return "Enter a frequency in the range 27.5Hz (A0) and 14080Hz (A9)";
    }

    const A4 = 440.0;
    const A4_INDEX = 48;
    let numHalfSteps = 12 * Math.log2(input / A4);
    let noteIndex = Math.round(numHalfSteps) + A4_INDEX;
    let centsDifference = Math.round((numHalfSteps - Math.round(numHalfSteps)) * 100);
    let octave = Math.floor(noteIndex / 12);
    let noteObj = notes[noteIndex % 12];
    let result = noteObj.name + octave;

    if (centsDifference > 0) {
        result += " plus " + centsDifference + " cents";
    } else if (centsDifference < 0) {
        result += " minus " + Math.abs(centsDifference) + " cents";
    }

    return result;
}
function playNote() {
    const inputElement = document.getElementById("userhertz");
    if (!inputElement) {
        console.error("The input element was not found.");
        return; // Exit the function if input element is not found
    }

    const frequency = parseFloat(inputElement.value);
    if (!isNaN(frequency) && frequency > 0) {
        playSineWave(frequency);
        document.getElementById("what-isplaying").innerHTML = "Now playing: " + frequency.toFixed(2) + " Hz";
    } else {
        document.getElementById("what-isplaying").innerHTML = "<span class='error'>Invalid frequency. Please enter a valid frequency to play.</span>";
    }
}

function setupCanvas() {
    canvas = document.getElementById("sineCanvas");
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    ctx = canvas.getContext("2d");
    clearCanvas();
}

function clearCanvas() {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        console.error("Canvas context not available.");
    }
}

function drawSineWave(frequency) {
    if (!ctx) {
        console.error("Canvas context is not initialized for drawing.");
        return;
    }
    clearCanvas();  // Clear the canvas before drawing a new wave

    const amplitude = 40;  // Max height of wave from center
    const wavelength = canvas.width / frequency;  // Calculate wavelength based on frequency

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);  // Start from the middle of the canvas
    for (let x = 0; x < canvas.width; x++) {
        let y = canvas.height / 2 + amplitude * Math.sin((2 * Math.PI * x) / wavelength);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function playSineWave(frequency) {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.onended = () => {
        document.getElementById("what-isplaying").innerHTML = "";
        clearCanvas();
    };
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 10); // Play for 1 second

    drawSineWave(frequency);  // Call draw function with the current frequency
}

function resetDisplay() {
    const inputElement = document.getElementById("userhertz");
    if (inputElement) {
        inputElement.value = "";
    } else {
        console.error("Userhertz input element not found for reset.");
    }
    document.getElementById("what-isplaying").innerHTML = "";
    clearCanvas();
}



function updateDisplay(noteResult) {
    const noteDisplay = document.getElementById("hertz-to-note");
    const playingDisplay = document.getElementById("what-isplaying");

    if (noteDisplay && playingDisplay) {
        noteDisplay.innerHTML = `<span class="note-text">${noteResult}</span>`;
        playingDisplay.innerHTML = "The entered note is: " + noteResult;
    } else {
        console.error("Display elements not found.");
    }
}
