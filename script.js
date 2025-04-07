document.addEventListener('DOMContentLoaded', async () => {
    // Hides all material icons by default, Shows them only after fonts are fully loaded
    document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
    });

    const path = window.location.pathname;
    const urlSegments = path.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    let userData = null;

    // Fetch user data from JSON
    const fetchUserData = async () => {
        try {
            const response = await fetch(`https://raw.githubusercontent.com/pibn/google-review/main/assets/${lastSegment}/data.json`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.error('Error fetching user data:', e);
        }
        return null;
    };

    // Initialize user data
    if (lastSegment) {
        userData = await fetchUserData();
        if (userData) {
            // Update profile picture
            const profilePic = document.getElementById('profilePic');
            profilePic.src = `https://raw.githubusercontent.com/pibn/google-review/main/assets/${lastSegment}/${userData.thumbnail}`;
            
            // Update user name
            const userName = document.querySelector('.user-name');
            userName.textContent = userData.name;
        }
    }

    const starsContainer = document.querySelector('.stars');
    const stars = starsContainer.querySelectorAll('.star');
    const postButton = document.querySelector('.post-button');
    const reviewInput = document.querySelector('.review-input');

    let currentRating = 0;

    // Function to update stars visually
    const updateStars = (rating) => {
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= rating) {
                star.textContent = 'star'; // Filled star icon name
                star.classList.add('filled');
            } else {
                star.textContent = 'star_outline'; // Outlined star icon name
                star.classList.remove('filled');
            }
        });
    };

    // Function to check if the post button should be active
    const checkPostButton = () => {
        const reviewText = document.querySelector('.review-input textarea').value;
        if (currentRating > 0 || reviewText.trim().length > 0) {
            postButton.classList.add('active');
            postButton.style.cursor = 'pointer';
        } else {
            postButton.classList.remove('active');
            postButton.style.cursor = 'not-allowed';
        }
    };

    stars.forEach(star => {
        // Handle mouse hovering over stars
        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.dataset.value);
            updateStars(hoverRating); // Temporarily fill stars up to the hovered one
        });

        // Handle mouse leaving the stars container
        starsContainer.addEventListener('mouseleave', () => {
            updateStars(currentRating); // Revert to the actual selected rating
        });

        // Handle clicking a star
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.value);
            starsContainer.dataset.rating = currentRating; // Update data attribute
            updateStars(currentRating); // Permanently set the rating

            if (currentRating >= 3) {
                window.location.href = userData?.link || 'https://maps.google.com'; // Use link from JSON or fallback
            } else if (currentRating <= 2) {
                reviewInput.classList.add('active'); // Show text box
                postButton.classList.add('active'); // Show post button
            }

            checkPostButton(); // Check if post button can be activated
            console.log(`Rating set to: ${currentRating}`);
        });
    });

    // Check post button state when text area changes
    document.querySelector('.review-input textarea').addEventListener('input', checkPostButton);

    // Initial check for post button state (in case of pre-filled data, though not applicable here)
    checkPostButton();

    // Add these functions after the existing code inside DOMContentLoaded
    function showSnackbar() {
        const snackbar = document.getElementById("snackbar");
        snackbar.className = "snackbar show";
        setTimeout(() => { 
            snackbar.className = snackbar.className.replace("show", ""); 
        }, 3000);
    }

    // Modify the post button event listener
    postButton.addEventListener('click', () => {
        if (postButton.classList.contains('active')) {
            const textarea = document.querySelector('.review-input textarea');
            textarea.value = ''; // Clear the textarea
            showSnackbar(); // Show the snackbar
            postButton.classList.remove('active'); // Disable the button
        }
    });
});
