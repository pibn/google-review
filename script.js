document.addEventListener('DOMContentLoaded', () => {
    // Add profile picture URL logic at the start
    const profilePic = document.getElementById('profilePic');
    const path = window.location.pathname;
    const urlSegments = path.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    
    const tryLoadImage = async (baseUrl, formats) => {
        for (const format of formats) {
            try {
                const response = await fetch(`${baseUrl}.${format}`);
                if (response.ok) {
                    return `${baseUrl}.${format}`;
                }
            } catch (e) {
                continue;
            }
        }
        return 'https://raw.githubusercontent.com/pibn/google-review/main/image.jpg'; // fallback
    };

    if (lastSegment) {
        const baseUrl = `https://raw.githubusercontent.com/pibn/google-review/main/assets/${lastSegment}/image`;
        const formats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        tryLoadImage(baseUrl, formats).then(imageUrl => {
            profilePic.src = imageUrl;
        });
    } else {
        profilePic.src = 'https://raw.githubusercontent.com/pibn/google-review/main/image.jpg'; // fallback image
    }

    const starsContainer = document.querySelector('.stars');
    const stars = starsContainer.querySelectorAll('.star');
    const postButton = document.querySelector('.post-button'); // Get post button
    const reviewInput = document.querySelector('.review-input'); // Get review input container

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
                window.location.href = 'https://x.com'; // Redirect for 3-5 stars
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
});
