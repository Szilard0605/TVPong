import { WebSocketServer } from 'ws';

const SERVER_PORT = 8080;

let host_socket = null;

let player_count = 0;
let players = [{}];

const wss = new WebSocketServer({ port: SERVER_PORT });

if(wss) {
    console.log('TVPong server started on port', SERVER_PORT);
} else {
    console.error('Failed to start server on port', SERVER_PORT);
}
wss.on('connection', (ws) => {
    ws.on('message', (data) =>  {
        const client_data = JSON.parse(data);
        if(client_data.message_type == "connect_data") {
            if(client_data.client_type == "player") {
                if(player_count >= 2) {
                    ws.close();
                }

                player_count ++;

                let side = (player_count % 2) == 0 ? "right" : "left"; 
                console.log(`Player connected! Assigned ${side} side`);

                let response = {
                    message_type: "connect_response",
                    side: side
                }
                ws.send(JSON.stringify(response));

                if(host_socket)
                {
                    let message = "none";
                    
                    if(player_count == 2) {
                        message = "start_game";
                    } else {
                        message = "player_connected";
                    } 

                    const message_data = {
                        message_type: message
                    };

                    host_socket.send(JSON.stringify(message_data));
                }
            }

            if(client_data.client_type == "host")
            {
                const response_data = {
                    player_count: player_count
                };
                ws.send(JSON.stringify(response_data));
                host_socket = ws;
                console.log("Host connected!");
            }
        }

        if(client_data.message_type == "player_move")
        {
            //console.log(`${client_data.side} side player moved ${client_data.direction}`);
            if(host_socket)
            {
                const message = {
                    message_type: "player_move",
                    side: client_data.side,
                    direction: client_data.direction
                };

                host_socket.send(JSON.stringify(message));
            }
        }
    });
});