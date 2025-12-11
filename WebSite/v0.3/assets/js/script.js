// --- Game Data (Our "Database") ---
const gamesData = [
    {
        title: "Tiny Castle",
        description: "A strategy game where you build and defend your own tiny castle.",
        image: "tile_0114.png",
        fileSize: "17MB",
        downloadLink: "https://modsfire.com/1DkAxIjh1tfl621",
        tags: ["strategy", "building", "medieval"]
    },
    {
        title: "Game Title 2",
        description: "Description of Game Title 2.",
        image: "placeholder-image2.jpg",
        fileSize: "150MB",
        downloadLink: "game2.exe",
        tags: ["action", "adventure"]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('dark-mode-checkbox');
    const body = document.body;

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    });

    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            let isValid = true;
            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('name-error');
            if (nameInput.value.trim() === '') {
                nameError.textContent = 'Name is required.';
                nameInput.classList.add('invalid');
                isValid = false;
            } else {
                nameError.textContent = '';
                nameInput.classList.remove('invalid');
            }

            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailError.textContent = 'Please enter a valid email address.';
                 emailInput.classList.add('invalid');
                isValid = false;
            } else {
                emailError.textContent = '';
                 emailInput.classList.remove('invalid');
            }

            const messageInput = document.getElementById('message');
            const messageError = document.getElementById('message-error');
            if (messageInput.value.trim() === '') {
                messageError.textContent = 'Message is required.';
                 messageInput.classList.add('invalid');
                isValid = false;
            } else {
                messageError.textContent = '';
                 messageInput.classList.remove('invalid');
            }
            if (!isValid) {
                event.preventDefault();
            }
        });
    }

    // --- Search Functionality ---

    // On index.html:
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `search-results.html?search=${encodeURIComponent(query)}`;
        }
    }

    // On search-results.html:
    if (window.location.pathname.includes('search-results.html')) {
        displaySearchResults();
    }

    function displaySearchResults() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        const resultsContainer = document.getElementById('results-container');

        if (searchQuery) {
            const results = searchGames(searchQuery);

            if (results.length > 0) {
                results.forEach(game => {
                    const gameElement = createGameResultElement(game);
                    resultsContainer.appendChild(gameElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>No games found matching your search.</p>';
            }
        } else {
            resultsContainer.innerHTML = '<p>No search query provided.</p>';
        }
    }

    // Improved search function
    function searchGames(query) {
        const lowerCaseQuery = query.toLowerCase();
        return gamesData.filter(game => 
            game.title.toLowerCase().includes(lowerCaseQuery) ||
            game.description.toLowerCase().includes(lowerCaseQuery) ||
            game.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );
    }

    function createGameResultElement(game) {
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');

        const img = document.createElement('img');
        img.src = game.image;
        img.alt = game.title + " Screenshot";
        gameItem.appendChild(img);

        const gameInfo = document.createElement('div');
        gameInfo.classList.add('game-info');

        const title = document.createElement('h3');
        title.textContent = game.title;
        gameInfo.appendChild(title);

        const fileSize = document.createElement('p');
        fileSize.textContent = "File Size: " + game.fileSize;
        gameInfo.appendChild(fileSize);

        const downloadLink = document.createElement('a');
        downloadLink.href = game.downloadLink;
        downloadLink.classList.add('download-button');
        downloadLink.textContent = 'Download';
        downloadLink.setAttribute('download', '');
        gameInfo.appendChild(downloadLink);

        gameItem.appendChild(gameInfo);
        return gameItem;
    }
});

// Improved search function with debouncing
let searchTimeout;

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            if (resultsContainer) {
                resultsContainer.innerHTML = '<p>Please enter at least 2 characters</p>';
            }
            return;
        }
        
        const results = searchGames(query);
        
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            if (results.length > 0) {
                results.forEach(game => {
                    const gameElement = createGameResultElement(game);
                    resultsContainer.appendChild(gameElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>No games found matching your search.</p>';
            }
        }
    }, 300);
}