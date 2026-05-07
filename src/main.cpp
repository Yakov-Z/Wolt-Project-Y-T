#include <iostream>
#include <string>
#include <vector>
#include "InputParser.h"
#include "FileRepository.h"       
#include "MemoryDataRepository.h"   
#include "ConsoleOutputWriter.h" 
#include "AddCommand.h"
#include "RecommendCommand.h"
#include "HelpCommand.h"
#include "CommonUsersRecommend.h"
#include "ConsoleInputReader.h"
#include "App.h"
#include <filesystem>


int main() {
    // 1. Ensure the 'data' directory exists
    std::string dataDirPath = "/app/data";
    if (!std::filesystem::exists(dataDirPath)) {
        std::filesystem::create_directory(dataDirPath);
    }

    // 2. Pass the updated path including the directory
    std::string filePath = dataDirPath + "/users_data.txt";
    
    FileRepository persistenceManager(filePath);
    MemoryDataRepository dataRepository(persistenceManager); 
    dataRepository.loadDatatoMemory();
    ConsoleOutputWriter outputWriter;
    ConsoleInputReader inputReader;
   
    std::map<std::string, std::function<ICommand*(const std::vector<std::string>&)>> emptyMap;
    InputParser parser(emptyMap, inputReader);

    //map the add command
    parser.mapCommand("add", [&dataRepository, &persistenceManager](const std::vector<std::string>& args) -> ICommand* {
        //the user most to add at least 1 product
        if (args.size() < 2) return nullptr; 
     
        std::string userId = args[0];
        std::vector<std::string> productIds(args.begin() + 1, args.end());
        
        return new AddCommand(dataRepository, persistenceManager, userId, productIds);
    });

    //map the recommend command
    parser.mapCommand("GET", [&dataRepository, &outputWriter](const std::vector<std::string>& args) -> ICommand* {
        
        //thre is exactly 1 user ID and 1 productID
        if (args.size() != 2) return nullptr; 
       
        std::string userId = args[0];
        std::string productId = args[1];
        IRecommend* common = new CommonUsersRecommend(dataRepository, userId, productId);
        return new RecommendCommand(common, outputWriter);
    });

    //map the help command
    parser.mapCommand("help", [&outputWriter](const std::vector<std::string>& args) -> ICommand* {
        
        //the string of the command. we can easily add another text in the future
        std::string helpText = "DELETE, arguments: [userid] [productid1] [productid2] …  \n"
                               "GET, arguments: [userid] [productid] \n"
                               "patch, arguments: [userid] [productid1] [productid2] …  \n"
                               "post, arguments: [userid] [productid1] [productid2] …  \n"
                               "help";
                               
        return new HelpCommand(outputWriter, helpText);
    });

    
    App app(parser);
    app.run();

    return 0; 
}