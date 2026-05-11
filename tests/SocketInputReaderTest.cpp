#include <gtest/gtest.h>
#include <thread>
#include <chrono>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string>
#include "SocketInputReader.h"

TEST(SocketInputReaderTest, standardInput) {
    int sockets[2];

    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    ASSERT_EQ(result, 0);

    int sockClientSide = sockets[0];
    int sockServerSide = sockets[1];

    SocketInputReader reader(sockServerSide);
    std::string fakeInput = "first command\nsecond command\n";
    send(sockClientSide, fakeInput.c_str(), fakeInput.length(), 0);

    bool hasNext = reader.hasNext();
    EXPECT_EQ(hasNext, true);
    std::string line = reader.readLine();
    EXPECT_EQ(line, "first command");
    hasNext = reader.hasNext();
    EXPECT_EQ(hasNext, true);
    line = reader.readLine();
    EXPECT_EQ(line, "second command");

    close(sockets[0]);
    close(sockets[1]);
}

TEST(SocketInputReaderTest, halfInput) {
    int sockets[2];

    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    ASSERT_EQ(result, 0);

    int sockClientSide = sockets[0];
    int sockServerSide = sockets[1];

    SocketInputReader reader(sockServerSide);
    std::string fakeInput = "first ";
    send(sockClientSide, fakeInput.c_str(), fakeInput.length(), 0);

    fakeInput = "command\n";
    send(sockClientSide, fakeInput.c_str(), fakeInput.length(), 0);

    bool hasNext = reader.hasNext();
    EXPECT_EQ(hasNext, true);
    std::string line = reader.readLine();
    EXPECT_EQ(line, "first command");

    close(sockets[0]);
    close(sockets[1]);
}

TEST(SocketInputReaderTest, ClientDisconnect) {
    int sockets[2];

    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    ASSERT_EQ(result, 0);

    int sockClientSide = sockets[0];
    int sockServerSide = sockets[1];

    SocketInputReader reader(sockServerSide);
    close(sockets[0]);

    bool hasNext = reader.hasNext();
    EXPECT_FALSE(hasNext);

    close(sockets[1]);
}

TEST(SocketInputReaderTest, PartsOfCommands) {
    int sockets[2];

    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    ASSERT_EQ(result, 0);

    int sockClientSide = sockets[0];
    int sockServerSide = sockets[1];

    SocketInputReader reader(sockServerSide);
    std::string fakeInput = "full command\nanother ";
    send(sockClientSide, fakeInput.c_str(), fakeInput.length(), 0);

    bool hasNext = reader.hasNext();
    EXPECT_TRUE(hasNext);
    std::string line = reader.readLine();
    EXPECT_EQ(line, "full command");

    fakeInput = "command\n";
    send(sockClientSide, fakeInput.c_str(), fakeInput.length(), 0);

    hasNext = reader.hasNext();
    EXPECT_TRUE(hasNext);
    line = reader.readLine();
    EXPECT_EQ(line, "another command");

    close(sockets[0]);
    close(sockets[1]);
}
