#include <gtest/gtest.h>
#include <vector>
#include <string>
#include <memory>
#include <thread>
#include <chrono>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <filesystem>

#include "MemoryDataRepository.h"
#include "PostCommand.h"
#include "RecommendCommand.h"
#include "CommonUsersRecommend.h"
#include "ConsoleOutputWriter.h"
#include "SocketOutputWriter.h"
#include "ServerRunner.h"

// fake object fot the test
class FakePersistence : public IPersistanceData {
public:
    void saveData(const UserStorageRecord& data) override {} // Do nothing in memory test
    StorageDataList loadAllData() override { return {}; }
    void deleteData(const UserStorageRecord& data) override {}
};

// A silent writer to prevent console spam during testing
class SilentOutputWriter : public IOutputWriter {
public:
    void writeLine(const std::string& message) override {
        // Do nothing
    }  
    // Ensure virtual destructor is present to prevent undefined behavior
    virtual ~SilentOutputWriter() = default; 
};

TEST(IntegrationTest, Exe_Example) {
    
    FakePersistence fake;
    MemoryDataRepository repo(fake);
    SilentOutputWriter writer; 
   
    //insert the data
    PostCommand(repo, fake, "1",  {"100", "101", "102", "103"}, writer).execute();
    PostCommand(repo, fake, "2",  {"101", "102", "104", "105", "106"}, writer).execute();
    PostCommand(repo, fake, "3",  {"100", "104", "105", "107", "108"}, writer).execute();
    PostCommand(repo, fake, "4",  {"101", "105", "106", "107", "109", "110"}, writer).execute();
    PostCommand(repo, fake, "5",  {"100", "102", "103", "105", "108", "111"}, writer).execute();
    PostCommand(repo, fake, "6",  {"100", "103", "104", "110", "111", "112", "113"}, writer).execute();
    PostCommand(repo, fake, "7",  {"102", "105", "106", "107", "108", "109", "110"}, writer).execute();
    PostCommand(repo, fake, "8",  {"101", "104", "105", "106", "109", "111", "114"}, writer).execute();
    PostCommand(repo, fake, "9",  {"100", "103", "105", "107", "112", "113", "115"}, writer).execute();
    PostCommand(repo, fake, "10", {"100", "102", "105", "106", "107", "109", "110", "116"}, writer).execute();

    //Run Recommendation for User 1 on Product 104
    CommonUsersRecommend algo(repo, "1", "104");
    std::vector<std::string> recommendations = algo.recommend();

    //Comparing to the exercise Output
    std::vector<std::string> expected = {
        "105", "106", "111", "110", "112", "113", "107", "108", "109", "114"
    };

    ASSERT_EQ(recommendations.size(), expected.size());
    
    for(size_t i = 0; i < expected.size(); ++i) {
        EXPECT_EQ(recommendations[i], expected[i]);
    }
}

int runServerApp(int port);

TEST(IntegrationTest, FullSystemFlow) {
    std::filesystem::remove("/app/data/users_data.txt");

    int testPort = 777;

    // Run the entire server application in a background thread
    std::thread serverThread([testPort]() {
        ServerRunner runner;
        runner.run(testPort);
    });

    // Give the server a moment to start and bind to the port
    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    // Create a real client socket
    int clientSock = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_GE(clientSock, 0);

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr("127.0.0.1");
    sin.sin_port = htons(testPort);

    // Connect to our server
    int connectRes = connect(clientSock, (struct sockaddr*)&sin, sizeof(sin));
    ASSERT_EQ(connectRes, 0);

    std::string command = "HELP\n";
    send(clientSock, command.c_str(), command.length(), 0);

    // Receive the response from the server
    char buffer[2048] = {0};
    int bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);

    std::string helpText = "DELETE, arguments: [userid] [productid1] [productid2] …  \n"
                               "GET, arguments: [userid] [productid] \n"
                               "PATCH, arguments: [userid] [productid1] [productid2] …  \n"
                               "POST, arguments: [userid] [productid1] [productid2] …  \n"
                               "help";
    // Verify the output passed through the whole system correctly
    std::string response(buffer);
    EXPECT_EQ(response, helpText);

    command = "post 1 100\n";
    send(clientSock, command.c_str(), command.length(), 0);

    // Receive the response from the server
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "201 Created\n");

    command = "poSt 2 100 101\n";
    send(clientSock, command.c_str(), command.length(), 0);

    // Receive the response from the server
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "201 Created\n");

    command = "Get 1 100\n";
    send(clientSock, command.c_str(), command.length(), 0);

    // Receive the response from the server
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "200 Ok\n\n101");

    command = "delete 1 100\n";
    send(clientSock, command.c_str(), command.length(), 0);

    // Receive the response from the server
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "204 No Content\n");

    command = "get 1 100\n";
    send(clientSock, command.c_str(), command.length(), 0);

    // Receive the response from the server
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "200 Ok\n\n");

    command = "chiko 1000\n";
    send(clientSock, command.c_str(), command.length(), 0);

    // Receive the response from the server
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "400 Bad Request\n");

    // Cleanup
    close(clientSock);

    serverThread.detach();
}
