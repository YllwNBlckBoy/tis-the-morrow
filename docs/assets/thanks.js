document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');

    if (!product) {
        body.innerHTML = '<p>Missing product info.</p>';
        throw new Error("No product specified");
    }

    localStorage.setItem(`bought_${product}`, Date.now());
    
    let seconds = 10;
    const link = document.getElementById('download-link');
    const countdown = document.getElementById('countdown');

    const timer = setInterval(() => {
        seconds--;
        countdown.textContent = seconds;
        if (seconds <= 0) {
        clearInterval(timer);
        fetch(`/api/get-download-link?product=${product}`)
            .then(res => res.json())
            .then(data => {
            link.href = data.url;
            link.classList.remove('disabled');
            link.textContent = 'Download Now';
            });
        }
    }, 1000);
});