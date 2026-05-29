const net = require('net');

// Create a new TCP socket client
const tcpClient = new net.Socket();
// Use environment variables if they exist (Docker), otherwise default to localhost
const TCP_HOST = process.env.TCP_HOST || '127.0.0.1';
const TCP_PORT = process.env.TCP_PORT || 8080;

// Connect to the C++ recommendation server
tcpClient.connect(TCP_PORT, TCP_HOST);

// Function to format and send commands to the legacy server
const sendCommand = (action, userId, ...productIds) => {
    // Construct the space-separated command string
    const commandString = `${action} ${userId} ${productIds.join(' ')}\n`;
    
    // Send the payload through the socket
    tcpClient.write(commandString);
};

module.exports = { sendCommand };