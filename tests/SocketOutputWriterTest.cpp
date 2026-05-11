#include <gtest/gtest.h>
#include <thread>
#include <chrono>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string>
#include "SocketOutputWriter.h"

TEST(SocketOutputWriterTest, standardOutput) {
    int sockets[2];

    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    ASSERT_EQ(result, 0);

    int sockClientSide = sockets[0];
    int sockServerSide = sockets[1];

    SocketOutputWriter writer(sockServerSide);
    writer.writeLine("first massage\nsecond massage\n");

    struct timeval tv;
    tv.tv_sec = 0;           
    tv.tv_usec = 500000;     
    setsockopt(sockClientSide, SOL_SOCKET, SO_RCVTIMEO, (const char*)&tv, sizeof(tv));

    char buffer[1024] = {0};
    int bytesRead = recv(sockClientSide, buffer, sizeof(buffer) - 1, 0);

    ASSERT_GT(bytesRead, 0);
    EXPECT_EQ(std::string(buffer), "first massage\nsecond massage\n");

    close(sockets[0]);
    close(sockets[1]);
}

TEST(SocketOutputWriterTest, emptyOutput) {
    int sockets[2];

    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    ASSERT_EQ(result, 0);

    int sockClientSide = sockets[0];
    int sockServerSide = sockets[1];

    SocketOutputWriter writer(sockServerSide);
    writer.writeLine("");

    struct timeval tv;
    tv.tv_sec = 0;           
    tv.tv_usec = 500000;     
    setsockopt(sockClientSide, SOL_SOCKET, SO_RCVTIMEO, (const char*)&tv, sizeof(tv));

    char buffer[1024] = {0};
    int bytesRead = recv(sockClientSide, buffer, sizeof(buffer) - 1, 0);

    EXPECT_EQ(bytesRead, -1);

    close(sockets[0]);
    close(sockets[1]);
}

TEST(SocketOutputWriterTest, clientDisconnect) {
    int sockets[2];

    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    ASSERT_EQ(result, 0);

    int sockClientSide = sockets[0];
    int sockServerSide = sockets[1];

    SocketOutputWriter writer(sockServerSide);

    close(sockets[0]);

    EXPECT_ANY_THROW(writer.writeLine("hello\n"));
    
    close(sockets[1]);
}

TEST(SocketOutputWriterTest, hugeOutput) {
    int sockets[2];

    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    ASSERT_EQ(result, 0);

    int sockClientSide = sockets[0];
    int sockServerSide = sockets[1];

    std::string hugeMessage(100000, 'A');
    hugeMessage += "\n";

    SocketOutputWriter writer(sockServerSide);
    writer.writeLine(hugeMessage);

    struct timeval tv;
    tv.tv_sec = 0;           
    tv.tv_usec = 500000;     
    setsockopt(sockClientSide, SOL_SOCKET, SO_RCVTIMEO, (const char*)&tv, sizeof(tv));
    
    int BytesRead = 0;
    char buffer[4096];
    
    while (BytesRead < 100001) {
        int bytes = recv(sockClientSide, buffer, sizeof(buffer), 0);
        if (bytes <= 0) break;
        BytesRead += bytes;
    }

    EXPECT_EQ(BytesRead, 100001);

    close(sockets[0]);
    close(sockets[1]);
}
