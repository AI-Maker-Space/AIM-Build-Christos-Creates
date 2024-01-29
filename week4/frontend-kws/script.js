// Check for SpeechRecognition API support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
    console.error("Your browser does not support Speech Recognition.");
}

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = navigator.language || 'en-US';

// At the beginning of the script
const specialWords = ["action", "terminate"];
const specialButtons = {
    "action": document.getElementById('actionButton'),
    "terminate": document.getElementById('terminateButton')
};

// Define the initial state of the JSON data
let jsonData = {
    "action_state": false,
    "messages": []
};

// This function will be called every time the jsonData object is updated.
function updateJsonOutput() {
    const jsonOutputElement = document.getElementById('jsonOutput');
    if (jsonOutputElement) {
        jsonOutputElement.value = JSON.stringify(jsonData, null, 2);
        console.log("JSON data updated");
    } else {
        console.error("Could not find the JSON output element.");
    }
}

// Example of how you might update jsonData and refresh the display
function appendMessageToJSON(message, processed = "") {
    jsonData.messages.push({ message, processed });
    jsonData.action_state = true; // or some logic to determine the state
    updateJsonOutput();
}

// Call this function to initialize the text box
updateJsonOutput();

document.addEventListener('DOMContentLoaded', function() {
    const actionButton = document.getElementById('actionButton');
    const terminateButton = document.getElementById('terminateButton');
    if (!actionButton || !terminateButton) {
        console.error("Buttons not found");
        return;
    }
    const startButton = document.getElementById('startButton');
    const shhButton = document.getElementById('shhButton'); // Get the SHH button
    const voiceDropdown = document.getElementById('voiceSelection');
    const settingsButton = document.getElementById('settings');
    const settings_pannel = document.getElementById('settings_pannel');
    const response = document.getElementById('response');
    const output = document.getElementById('output');
    let recognizing = false;

    let start_ih = "<i class='fas fa-microphone'></i> PLAY";
    let stop_ih =  "<i class='fas fa-microphone'></i> Stop";

    // update function calls speechSynthesis.speaking to render shh button
    setInterval(function() {
        if (audio.pause) {
            shhButton.style.display = "block";
            shhButton.innerHTML = "<i class='fas fa-volume-up'></i> SHH";
        } else {
            shhButton.style.display = "none";
        }

        // Check if the recognition is running if so add pulsing to startButton
        if (recognizing) {
            startButton.classList.add("pulsing");
            startButton.innerHTML = stop_ih;
        } else {
            startButton.classList.remove("pulsing");
            startButton.innerHTML = start_ih;
        }

    }, 100);

    recognition.onstart = function() {
        recognizing = true;
        output.innerHTML ="";
        response.innerHTML = "";
    };

    recognition.onerror = function(event) {
        console.log(event);
        console.error("Speech recognition error detected: " + event.error);
    };

    recognition.onend = function() {
        recognizing = false;
        console.log("Speech recognition ended.");
    };

    let isRecording = false;

    recognition.onresult = function(event) {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                const transcript = event.results[i][0].transcript.trim().toLowerCase();
                const words = transcript.split(/\s+/); // Split the transcript into words
    
                for (let word of words) {
                    if (word === "action") {
                        if (!isRecording) {
                            // Start recording
                            isRecording = true;
                            jsonData.action_state = true;
                            recordedMessage = ""; // Reset the recorded message
                            pulseButton('action'); // Pulse the action button
                            console.log("Recording started"); // For debugging
                        }
                        continue; // Skip adding the word "action" to both recorded message and onscreen text
                    } else if (word === "terminate") {
                        if (isRecording) {
                            // Stop recording and update JSON
                            isRecording = false;
                            jsonData.action_state = false;
                            jsonData.messages.push({
                                "message": recordedMessage.trim(),
                                "processed": ""
                            });
                            updateJsonOutput();
                            pulseButton('terminate'); // Pulse the terminate button
                            console.log("Recording stopped and data updated"); // For debugging
                            recordedMessage = ""; // Reset for next recording
                        }
                        continue; // Skip adding the word "terminate" to both recorded message and onscreen text
                    } else if (isRecording) {
                        // Concatenate words to form the message
                        recordedMessage += word + " ";
                    }
                }
                // Update the display of the final transcript, excluding 'action' and 'terminate'
                if (!isRecording) {
                    output.innerHTML += transcript.replace(/\b(action|terminate)\b/g, '') + ' ';
                }
            }
        }
    };
    
    // Function to add pulsing effect to buttons when special words are detected
    function pulseButton(word) {
        const button = specialButtons[word];
        if (button) {
            button.classList.add("pulsing");
            setTimeout(() => {
                button.classList.remove("pulsing");
            }, 1000); // The duration for pulsing effect can be adjusted
        }
    }

    var audio = '';

    function sendToServer(transcript) {
        fetch('http://localhost:8000/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: transcript })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data.response);
            // Speak out the response here
            typeWriter(data.response, 0);
            const audio_uri = "data:audio/wav;base64,"+data.audio;
            audio = new Audio(audio_uri);
            audio.play();

            // speakText(data.response);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // Function to populate voice options
    function populateVoiceList() {
        availableVoices = speechSynthesis.getVoices();
        if(availableVoices.length == 0){
            return;
        }
        voiceDropdown.innerHTML = '';
    
        availableVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = voice.name + ' (' + voice.lang + ')';
            
            if(voice.default) {
                option.textContent += ' -- DEFAULT';
            }

            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            option.value = index;
            voiceDropdown.appendChild(option);
        });
    }

    // Initialize voice list or handle changes
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // Speech Synthesis
    function speakText(text) {
        if (text !== '' && availableVoices.length > 0) {
            const selectedVoiceIndex = voiceDropdown.selectedOptions[0].value;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = availableVoices[selectedVoiceIndex];
            speechSynthesis.speak(utterance);
        }
    }

    startButton.addEventListener('click', function() {
        if (recognizing) {
            recognition.stop();
            recognizing = false;
            return;
        }
        
        recognition.start();
    }, false);

    shhButton.addEventListener('click', function() {
        stopSpeaking();
    }, false);

    // Function to stop speaking
    function stopSpeaking() {
        if (audio.pause) {
            audio.pause();
        }
    }

    function toggleElement(element) {
        element.style.display = (element.style.display === "none" || element.style.display === "") ? "block" : "none";
    }
    settingsButton.addEventListener('click', function() {
        toggleElement(settings_pannel);
    }, false);

    function typeWriter(text, index) {
        const intervalId = setInterval(() => {
            response.innerHTML += text.charAt(index);
            index++;
            if (index === text.length) {
                clearInterval(intervalId);
            }
        }, Math.abs(response.innerHTML.length - index));
    }

    // Event listener for actionButton
    actionButton.addEventListener('click', function() {
        console.log("Action button clicked"); // Debugging log
        jsonData.action_state = true;
        jsonData.messages.push({
            "message": "Sample message",
            "processed": ""
        });
        updateJsonOutput();
    });

    // Event listener for terminateButton
    terminateButton.addEventListener('click', function() {
        console.log("Terminate button clicked"); // Debugging log
        jsonData.action_state = false;
        updateJsonOutput();
    });
    
    });