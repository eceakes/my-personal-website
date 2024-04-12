let audioContext;
let oscillator;
let canvas, ctx;

document.addEventListener("DOMContentLoaded", function() {
    setupCanvas();
    addEventListeners();
});

function frequencyToNote() {
    const input = parseFloat(document.getElementById("userhertz").value);
    if (isNaN(input) || input === 0) {
        return "Enter a numerical value for frequency";
    }

    if (input < 27.5 || input > 14080) {
        return "Enter a frequency in the range 27.5Hz (A0) and 14080Hz (A9)";
    }

    const A4 = 440.0;
    const A4_INDEX = 49; // Corrected index for A4 if starting from C0
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    let numHalfSteps = 12 * Math.log2(input / A4);
    let noteIndex = Math.round(numHalfSteps) + A4_INDEX;
    let centsDifference = Math.round((numHalfSteps - Math.round(numHalfSteps)) * 100);
    let octave = Math.floor(noteIndex / 12); // Corrected octave calculation
    let note = notes[noteIndex % 12];
    let result = note + octave;

    if (centsDifference > 0) {
        result += " plus " + centsDifference + " cents";
    } else if (centsDifference < 0) {
        result += " minus " + Math.abs(centsDifference) + " cents";
    }

    return result;
}

function addEventListeners() {
    document.getElementById("submithertz").addEventListener("click", function() {
        let noteResult = frequencyToNote();
        document.getElementById("hertz-to-note").innerHTML = `<font face="Geneva, Arial, Helvetica, sans-serif">${noteResult}</font>`;
        document.getElementById("what-isplaying").innerHTML = "The entered note is: " + noteResult;
    });
    document.getElementById("play-entered").addEventListener("click", playNote);
    document.getElementById("addnew").addEventListener("click", resetDisplay);
}

function playNote() {
    const inputElement = document.getElementById("userhertz");
    if (!inputElement) {
        console.error("The input element was not found.");
        return; // Exit the function if input element is not found
    }

    const frequency = parseFloat(inputElement.value);
    const noteResult = frequencyToNote();  // This should only be called if the frequency is valid
    if (!isNaN(frequency) && frequency > 0) {
        playSineWave(frequency);
        document.getElementById("what-isplaying").innerHTML = "Now playing: " + noteResult + " (" + frequency.toFixed(2) + " Hz)";
        drawSineWave(frequency);
    } else {
        document.getElementById("what-isplaying").innerHTML = "<font color=\"red\">Invalid frequency. Please enter a valid frequency to play.</font>";
    }
}

function playSineWave(frequency) {
    if (!audioContext) {
        audioContext = new AudioContext();
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
    oscillator.stop(audioContext.currentTime + 1);
}

function setupCanvas() {
    canvas = document.getElementById("sineCanvas");
    ctx = canvas.getContext("2d");
    clearCanvas();
}

function drawSineWave(frequency) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    let x = 0;
    let y = canvas.height / 2;
    const amplitude = 40;
    const frequencyScale = 20;
    for (let i = 0; i < canvas.width; i++) {
        x = i;
        y = canvas.height / 2 + amplitude * Math.sin((i / frequencyScale) * frequency * 0.01);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetDisplay() {
    // Reset input value and clear display areas without rewriting HTML
    document.getElementById("userhertz").value = ""; // Clears the input for new frequency input.
    document.getElementById("what-isplaying").innerHTML = ""; // Clears any text in the 'what-isplaying' div.
    clearCanvas(); // Clears the drawing canvas for a fresh start.
}