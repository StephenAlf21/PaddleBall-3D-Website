document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
        });
    }

    // --- Cart Page Calculation Logic ---
    const cartCountrySelector = document.getElementById('country');
    const basePriceDisplay = document.getElementById('base-price');
    const taxAmountDisplay = document.getElementById('tax-amount');
    const totalPriceDisplay = document.getElementById('total-price');
    const paypalLink = document.getElementById('paypal-link');

    const calculateCartTotal = () => {
        if (!cartCountrySelector) return;
        const selectedOption = cartCountrySelector.options[cartCountrySelector.selectedIndex];
        const currency = selectedOption.getAttribute('data-currency');
        const taxRate = parseFloat(selectedOption.getAttribute('data-tax'));
        const basePrice = 19.99;
        const taxAmount = basePrice * taxRate;
        const totalPrice = basePrice + taxAmount;
        basePriceDisplay.textContent = `${currency}${basePrice.toFixed(2)}`;
        taxAmountDisplay.textContent = `${currency}${taxAmount.toFixed(2)}`;
        totalPriceDisplay.textContent = `${currency}${totalPrice.toFixed(2)}`;
        if (paypalLink) {
            paypalLink.href = `checkout.html?total=${totalPrice.toFixed(2)}&currency=${encodeURIComponent(currency)}`;
        }
    };

    if (cartCountrySelector) {
        cartCountrySelector.addEventListener('change', calculateCartTotal);
        calculateCartTotal();
    }

    // --- Checkout Page Animation Logic ---
    const checkoutCard = document.getElementById('checkout-card');
    if (checkoutCard) {
        const urlParams = new URLSearchParams(window.location.search);
        const total = urlParams.get('total');
        const currency = urlParams.get('currency');
        const finalTotalDisplay = document.getElementById('final-total');
        const confirmBtn = document.getElementById('confirm-purchase-btn');
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');

        if (finalTotalDisplay && total && currency) {
            finalTotalDisplay.textContent = `${decodeURIComponent(currency)}${total}`;
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                anime({
                    targets: step1, opacity: 0, translateY: -20, duration: 500, easing: 'easeInQuad',
                    complete: () => {
                        step1.classList.add('hidden');
                        step2.classList.remove('hidden');
                        anime({ targets: step2, opacity: [0, 1], translateY: [20, 0], duration: 500, easing: 'easeOutQuad' });
                        const timeline = anime.timeline({ easing: 'easeOutExpo', duration: 750 });
                        timeline.add({ targets: '.paypal-logo-p1', translateX: [40, 0], opacity: [0,1] }).add({ targets: '.paypal-logo-p2', translateX: [-40, 0], opacity: [0,1] }, '-=600');
                        setTimeout(() => {
                           alert(`Redirecting to PayPal to complete payment of ${decodeURIComponent(currency)}${total}. This is a simulation.`);
                           window.location.href = "index.html";
                        }, 2500);
                    }
                });
            });
        }
    }

    // --- Reviews Logic ---
    const getReviews = () => JSON.parse(localStorage.getItem('paddleBallReviews')) || [];
    const saveReviews = (reviews) => localStorage.setItem('paddleBallReviews', JSON.stringify(reviews));

    // Function to create a review card element
    const createReviewCard = (review, isMini = false) => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'bg-gray-800 p-6 rounded-lg border border-gray relative';
        if (isMini) {
            reviewElement.className = 'bg-gray-900 p-4 rounded-lg border border-gray';
        }

        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<i class="fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}"></i>`;
        }
        
        reviewElement.innerHTML = `
            ${!isMini ? `<button class="absolute top-3 right-3 text-gray-500 hover:text-red-500 delete-review-btn" data-id="${review.id}" title="Delete Review"><i class="fas fa-trash"></i></button>` : ''}
            <div class="flex items-center mb-2">
                <h3 class="font-orbitron text-xl font-bold">${review.name}</h3>
                <div class="ml-auto text-lg">${stars}</div>
            </div>
            <p class="text-gray-300 italic">"${review.text}"</p>
            ${!isMini ? `<p class="text-xs text-gray-500 mt-4">${new Date(review.date).toLocaleDateString()}</p>`: ''}
        `;
        return reviewElement;
    };

    // 1. Full Reviews Page Logic
    const reviewsList = document.getElementById('reviews-list');
    const noReviewsMessage = document.getElementById('no-reviews');
    const reviewForm = document.getElementById('review-form');

    if (reviewsList) {
        const displayFullReviews = () => {
            const reviews = getReviews();
            reviewsList.innerHTML = '';
            if (reviews.length === 0) {
                if (noReviewsMessage) noReviewsMessage.style.display = 'block';
            } else {
                if (noReviewsMessage) noReviewsMessage.style.display = 'none';
                reviews.forEach(review => reviewsList.appendChild(createReviewCard(review)));
            }
        };

        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newReview = { id: Date.now(), name: e.target.name.value, rating: parseInt(e.target.rating.value), text: e.target['review-text'].value, date: new Date().toISOString() };
                const reviews = getReviews();
                reviews.unshift(newReview);
                saveReviews(reviews);
                reviewForm.reset();
                displayFullReviews();
            });
        }

        reviewsList.addEventListener('click', (e) => {
            const deleteButton = e.target.closest('.delete-review-btn');
            if (deleteButton) {
                const reviewId = parseInt(deleteButton.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this review?')) {
                    let reviews = getReviews();
                    reviews = reviews.filter(review => review.id !== reviewId);
                    saveReviews(reviews);
                    displayFullReviews();
                }
            }
        });
        displayFullReviews();
    }

    // 2. Store Page Reviews Preview
    const storeReviewsList = document.getElementById('store-reviews-list');
    const noStoreReviewsMessage = document.getElementById('no-store-reviews');
    if (storeReviewsList) {
        const reviews = getReviews();
        storeReviewsList.innerHTML = '';
        if (reviews.length === 0) {
            if (noStoreReviewsMessage) noStoreReviewsMessage.style.display = 'block';
        } else {
            if (noStoreReviewsMessage) noStoreReviewsMessage.style.display = 'none';
            // Show up to 2 reviews
            reviews.slice(0, 2).forEach(review => storeReviewsList.appendChild(createReviewCard(review, true)));
        }
    }

    // 3. Cart Page Reviews Preview
    const cartReviewsList = document.getElementById('cart-reviews-list');
    const noCartReviewsMessage = document.getElementById('no-cart-reviews');
    if (cartReviewsList) {
        const reviews = getReviews();
        cartReviewsList.innerHTML = '';
        if (reviews.length === 0) {
            if (noCartReviewsMessage) noCartReviewsMessage.style.display = 'block';
        } else {
            if (noCartReviewsMessage) noCartReviewsMessage.style.display = 'none';
            // Show up to 3 top-rated reviews
            const topReviews = reviews.sort((a, b) => b.rating - a.rating).slice(0, 3);
            topReviews.forEach(review => cartReviewsList.appendChild(createReviewCard(review, true)));
        }
    }
});
