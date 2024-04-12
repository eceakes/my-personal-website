document.addEventListener('DOMContentLoaded', function() {
    let audioContext;
    let frequencies = [];  // Array to store frequency data

    // Event listeners for button actions
    document.getElementById('playAllButton').addEventListener('click', function() {
        playNotes();
        toggleDropdown();
    });

    document.getElementById('stopButton').addEventListener('click', function() {
        stopAllAudio();
    });

    document.getElementById('clearNotes').addEventListener('click', function() {
        clearInputs();
    });

    // Toggle dropdown visibility and update content
    function toggleDropdown() {
        const dropdownMenu = document.getElementById('what-isplaying');
        
        if (dropdownMenu.classList.contains('hidden')) {
            dropdownMenu.classList.remove('hidden');
            dropdownMenu.classList.add('show');
        } else {
            dropdownMenu.classList.add('hidden');
            dropdownMenu.classList.remove('show');
            return;  // Stop further execution if the menu is meant to be hidden
        }
        
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.innerHTML = '';  // Clear previous content
            const content = document.createElement('p');
            content.textContent = getFormattedFrequencies(frequencies);  // Update with current frequencies
            dropdownMenu.appendChild(content);
        }
    }

    // Formats the frequencies for display
    function getFormattedFrequencies(frequencies) {
        return `Playing notes: ${frequencies.map(f => `${f.frequency.toFixed(3)} Hz at volume ${f.volume}`).join(', ')}`;
    }

    // Initializes the AudioContext
    function initializeAudioContext() {
        if (!audioContext) {
            audioContext = new AudioContext();
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('AudioContext successfully resumed');
                }).catch((error) => {
                    console.error('Error resuming AudioContext:', error);
                });
            }
        }
    }

    // Plays notes based on user inputs
    function playNotes() {
        try {
            initializeAudioContext();
            const notes = [
                { input: document.getElementById('noteInput1'), volume: document.getElementById('volume1') },
                { input: document.getElementById('noteInput2'), volume: document.getElementById('volume2') },
                { input: document.getElementById('noteInput3'), volume: document.getElementById('volume3') },
                { input: document.getElementById('noteInput4'), volume: document.getElementById('volume4') }
            ].filter(n => n.input.value); // Filter out empty inputs

            if (notes.length === 0) {
                console.error("No notes entered");
                return;
            }

            const intonationSystem = document.getElementById('intonationSystem').value;
            const sortedNotes = notes.sort((a, b) => noteToNumber(a.input.value) - noteToNumber(b.input.value));
            const baseNote = sortedNotes[0].input.value;

            frequencies = sortedNotes.map(note => {
                return {
                    frequency: intonationSystem === 'just' ? calculateJustIntonationFrequency(baseNote, note.input.value) : noteToFrequency(note.input.value),
                    volume: parseFloat(note.volume.value)
                };
            });

            // Play the notes
            playFrequencies(frequencies);
        } catch (error) {
            console.error("Error: " + error.message);
            alert("Error: " + error.message); // Optionally alert the user
        }
    }

    function playFrequencies(frequencies) {
        frequencies.forEach(({ frequency, volume }) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            gainNode.gain.value = volume;

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();

            setTimeout(() => oscillator.stop(), 30000); // Play for 30 seconds
        });

        console.log(getFormattedFrequencies(frequencies));
    }

    // Stops all audio playback and closes the audio context
    function stopAllAudio() {
        if (audioContext) {
            audioContext.close().then(() => {
                audioContext = null;
                console.log("Audio stopped and context closed.");
            });
        }
    }

    // Clears all input fields for notes and volumes
    function clearInputs() {
        document.getElementById('noteInput1').value = '';
        document.getElementById('noteInput2').value = '';
        document.getElementById('noteInput3').value = '';
        document.getElementById('noteInput4').value = '';
        document.getElementById('volume1').value = 0.5;
        document.getElementById('volume2').value = 0.5;
        document.getElementById('volume3').value = 0.5;
        document.getElementById('volume4').value = 0.5;
    }
});

    // Converts note strings to a numerical value representing their frequency
    function noteToNumber(note) {
        const notes = {
            'C': 0, 'C#': 1, 'DB': 1, 'D': 2, 'D#': 3, 'EB': 3, 'E': 4, 'FB': 4, 'E#': 5, 'F': 5, 'F#': 6, 'GB': 6,
            'G': 7, 'G#': 8, 'AB': 8, 'A': 9, 'A#': 10, 'BB': 10, 'B': 11, 'CB': 11, 'B#': 0
        };
        note = note.toUpperCase();  // Convert to uppercase to ensure matching
        const noteBase = note.slice(0, -1);
        const octave = parseInt(note.slice(-1), 10);
        if (isNaN(octave) || !notes.hasOwnProperty(noteBase)) {
            throw new Error("Invalid note format. Please enter notes like C#4, Bb3, etc.");
        }
        return notes[noteBase] + (octave * 12);
    };

    // Converts a musical note to its frequency
    function noteToFrequency(note) {
        const C0 = 16.352;  // Frequency of C0
        const number = noteToNumber(note);
        return (C0 * Math.pow(2, number / 12).toFixed(3));
    };

    // Calculates frequency using just intonation
    function calculateJustIntonationFrequency(baseNote, note) {
        const baseNumber = noteToNumber(baseNote);
        const targetNumber = noteToNumber(note);
        const interval = targetNumber - baseNumber;
        const baseFrequency = noteToFrequency(baseNote);
        const ratios = {
            0: 1, 1: 16/15, 2: 9/8, 3: 6/5, 4: 5/4, 5: 4/3, 6: 45/32, 7: 3/2, 8: 8/5, 9: 5/3, 10: 9/5, 11: 15/8, 12: 2
        };
        let octaveOffset = Math.floor(interval / 12);
        let justRatio = ratios[Math.abs(interval % 12)];
        return baseFrequency * justRatio * Math.pow(2, octaveOffset);
    };

    // Plays notes based on user inputs
    let oscillators = []; // Global array to manage oscillators

function playNotes() {
    try {
        initializeAudioContext();
        const notes = [
            { input: document.getElementById('noteInput1'), volume: document.getElementById('volume1') },
            { input: document.getElementById('noteInput2'), volume: document.getElementById('volume2') },
            { input: document.getElementById('noteInput3'), volume: document.getElementById('volume3') },
            { input: document.getElementById('noteInput4'), volume: document.getElementById('volume4') }
        ].filter(n => n.input.value); // Filter out empty inputs

        if (notes.length === 0) {
            console.error("No notes entered");
            return;
        }

        const intonationSystem = document.getElementById('intonationSystem').value;
        const sortedNotes = notes.sort((a, b) => noteToNumber(a.input.value) - noteToNumber(b.input.value));
        const baseNote = sortedNotes[0].input.value;

        frequencies = sortedNotes.map(note => {
            return {
                frequency: intonationSystem === 'just' ? calculateJustIntonationFrequency(baseNote, note.input.value) : noteToFrequency(note.input.value),
                volume: parseFloat(note.volume.value)
            };
        });

        // Stop and clear previous oscillators before starting new ones
        stopOscillators();

        frequencies.forEach(({ frequency, volume }) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            gainNode.gain.value = volume;

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();

            // Add oscillator to global array
            oscillators.push(oscillator);

            // Set timeout to stop oscillator after 30 seconds
            setTimeout(() => {
                oscillator.stop();
                oscillators = oscillators.filter(osc => osc !== oscillator); // Remove from array after stopping
            }, 30000);
        });

        console.log(getFormattedFrequencies(frequencies));
    } catch (error) {
        console.error("Error: " + error.message);
        alert("Error: " + error.message); // Optionally alert the user
    }
};

function stopOscillators() {
    oscillators.forEach(osc => osc.stop()); // Stop each oscillator
    oscillators = []; // Clear the array
}

    // Stops all audio playback and closes the audio context
    function stopAllAudio() {
        if (audioContext) {
            audioContext.close().then(() => {
                audioContext = null;  // Set the outer scope's audioContext to null
                console.log("Audio stopped and context closed.");
                console.log(audioContext); // This will correctly log 'null'
            });
        }
    }
