const BUTTON_PADDING = 50;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");

let player_left = {
    pos_y: 0,
    score: 0
}

let player_right = {
    pos_y: 0,
    score: 0
}

let ball = {
    pos: { x: 0, y: 0 },
    direction: { x: 0, y: 0 }
}

const ball_speed = 10.0; 
const ball_radius = 30.0;

let game_started = false;

if(!ctx) {
    throw error('Could not get canvas context');
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const paddle_speed = 15.0;
const paddle_width = canvas.width * 0.02;
const paddle_height = canvas.height * 0.40;
const paddle_padding = canvas.width * 0.003;

const frame_time = 1000 / 60;
let delta_time = 0;
let last_time_stamp = 0;

let arrow_up_pressed = false;
let arrow_down_pressed = false;

let countdown = {
    active: false,
    seconds: 5
};

function clear_background(color) {
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function draw_left_player() {
    ctx.beginPath();
    //let bg_color = (player_side == "left") ? { r: 238, g: 255, b: 0 } : { r: 0, g: 26, b: 255 };
    ctx.fillStyle = 'rgb(238, 255, 0)';
    ctx.lineWidth = 5;
    ctx.rect(paddle_padding, player_left.pos_y, paddle_width, paddle_height);
    ctx.fill();
    ctx.stroke();
}

function draw_right_player() {
    ctx.beginPath();
    //let bg_color = (player_side == "left") ? { r: 238, g: 255, b: 0 } : { r: 0, g: 26, b: 255 };
    ctx.fillStyle = 'rgb(0, 26, 255)';
    ctx.lineWidth = 5;
    const paddle_x = canvas.width - paddle_width - paddle_padding;
    ctx.rect(paddle_x , player_right.pos_y, paddle_width, paddle_height);
    ctx.fill();
    ctx.stroke();
}

function draw_ball() {
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.arc(ball.pos.x, ball.pos.y, ball_radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
}

function draw_net() {
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 255, 255)';

    const net_width = 10;
    const net_height = 30;
    const net_padding = 15;
    const net_start_x = canvas.width / 2;
    const net_start_y = 0;
    const iter = Math.floor(canvas.height / (net_padding + net_height));
    
    for(let i = 0; i < Math.floor(canvas.height / iter); i++)
    {
        ctx.rect(net_start_x, net_start_y + i * (net_padding + net_height), net_width, net_height);
    }

    ctx.fill();
    ctx.stroke();
}

function draw_score()
{
    const score_text_size = 48;
    const score_height = 100;
    const score_padding = 100;

    ctx.beginPath();
    ctx.font = `${score_text_size}px arial`;
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.textAlign = "center";

    // left score
    const left_score_x = canvas.width/2 - score_padding;
    const right_score_x = canvas.width/2 + score_padding;
    ctx.fillText(player_left.score, left_score_x, score_height); 

    // right score
    ctx.fillText(player_right.score, right_score_x, score_height); 

    ctx.fill();
    ctx.stroke();
}

document.addEventListener('keydown', (e) => {
    if(e.key == 'ArrowDown') {
        arrow_down_pressed = true;
    }
    
    if(e.key == 'ArrowUp') {
        arrow_up_pressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if(e.key == 'ArrowDown') {
        arrow_down_pressed = false;
    }
    
    if(e.key == 'ArrowUp') {
        arrow_up_pressed = false;
    }
});

document.addEventListener('start_game', (e) => {
    countdown.active = true;
    game_started = true;
    setTimeout("game_start_countdown()", 1000);
});

document.addEventListener('player_move', (e) => {
    const { side, direction } = e.detail;

    if(side == "left")
    {
        if(direction == "up" && player_left.pos_y > 0)
            player_left.pos_y -= paddle_speed * delta_time;

        if(direction == "down" && player_left.pos_y + paddle_height < canvas.height)
            player_left.pos_y += paddle_speed * delta_time;
    }

    if(side == "right")
    {
        if(direction == "up"  && player_right.pos_y > 0)
            player_right.pos_y -= paddle_speed * delta_time;

        if(direction == "down" && player_right.pos_y + paddle_height < canvas.height)
            player_right.pos_y += paddle_speed * delta_time;
    }
});

function game_start_countdown()
{
    if(countdown.seconds > 0 && countdown.active) {
        countdown.seconds --;
        setTimeout("game_start_countdown()", 1000);
    }
    else {
        countdown.active = false;    
    }
}

function reset_game() {
    ball.pos = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;

    const horizontal_sign = Math.random() < 0.5 ? -1 : 1;

    ball.direction = {
        x: Math.cos(angle) * horizontal_sign,
        y: Math.sin(angle)
    };
}

function update_ball() {
    const r = ball_radius / 2;

    ball.pos.x += ball.direction.x * ball_speed * delta_time;
    ball.pos.y += ball.direction.y * ball_speed * delta_time;

    // Bounce off the top and bottom walls
    if (ball.pos.y - r <= 0) {
        ball.pos.y = r;
        ball.direction.y = Math.abs(ball.direction.y);
    } else if (ball.pos.y + r >= canvas.height) {
        ball.pos.y = canvas.height - r;
        ball.direction.y = -Math.abs(ball.direction.y);
    }

    function overlaps_paddle(paddle_y) {
        return ball.pos.y + r >= paddle_y &&
               ball.pos.y - r <= paddle_y + paddle_height;
    }

    if (
        ball.direction.x < 0 &&
        ball.pos.x - r <= paddle_padding + paddle_width &&
        ball.pos.x + r >= paddle_padding &&
        overlaps_paddle(player_left.pos_y)
    ) {
        const paddle_center = player_left.pos_y + paddle_height / 2;
        const hit_offset = (ball.pos.y - paddle_center) / (paddle_height / 2);

        ball.pos.x = paddle_padding + paddle_width + r;
        ball.direction.x = Math.abs(ball.direction.x);
        ball.direction.y = hit_offset;
    }

    const right_x = canvas.width - paddle_padding - paddle_width;

    if (
        ball.direction.x > 0 &&
        ball.pos.x + r >= right_x &&
        ball.pos.x - r <= right_x + paddle_width &&
        overlaps_paddle(player_right.pos_y)
    ) {
        const paddle_center = player_right.pos_y + paddle_height / 2;
        const hit_offset = (ball.pos.y - paddle_center) / (paddle_height / 2);

        ball.pos.x = right_x - r;
        ball.direction.x = -Math.abs(ball.direction.x);
        ball.direction.y = hit_offset;
    }

    if(ball.pos.x < 0) {
        player_right.score ++;
        reset_game();
    }

    if(ball.pos.x > canvas.width) {
        player_left.score ++;
        reset_game();
    }
}

function draw_game() {
    let color = { r: 0, g: 0, b: 0 };
    clear_background(color);
    draw_left_player();
    draw_right_player();
    draw_net();
    draw_score();
    draw_ball();
}

function draw_waiting() {
    let color = { r: 0, g: 0, b: 0 };
    clear_background(color);

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "64px Arian";

    const text_x = canvas.width/2;
    const text_y = canvas.height/2;
    const player_count_to_start = 2 - connected_players;
    ctx.fillText(`Waiting for ${player_count_to_start} player(s) to start`, text_x, text_y);

    ctx.fill();
    ctx.stroke();
}

function draw_countdown() {
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.font = "64px Arian";

    const text_x = canvas.width/2;
    const text_y = canvas.height/2;
    ctx.fillText(`${countdown.seconds}`, text_x, text_y);

    ctx.fill();
    ctx.stroke();
}

function update(timestamp) {
    delta_time = (timestamp - last_time_stamp) / frame_time;
    last_time_stamp = timestamp;
    

    if(!game_started) {
        draw_waiting();
        requestAnimationFrame(update);
        return;
    }

    draw_game();

    if(countdown.active) {
        draw_countdown();
        requestAnimationFrame(update);
        return;
    }

    update_ball();

    if(arrow_down_pressed && player_left.pos_y + paddle_height < canvas.height) {
        player_left.pos_y += paddle_speed * delta_time;
        player_right.pos_y += paddle_speed * delta_time;
    }
    
    if(arrow_up_pressed && player_left.pos_y > 0) {
        player_left.pos_y -= paddle_speed * delta_time;
        player_right.pos_y -= paddle_speed * delta_time;
    }
    
    requestAnimationFrame(update);
}


reset_game();
requestAnimationFrame(update);