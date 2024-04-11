document.getElementById('instrument-picker-initialize').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('list-of-instruments');
    
    if (dropdownMenu.classList.contains('hidden')) {
      dropdownMenu.classList.remove('hidden');
      dropdownMenu.classList.add('show');
    } else {
      dropdownMenu.classList.remove('show');
      dropdownMenu.classList.add('hidden');
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Select the dropdown menu by its ID
    var selectInstrument = document.getElementById('select-instrument');
    
    // Add a change event listener to the dropdown menu
    selectInstrument.addEventListener('change', function() {
        // Get the selected option value
        var selectedInstrument = this.value;
        
        // Prepare a message based on the selected instrument
        var message = 'You selected: ' + selectedInstrument + '!';
        
        // Select the element where you want to display the message
        var messageElement = document.getElementById('select-instrument-message');
        
        // Set the message to display
        messageElement.textContent = message;
    });
});