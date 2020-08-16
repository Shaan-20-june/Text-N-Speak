// Init speech synth api
const synth = window.speechSynthesis;

// grab all the DOM elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const voiceSelect = document.querySelector("#voice-select");
const body = document.querySelector("body");

// Init the voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();
  voices.forEach(voice => {
    // create an option element
    const option = document.createElement("option");
    option.textContent = voice.name + '(' + voice.lang + ')';

    // Set needed attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);

    voiceSelect.appendChild(option);
  })
}

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak

const speak = () => {
  // check if speaking
  if (synth.speaking) {
    console.error("Already speaking....");
    return;
  }
  if (textInput.value !== "") {
    // Add bcg animations
    body.style.background = "#141414 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";

    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    // Speak end
    speakText.onend = e => {
      body.style.background = "#141414";
      console.log("Done speaking...");
    }

    // speak error
    speakText.onerror = e => {
      console.error("Something went wrong...");
    }

    // Select Voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");

    // loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // Speak
    synth.speak(speakText);
  }
};

// Eventlisteners
textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate pitch change
rate.addEventListener("change", e => rateValue.textContent = rate.value);
pitch.addEventListener("change", e => pitchValue.textContent = pitch.value);

// voice select change
voiceSelect.addEventListener("change", e => speak());
