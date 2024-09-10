const net = require('net');

const server = net.createServer(((connection: { on: (arg0: string, arg1: (data: any) => void) => void; }) => {
    console.log('Client connected...');

    connection.on('data', data => {
        console.log(data.toString());
    });
}));

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});