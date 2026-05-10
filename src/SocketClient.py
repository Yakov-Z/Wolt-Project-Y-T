import socket
import sys

#exit if we not get IP or port
if len(sys.argv) < 3:
    sys.exit()

dest_ip = sys.argv[1]
dest_port = int(sys.argv[2])

#open socket with the IP and the port
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((dest_ip, dest_port))
    
#get command from the user
msg = input()
#send the command to the server
s.send((msg + "\n").encode('utf-8'))
#get answer from the server
data = s.recv(4096) 

   #while there is a answer from the server:
while not data == b'': 

    #print the answer
    print(data.decode('utf-8'), end="")
    
    #get the next command from the user
    msg = input()
    #send the command to the server
    s.send((msg + "\n").encode('utf-8'))
    #get answer from the server
    data = s.recv(4096)

#close the socket
s.close()