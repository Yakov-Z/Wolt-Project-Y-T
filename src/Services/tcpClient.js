const net = require('net');

// Create a new TCP socket client
const tcpClient = new net.Socket();
const TCP_PORT = 8080;
const TCP_HOST = '127.0.0.1';

// Connect to the legacy C++ recommendation server
tcpClient.connect(TCP_PORT, TCP_HOST);

// Function to format and send commands to the legacy server
const sendCommand = (action, userId, ...productIds) => {
    // Construct the space-separated command string
    const commandString = `${action} ${userId} ${productIds.join(' ')}\n`;
    
    // Send the payload through the socket
    tcpClient.write(commandString);
};

module.exports = { sendCommand };