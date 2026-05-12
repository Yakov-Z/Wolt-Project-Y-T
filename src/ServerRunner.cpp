#include <iostream>
#include <string>
#include <vector>
#include "InputParser.h"
#include "FileRepository.h"       
#include "MemoryDataRepository.h"   
#include "ConsoleOutputWriter.h" 
#include "DeleteCommand.h"
#include "RecommendCommand.h"
#include "HelpCommand.h"
#include "PatchCommand.h"
#include "PostCommand.h"
#include "CommonUsersRecommend.h"
#include "ConsoleInputReader.h"
#include "App.h"
#include "SingleSocketServer.h"
#include "SocketInputReader.h"
#include "SocketOutputWriter.h"
#include <filesystem>
#include "ServerRunner.h"

int ServerRunner::run(int port) {
    // Establish the network connection and wait for a client to connect
    SingleSocketServer server(port);
    server.runServer();
    int clientSock = server.getClientSocket();

    // Verify the existence of the data directory to prevent persistent storage errors
    std::string dataDirPath = "/app/data";
    if (!std::filesystem::exists(dataDirPath)) {
        std::filesystem::create_directory(dataDirPath);
    }
    std::string filePath = dataDirPath + "/users_data.txt";
    
    // Set up the data layer, loading existing disk data into the fast memory cache
    FileRepository persistenceManager(filePath);
    MemoryDataRepository dataRepository(persistenceManager); 
    dataRepository.loadDatatoMemory();

    // Bind the input and output streams directly to the connected client socket
    SocketOutputWriter outputWriter(clientSock);
    SocketInputReader inputReader(clientSock);
   
    std::map<std::string, std::function<ICommand*(const std::vector<std::string>&)>> emptyMap;
    InputParser parser(emptyMap, inputReader, outputWriter);

    // Map the DELETE command. Requires validation to ensure target products are specified.
    parser.mapCommand("DELETE", [&dataRepository, &persistenceManager, &outputWriter](const std::vector<std::string>& args) -> ICommand* {
        if (args.size() < 2) return nullptr; 
        std::string userId = args[0];
        std::vector<std::string> productIds(args.begin() + 1, args.end());
        return new DeleteCommand(dataRepository, persistenceManager, userId, productIds, outputWriter);
    });

    // Map the PATCH command. Requires validation to ensure products are provided for the update.
    parser.mapCommand("PATCH", [&dataRepository, &persistenceManager, &outputWriter](const std::vector<std::string>& args) -> ICommand* {
        if (args.size() < 2) return nullptr; 
        std::string userId = args[0];
        std::vector<std::string> productIds(args.begin() + 1, args.end());
        return new PatchCommand(dataRepository, persistenceManager, userId, productIds, outputWriter);
    });

    // Map the POST command. Requires validation to ensure products are provided for insertion.
    parser.mapCommand("POST", [&dataRepository, &persistenceManager, &outputWriter](const std::vector<std::string>& args) -> ICommand* {
        if (args.size() < 2) return nullptr; 
        std::string userId = args[0];
        std::vector<std::string> productIds(args.begin() + 1, args.end());
        return new PostCommand(dataRepository, persistenceManager, userId, productIds, outputWriter);
    });

    // Map the GET command. Expects strictly one user ID and one product ID to trigger recommendations.
    parser.mapCommand("GET", [&dataRepository, &outputWriter](const std::vector<std::string>& args) -> ICommand* {
        if (args.size() != 2) return nullptr; 
        std::string userId = args[0];
        std::string productId = args[1];
        IRecommend* common = new CommonUsersRecommend(dataRepository, userId, productId);
        return new RecommendCommand(common, outputWriter);
    });

    // Map the HELP command. Returns a static string detailing available server operations.
    parser.mapCommand("HELP", [&outputWriter](const std::vector<std::string>& args) -> ICommand* {
        std::string helpText = "DELETE, arguments: [userid] [productid1] [productid2] …  \n"
                               "GET, arguments: [userid] [productid] \n"
                               "PATCH, arguments: [userid] [productid1] [productid2] …  \n"
                               "POST, arguments: [userid] [productid1] [productid2] …  \n"
                               "help";
        return new HelpCommand(outputWriter, helpText);
    });
    
    // Inject the fully configured parser into the application and start processing client requests
    App app(parser);
    app.run();

    return 0; 
}