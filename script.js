function generate() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const fileInput = document.getElementById('imageInput');
    const quote = document.getElementById('quoteInput').value;
    const name = document.getElementById('nameInput').value;

    const drawContent = (drawBackground) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 86px "Zen Maru Gothic", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(quote, canvas.width / 2, canvas.height / 2);
        ctx.fillText(quote, canvas.width / 2, canvas.height / 2);

        ctx.font = 'bold 32px "Zen Maru Gothic", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.strokeText(name, canvas.width - 20, canvas.height - 20);
        ctx.fillText(name, canvas.width - 20, canvas.height - 20);

        const outputImg = document.getElementById('outputImage');
        outputImg.src = canvas.toDataURL('image/png');
        outputImg.style.display = 'block';
    };

    if (!fileInput.files[0]) {
        drawContent(() => {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
        return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(e) {
        img.onload = function() {
            drawContent(() => {
                const aspect = img.width / img.height;
                let drawWidth, drawHeight;
                if (aspect > 16 / 9) {
                    drawHeight = canvas.height;
                    drawWidth = img.width * (canvas.height / img.height);
                } else {
                    drawWidth = canvas.width;
                    drawHeight = img.height * (canvas.width / img.width);
                }
                const offsetX = (canvas.width - drawWidth) / 2;
                const offsetY = (canvas.height - drawHeight) / 2;
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}