document.addEventListener('DOMContentLoaded', function() {
    let audioContext;

    document.getElementById('playAllButton').addEventListener('click', function() {
        playNotes();
    });

    document.getElementById('stopButton').addEventListener('click', function() {
        stopAllAudio();
    });

    document.getElementById('clearNotes').addEventListener('click', function() {
        clearInputs();
    });

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

    function noteToNumber(note) {
        const notes = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'Fb': 4, 'E#': 5, 'F': 5, 'F#': 6, 'Gb': 6,
            'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11, 'Cb': 11, 'B#': 0
        };
        note = note.toUpperCase();
        const noteBase = note.slice(0, -1);
        const octave = parseInt(note.slice(-1), 10);
        return notes[noteBase] + (octave * 12);
    }

    function noteToFrequency(note) {
        const A0 = 27.5;
        const number = noteToNumber(note);
        return A0 * Math.pow(2, number / 12);
    }

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
    }

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
            
        } catch (error) {
            console.error("Error: " + error.message);
            alert("Error: " + error.message); // Optionally alert the user
        }
    }

    function stopAllAudio() {
        if (audioContext) {
            audioContext.close().then(() => {
                audioContext = null;
                console.log("Audio stopped and context closed.");
            });
        }
    }

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

document.getElementById('playAllButton').addEventListener('click', function() {
   const dropdownMenu = document.getElementById('what-isplaying');
    
 if (dropdownMenu.classList.contains('hidden')) {
       dropdownMenu.classList.remove('hidden');
   } else {
        dropdownMenu.classList.add('hidden');
        return;
  }
});