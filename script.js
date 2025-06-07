function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';
    const lines = [];

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && line.length > 0) {
            lines.push(line);
            line = words[i];
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    const offsetY = -((lines.length - 1) * lineHeight) / 2; // 中央揃え用
    lines.forEach((l, i) => {
        ctx.strokeText(l, x, y + offsetY + i * lineHeight);
        ctx.fillText(l, x, y + offsetY + i * lineHeight);
    });
}

document.getElementById('generateButton').addEventListener('click', () => {
    document.fonts.ready.then(() => {
        generate();
        generate();
        generate();  // フォント読み込みが完了してから描画する
    });
});

function generate() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const fileInput = document.getElementById('imageInput');
    const quote = document.getElementById('quoteInput').value.trim();
    const name = document.getElementById('nameInput').value.trim();

    const drawContent = (drawBackground) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();

        // 中央の迷言
        ctx.fillStyle = 'white';
        ctx.font = 'bold 64px "Zen Maru Gothic", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        const maxTextWidth = canvas.width * 0.85;
        const textWidth = ctx.measureText(quote).width;

        if (textWidth > maxTextWidth) {
            wrapText(ctx, quote, canvas.width / 2, canvas.height / 2, maxTextWidth, 64);
        } else {
            ctx.strokeText(quote, canvas.width / 2, canvas.height / 2);
            ctx.fillText(quote, canvas.width / 2, canvas.height / 2);
        }

        // 右下の名前
        ctx.font = 'bold 32px "Zen Maru Gothic", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.strokeText(name, canvas.width - 20, canvas.height - 20);
        ctx.fillText(name, canvas.width - 20, canvas.height - 20);

        // Canvas を画像にして表示（長押し保存）
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
                ctx.filter = 'blur(4px)';
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                ctx.filter = 'none';
            });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}