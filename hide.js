document.getElementById('playAllButton').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('playAllButton');
    
    if (dropdownMenu.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
      dropdownMenu.classList.add('hidden');
    } else {
      dropdownMenu.classList.remove('hidden');
      dropdownMenu.classList.add('show');
    }
  });

  document.getElementById('stopButton').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('playAllButton');
    if(dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.remove('hidden');
        dropdownMenu.classList.add('show');
    }
});

document.getElementById('clearNotes').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('playAllButton');
    if(dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.remove('hidden');
        dropdownMenu.classList.add('show');
    }
});

