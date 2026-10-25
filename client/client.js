let socket = new WebSocket('ws://192.168.0.177:8080');

let is_connected = false;
let player_side = "none";

socket.onopen = () => {
    is_connected = true;
    
    let connectData = {
        message_type: "connect_data",
        client_type: "player"
    };
    socket.send(JSON.stringify(connectData)); 
};

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if(message.message_type == "connect_response")
    {
        console.log(`Connected! You've got the ${message.side} side`);
        player_side = message.side;
    }
};

socket.onclose = () => {
    is_connected = false;
};

function sendMoveMessage(direction)
{
    let moveData = {
        message_type: "player_move",
        side: player_side,
        direction: direction
    };

    socket.send(JSON.stringify(moveData));
}