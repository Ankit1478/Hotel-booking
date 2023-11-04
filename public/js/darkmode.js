// Import the Darkmode library
import Darkmode from 'darkmode-js';

// Define Darkmode options
const options = {
  bottom: '64px',
  right: 'unset',
  left: '32px',
  time: '0.5s',
  mixColor: '#fff',
  backgroundColor: '#fff',
  buttonColorDark: '#100f2c',
  buttonColorLight: '#fff',
  saveInCookies: false,
  label: '🌓',
  autoMatchOsTheme: true,
};

// Create an instance of Darkmode with options
const darkmode = new Darkmode(options);

// Show the Darkmode widget
darkmode.showWidget();

// Get a reference to the switch input element
const darkSwitch = document.getElementById("flexSwitchCheckDefault");

// Function to enable dark mode
function enableDarkMode() {
  darkmode.toggle();
}

// Toggle dark mode when the switch is clicked
darkSwitch.addEventListener("click", () => {
  enableDarkMode();
});
