const net = require('net');
const Parser = require('redis-parser');
const store: never[] = [];

const server = net.createServer(((connection: {
    [x: string]: any; on: (arg0: string, arg1: (data: any) => void) => void; 
}) => {
    console.log('Client connected...');

    connection.on('data', data => {
        const parser = new Parser({
            returnReply: (reply: any) => {
                const command = reply[0];
                switch(command){
                    case 'set': {
                        const key = reply[1];
                        const value = reply[2];
                        if (typeof key === 'string') {
                            (store as Record<string, any>)[key] = value;
                        } else {
                            connection.write('-ERR Invalid key type\r\n');
                            break;
                        }
                        connection.write('+OK\r\n');
                    }
                    break;
                    case 'get': {
                        const key = reply[1];
                        const value = store[key];
                        connection.write(`+${value}\r\n`);
                    }
                    break;
                    default: {
                        
                    }
                }
            },
            returnError: (error: any) => {
                console.log(error);
            }
        })

        parser.execute(data);
        connection.write('+0K\r\n');
    });
}));

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});