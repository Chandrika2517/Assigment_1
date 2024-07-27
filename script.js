const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSizeInput = document.querySelector('.brush-size input');
const eraseBtn = document.getElementById('erase-btn');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const crosshair = document.getElementById('crosshair');
const colorButtons = document.querySelectorAll('.color');

let isDrawing = false;
let brushColor = '#000000'; // Default color is black
let brushSize = 5;
let lines = []; // Array to store lines
let currentLine = [];


canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 100;
});


function loadCanvas() {
    const savedData = localStorage.getItem('canvasImage');
    if (savedData) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = savedData;
    }
}


function saveCanvas() {
    const dataURL = canvas.toDataURL();
    localStorage.setItem('canvasImage', dataURL);
}


function updateCanvasState() {
    saveCanvas();
}

function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePosition(e);
    currentLine = [{ x: pos.x, y: pos.y }];
    console.log('Start drawing at:', pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;

    const pos = getMousePosition(e);

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    console.log('Drawing at:', pos.x, pos.y);

    ctx.beginPath();
    ctx.moveTo(currentLine[currentLine.length - 1].x, currentLine[currentLine.length - 1].y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    currentLine.push({ x: pos.x, y: pos.y });
    updateCanvasState();
}

function endDrawing() {
    if (!isDrawing) return;

    isDrawing = false;
    lines.push(currentLine);
    currentLine = [];
    updateCanvasState();
}

function eraseLastLine() {
    if (lines.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.pop();
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        line.forEach(point => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
    });
    updateCanvasState();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines = [];
    localStorage.removeItem('canvasImage');
}

function saveCanvasImage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'painting.png';
    link.click();
}


function updateCrosshair(e) {
    const pos = getMousePosition(e);
    crosshair.style.left = `${pos.x}px`;
    crosshair.style.top = `${pos.y}px`;
    crosshair.style.backgroundColor = brushColor;
    crosshair.style.display = 'block';
}

function hideCrosshair() {
    crosshair.style.display = 'none';
}


function updateBrushColor(color) {
    brushColor = color;
    crosshair.style.backgroundColor = brushColor;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseleave', endDrawing);

colorPicker.addEventListener('input', (e) => {
    updateBrushColor(e.target.value);
});

colorButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const color = e.target.getAttribute('data-color');
        updateBrushColor(color);
    });
});

brushSizeInput.addEventListener('input', (e) => {
    brushSize = e.target.value;
});

eraseBtn.addEventListener('click', eraseLastLine);
clearBtn.addEventListener('click', clearCanvas);
saveBtn.addEventListener('click', saveCanvasImage);


canvas.addEventListener('mousemove', updateCrosshair);
canvas.addEventListener('mouseleave', hideCrosshair);


loadCanvas();
