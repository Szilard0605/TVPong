const BUTTON_PADDING = 50;

const canvas = document.getElementById('controller-canvas');
const ctx = canvas.getContext("2d");

if(!ctx) {
    throw error('Could not get canvas context');
}

let is_touching = false;
let touch_pos = { x: 0, y: 0 };
let button_color = 'rgb(255, 255, 255)';

let up_button = {
    pos: {x: 0, y: 0},
    size: {x: 0, y: 0},
    color: 'rgb(255, 255, 255)'
}

let down_button = {
    pos: {x: 0, y: 0},
    size: {x: 0, y: 0},
    color: 'rgb(255, 255, 255)'
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    is_touching = true;
    const rect = canvas.getBoundingClientRect();
    touch_pos = {x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top };
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    touch_pos = {x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top };
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();

    is_touching = false;
});

function fill_background(color) {
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw_up_button() {
    up_button.size.x = canvas.width * 0.60;
    up_button.size.y = canvas.height * 0.30; 
    up_button.pos.x = canvas.width / 2 - up_button.size.x / 2;
    up_button.pos.y = canvas.height / 2 - up_button.size.y / 2 - up_button.size.y / 2 - BUTTON_PADDING;

    ctx.beginPath();
    ctx.fillStyle = up_button.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;

    ctx.rect(up_button.pos.x, up_button.pos.y, up_button.size.x, up_button.size.y);
    ctx.fill();
    ctx.stroke();
}

function draw_down_button() {
    down_button.size.x = canvas.width * 0.60;
    down_button.size.y = canvas.height * 0.30; 
    down_button.pos.x = canvas.width / 2 - down_button.size.x / 2;
    down_button.pos.y = canvas.height / 2 - down_button.size.y / 2 + down_button.size.y / 2 + BUTTON_PADDING;
    ctx.beginPath();
    ctx.fillStyle = down_button.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;

    ctx.rect(down_button.pos.x, down_button.pos.y, down_button.size.x, down_button.size.y);
    ctx.fill();
    ctx.stroke();
}

function draw_connection_status()
{
    ctx.font = "24px serif";
    ctx.fillStyle = is_connected ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)"
    ctx.fillText(is_connected? "Connected" : "Disconnected", 5, 24);
}

function is_touching_up()
{
    return touch_pos.x > up_button.pos.x && touch_pos.x < up_button.pos.x + up_button.size.x &&
           touch_pos.y > up_button.pos.y && touch_pos.y < up_button.pos.y + up_button.size.y && is_touching;
}

function is_touching_down()
{
    return touch_pos.x > down_button.pos.x && touch_pos.x < down_button.pos.x + down_button.size.x &&
           touch_pos.y > down_button.pos.y && touch_pos.y < down_button.pos.y + down_button.size.y && is_touching;
}


function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let bg_color = (player_side == "left") ? { r: 238, g: 255, b: 0 } : { r: 0, g: 26, b: 255 };
    fill_background(bg_color);
    draw_up_button();
    draw_down_button();
    draw_connection_status();
}

function update() {
    draw();

    if(is_touching_up()) {
        sendMoveMessage("up");
        up_button.color = "rgb(255, 0, 0)";
    } else {
        up_button.color = "rgb(255, 255, 255)";
    }

    if(is_touching_down()) {
        sendMoveMessage("down");
        down_button.color = "rgb(255, 0, 0)";
    } else {
        down_button.color = "rgb(255, 255, 255)";
    }

    requestAnimationFrame(update);
}

update();
