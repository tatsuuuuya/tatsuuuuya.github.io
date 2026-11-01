const TICKET_WIDTH = 1400;
const TICKET_HEIGHT = 980;

const COLOR_BG = '#F5F0DC';
const COLOR_INK = '#141414';

async function loadTicketFonts(sampleText) {
    await Promise.all([
        document.fonts.load('700 48px "Noto Sans JP"', sampleText),
        document.fonts.load('900 48px "Noto Sans JP"', sampleText),
        document.fonts.load('900 48px "Noto Serif JP"', sampleText),
    ]);
    await document.fonts.ready;
}

function fitHorizontalFontSize(ctx, text, maxWidth, maxHeight, fontFamily, weight, maxFontSize, minFontSize) {
    let fontSize = maxFontSize;
    while (fontSize > minFontSize) {
        ctx.font = `${weight} ${fontSize}px "${fontFamily}"`;
        if (ctx.measureText(text).width <= maxWidth) break;
        fontSize -= 2;
    }
    return Math.min(fontSize, maxHeight);
}

function fitVerticalFontSize(ctx, text, boxHeight, boxWidth, fontFamily, weight, maxFontSize, minFontSize) {
    let fontSize = maxFontSize;
    while (fontSize > minFontSize) {
        ctx.font = `${weight} ${fontSize}px "${fontFamily}"`;
        const lineHeight = fontSize * 1.08;
        const maxCharWidth = Math.max(...Array.from(text).map((ch) => ctx.measureText(ch).width));
        if (text.length * lineHeight <= boxHeight && maxCharWidth <= boxWidth) break;
        fontSize -= 2;
    }
    return fontSize;
}

function drawVerticalText(ctx, text, centerX, centerY, fontSize, fontFamily, weight, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${weight} ${fontSize}px "${fontFamily}"`;
    const lineHeight = fontSize * 1.08;
    const totalHeight = lineHeight * text.length;
    let y = centerY - totalHeight / 2 + lineHeight / 2;
    for (const ch of text) {
        ctx.fillText(ch, centerX, y);
        y += lineHeight;
    }
    ctx.restore();
}

function drawTicket(canvas, { userName, date, tournament, subtitle, organizer, ranked, logo }) {
    canvas.width = TICKET_WIDTH;
    canvas.height = TICKET_HEIGHT;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, TICKET_WIDTH, TICKET_HEIGHT);

    // Double border
    const OUTER_PAD = 16;
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 5;
    ctx.strokeRect(OUTER_PAD, OUTER_PAD, TICKET_WIDTH - OUTER_PAD * 2, TICKET_HEIGHT - OUTER_PAD * 2);
    const INNER_PAD = OUTER_PAD + 10;
    ctx.lineWidth = 3;
    ctx.strokeRect(INNER_PAD, INNER_PAD, TICKET_WIDTH - INNER_PAD * 2, TICKET_HEIGHT - INNER_PAD * 2);

    // Content area
    const cx0 = INNER_PAD + 18;
    const cy0 = INNER_PAD + 18;
    const cx1 = TICKET_WIDTH - INNER_PAD - 18;
    const cy1 = TICKET_HEIGHT - INNER_PAD - 18;
    const cw = cx1 - cx0;
    const ch = cy1 - cy0;

    // === 3-column layout ===
    const colGap = cw * 0.03;
    const leftW = cw * 0.38;
    const midW = cw * 0.126;
    const rightW = cw - leftW - midW - colGap * 2;

    const leftX = cx0;
    const midX = leftX + leftW + colGap;
    const rightX = midX + midW + colGap;

    // Vertical rhythm (right column defines the grid)
    const boxFrac = 0.1745;
    const gapFrac = 0.0396;
    const boxH = ch * boxFrac;
    const gapH = ch * gapFrac;

    // ────────────────────────────
    // LEFT COLUMN
    // ────────────────────────────

    // Tournament name (black filled box, white text, centered)
    const tournLabel = tournament;
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(leftX, cy0, leftW, boxH);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const tournFontSize = fitHorizontalFontSize(
        ctx, tournLabel, leftW * 0.85, boxH * 0.6, 'Noto Sans JP', 900, 80, 16
    );
    ctx.font = `900 ${tournFontSize}px "Noto Sans JP"`;
    ctx.fillText(tournLabel, leftX + leftW / 2, cy0 + boxH / 2 + 2);

    // Info lines (left-aligned, same font size)
    const infoH = ch * 0.045;
    const infoGap = ch * 0.005;
    const infoLines = [subtitle, `開催日：${date}`, `主催：${organizer}`];
    const longestInfoLine = infoLines.reduce((a, b) => (b.length > a.length ? b : a));
    const infoFontSize = fitHorizontalFontSize(
        ctx, longestInfoLine, leftW * 0.95, infoH * 0.9, 'Noto Sans JP', 700, 32, 14
    );
    const infoY = cy0 + boxH + ch * 0.01;
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${infoFontSize}px "Noto Sans JP"`;
    infoLines.forEach((line, i) => {
        ctx.fillText(line, leftX + 4, infoY + i * (infoH + infoGap) + infoH / 2);
    });

    // Logo image (square, centered in remaining space)
    const logoStartY = infoY + infoLines.length * (infoH + infoGap) + ch * 0.02;
    const logoMaxH = cy1 - logoStartY;
    const logoSize = Math.min(leftW, logoMaxH);
    if (logo) {
        const lx = leftX + (leftW - logoSize) / 2;
        const ly = logoStartY + (logoMaxH - logoSize) / 2;
        // The logo has an opaque white background; multiply blends it into the ticket color.
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(logo, lx, ly, logoSize, logoSize);
        ctx.restore();
    }

    // ────────────────────────────
    // MIDDLE COLUMN (4連単)
    // ────────────────────────────

    // Spans from top to bottom of rank box 4
    const midTop = cy0;
    const midBottom = cy0 + 3 * (boxH + gapH) + boxH;
    const midH = midBottom - midTop;
    const capH = midH * 0.088;

    // Column border
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(midX, midTop, midW, midH);

    // Top cap (black fill)
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(midX, midTop, midW, capH);

    // Bottom cap (black fill)
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(midX, midBottom - capH, midW, capH);

    // Bet-type vertical text between caps
    const betTypeText = tournament === '霜月杯' ? '4連単' : tournament;
    const btFontSize = fitVerticalFontSize(
        ctx, betTypeText,
        (midH - capH * 2) * 0.8, midW * 0.72,
        'Noto Sans JP', 900, 100, 20
    );
    drawVerticalText(
        ctx, betTypeText,
        midX + midW / 2, midTop + midH / 2,
        btFontSize, 'Noto Sans JP', 900, COLOR_INK
    );

    // ────────────────────────────
    // RIGHT COLUMN (rank boxes)
    // ────────────────────────────

    for (let i = 0; i < 4; i++) {
        const boxY = cy0 + i * (boxH + gapH);

        // Box border
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(rightX, boxY, rightW, boxH);

        // Name (horizontal, centered)
        const name = ranked[i] || '';
        const fontSize = fitHorizontalFontSize(
            ctx, name, rightW * 0.8, boxH * 0.55,
            'Noto Serif JP', 900, 70, 16
        );
        ctx.fillStyle = COLOR_INK;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${fontSize}px "Noto Serif JP"`;
        ctx.fillText(name, rightX + rightW / 2, boxY + boxH / 2);

        // Down-pointing triangle arrow between boxes
        if (i < 3) {
            const arrowCY = boxY + boxH + gapH / 2;
            const triW = rightW * 0.07;
            const triH = gapH * 0.38;
            ctx.fillStyle = COLOR_INK;
            ctx.beginPath();
            ctx.moveTo(rightX + rightW / 2 - triW / 2, arrowCY - triH / 2);
            ctx.lineTo(rightX + rightW / 2 + triW / 2, arrowCY - triH / 2);
            ctx.lineTo(rightX + rightW / 2, arrowCY + triH / 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Note text (centered below boxes)
    const noteY = cy0 + 4 * (boxH + gapH);
    const noteH = cy1 - noteY;
    const noteText = `（${userName}の予想１点）`;
    const noteFontSize = fitHorizontalFontSize(
        ctx, noteText, rightW * 0.92, noteH * 0.45,
        'Noto Sans JP', 700, 40, 14
    );
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${noteFontSize}px "Noto Sans JP"`;
    ctx.fillText(noteText, rightX + rightW / 2, noteY + noteH / 2);
}
