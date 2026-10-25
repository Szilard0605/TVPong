let socket = new WebSocket('ws://192.168.0.177:8080');

let is_connected = false;
let connected_players = 0;

socket.onopen = () => {
    console.log('connected to server')

    is_connected = true;
    
    let connectData = {
        message_type: "connect_data",
        client_type: "host"
    };
    socket.send(JSON.stringify(connectData)); 
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.message_type == "connect_response") {
        connected_players = data.player_count;
    }

    if(data.message_type == "start_game") {
        const start_game_event = new CustomEvent("start_game", {
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(start_game_event);
    }

    if(data.message_type == "player_connected") {
        connected_players ++;
    }

    if(data.message_type == "player_move") {
        const player_move_event = new CustomEvent("player_move", {
            detail: {
                side: data.side,
                direction: data.direction
            },
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(player_move_event);
    }
};

socket.onclose = () => {
    is_connected = false;
};

function sendMoveMessage(direction) {
    let moveData = {
        message_type: "player_move",
        side: player_side,
        direction: direction
    };

    socket.send(JSON.stringify(moveData));
}