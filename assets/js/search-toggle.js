// Add event listener to toggle the input field visibility
  document.getElementById('search-toggle').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission on button click
    const searchInput = document.getElementById('search-input');

    // Check if the input is currently hidden
    if (searchInput.style.display === 'none' || searchInput.style.display === '') {
      searchInput.style.display = 'block'; // Show the input field
      searchInput.focus(); // Focus on the input for immediate typing
    } else if (searchInput.value.trim() !== '') {
      // If the input is visible and has a value, submit the form
      document.getElementById('search-form').submit();
    }
  });

  // Optionally, close the input when it loses focus (click outside)
  document.addEventListener('click', function(event) {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (!searchForm.contains(event.target) && searchInput.style.display === 'block') {
      searchInput.style.display = 'none';
    }
  });

  
