const TICKET_WIDTH = 1400;
const TICKET_HEIGHT = 980;

const COLOR_BG = '#F5F0DC';
const COLOR_INK = '#141414';

async function loadTicketFonts(sampleText) {
    await Promise.all([
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

function drawArrow(ctx, centerX, centerY, size) {
    ctx.save();
    ctx.fillStyle = COLOR_INK;
    ctx.beginPath();
    ctx.moveTo(centerX - size / 2, centerY - size * 0.6);
    ctx.lineTo(centerX + size / 2, centerY);
    ctx.lineTo(centerX - size / 2, centerY + size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawTicket(canvas, { userName, date, tournament, ranked }) {
    canvas.width = TICKET_WIDTH;
    canvas.height = TICKET_HEIGHT;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, TICKET_WIDTH, TICKET_HEIGHT);

    const OUTER_PAD = 16;
    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 5;
    ctx.strokeRect(OUTER_PAD, OUTER_PAD, TICKET_WIDTH - OUTER_PAD * 2, TICKET_HEIGHT - OUTER_PAD * 2);
    const INNER_PAD = OUTER_PAD + 10;
    ctx.lineWidth = 3;
    ctx.strokeRect(INNER_PAD, INNER_PAD, TICKET_WIDTH - INNER_PAD * 2, TICKET_HEIGHT - INNER_PAD * 2);

    const contentX0 = INNER_PAD + 18;
    const contentY0 = INNER_PAD + 18;
    const contentX1 = TICKET_WIDTH - INNER_PAD - 18;
    const contentY1 = TICKET_HEIGHT - INNER_PAD - 18;
    const contentW = contentX1 - contentX0;
    const contentH = contentY1 - contentY0;

    const leftW = contentW * 0.225;
    const leftX0 = contentX0;
    const leftX1 = leftX0 + leftW;

    const titleBoxH = contentH * 0.16;

    let cursorY = contentY0;

    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(leftX0, cursorY, leftW, titleBoxH);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const tournamentFontSize = fitHorizontalFontSize(
        ctx, tournament, leftW * 0.86, titleBoxH * 0.65, 'Noto Sans JP', 900, 70, 16
    );
    ctx.font = `900 ${tournamentFontSize}px "Noto Sans JP"`;
    ctx.fillText(tournament, leftX0 + leftW / 2, cursorY + titleBoxH / 2 + 2);
    cursorY += titleBoxH + contentH * 0.02;

    const userNameH = contentH * 0.14;
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(leftX0, cursorY, leftW, userNameH);
    ctx.fillStyle = '#FFFFFF';
    const userNameFontSize = fitHorizontalFontSize(
        ctx, userName, leftW * 0.88, userNameH * 0.82, 'Noto Sans JP', 900, 160, 20
    );
    ctx.font = `900 ${userNameFontSize}px "Noto Sans JP"`;
    ctx.fillText(userName, leftX0 + leftW / 2, cursorY + userNameH / 2 + 2);
    cursorY += userNameH + contentH * 0.015;

    const dateH = contentH * 0.1;
    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(leftX0, cursorY, leftW, dateH);
    ctx.fillStyle = '#FFFFFF';
    const dateFontSize = fitHorizontalFontSize(
        ctx, date, leftW * 0.82, dateH * 0.8, 'Noto Sans JP', 900, 100, 16
    );
    ctx.font = `900 ${dateFontSize}px "Noto Sans JP"`;
    ctx.fillText(date, leftX0 + leftW / 2, cursorY + dateH / 2 + 2);
    cursorY += dateH + contentH * 0.03;

    const footerH = contentH * 0.12;
    const verticalTextH = contentY1 - footerH - cursorY;
    const betTypeText = tournament === '霜月杯' ? '4連単' : tournament;
    const betTypeFontSize = fitVerticalFontSize(
        ctx, betTypeText, verticalTextH * 0.94, leftW * 0.82, 'Noto Sans JP', 900, 160, 30
    );
    drawVerticalText(
        ctx,
        betTypeText,
        leftX0 + leftW / 2,
        cursorY + verticalTextH / 2,
        betTypeFontSize,
        'Noto Sans JP',
        900,
        COLOR_INK
    );
    cursorY += verticalTextH;

    ctx.fillStyle = COLOR_INK;
    ctx.fillRect(leftX0, cursorY, leftW, footerH);

    const rightX0 = leftX1 + contentW * 0.035;
    const rightX1 = contentX1;
    const rightW = rightX1 - rightX0;

    ctx.strokeStyle = COLOR_INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(rightX0, contentY0, rightW, titleBoxH);
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const titleFontSize = fitHorizontalFontSize(
        ctx, 'フォーメーション', rightW * 0.94, titleBoxH * 0.78, 'Noto Sans JP', 900, 90, 20
    );
    ctx.font = `900 ${titleFontSize}px "Noto Sans JP"`;
    ctx.fillText('フォーメーション', rightX0 + rightW / 2, contentY0 + titleBoxH / 2 + 2);

    const labelsY = contentY0 + titleBoxH + contentH * 0.05;
    const labelsH = contentH * 0.05;

    const boxesY0 = labelsY + labelsH + contentH * 0.01;
    const boxesH = contentH * 0.5;

    const ARROW_GAP_FRAC = 0.06;
    const boxWidthFrac = (1 - ARROW_GAP_FRAC * 3) / 4;
    const boxW = rightW * boxWidthFrac;
    const arrowGapW = rightW * ARROW_GAP_FRAC;

    const rankLabels = ['1位', '2位', '3位', '4位'];
    for (let i = 0; i < 4; i++) {
        const boxX0 = rightX0 + i * (boxW + arrowGapW);

        ctx.fillStyle = COLOR_INK;
        ctx.font = `700 ${labelsH * 0.85}px "Noto Sans JP"`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(rankLabels[i], boxX0, labelsY + labelsH);

        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX0, boxesY0, boxW, boxesH);

        const name = ranked[i] || '';
        const fontSize = fitVerticalFontSize(ctx, name, boxesH * 0.94, boxW * 0.9, 'Noto Serif JP', 900, 90, 16);
        drawVerticalText(
            ctx,
            name,
            boxX0 + boxW / 2,
            boxesY0 + boxesH / 2,
            fontSize,
            'Noto Serif JP',
            900,
            COLOR_INK
        );

        if (i < 3) {
            drawArrow(ctx, boxX0 + boxW + arrowGapW / 2, boxesY0 + boxesH / 2, Math.min(arrowGapW * 0.7, boxesH * 0.08));
        }
    }

    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    const noteText = `（${userName}の予想1点）`;
    const noteFontSize = fitHorizontalFontSize(
        ctx, noteText, rightW * 0.92, dateFontSize, 'Noto Sans JP', 700, 100, 16
    );
    ctx.font = `700 ${noteFontSize}px "Noto Sans JP"`;
    const noteY = boxesY0 + boxesH + noteFontSize * 1.15;
    ctx.fillText(noteText, rightX1, noteY);
}
