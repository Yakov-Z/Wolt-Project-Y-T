#include <iostream>
#include <string>
#include <vector>
#include "InputParser.h"
#include "App.h"
#include "FileRepository.h"       
#include "MemoryDataRepository.h"   
#include "ConsoleOutputWriter.h" 
#include "AddCommand.h"
#include "RecommendCommand.h"
#include "HelpCommand.h"
#include "CommonUsersRecommend.h"

int main() {
    
    FileRepository persistenceManager("users_data.txt");
    MemoryDataRepository dataRepository; 
    ConsoleOutputWriter outputWriter;
   
    InputParser parser;
    //map the add command
    parser.mapCommand("add", [&dataRepository, &persistenceManager](const std::vector<std::string>& args) -> ICommand* {
        //the user most to add at least 1 product
        if (args.size() < 2) return nullptr; 
     
        std::string userId = args[0];
        std::vector<std::string> productIds(args.begin() + 1, args.end());
        
        return new AddCommand(dataRepository, persistenceManager, userId, productIds);
    });

    //map the recommend command
    parser.mapCommand("recommend", [&dataRepository, &outputWriter](const std::vector<std::string>& args) -> ICommand* {
        
        //thre is exactly 1 user ID and 1 productID
        if (args.size() != 2) return nullptr; 
       
        std::string userId = args[0];
        std::string productId = args[1];
        IRecommend* common = new CommonUsersRecommend(dataRepository, userId, productId);
        
        return new RecommendCommand(*common, outputWriter);
    });

    //map the help command
    parser.mapCommand("help", [&outputWriter](const std::vector<std::string>& args) -> ICommand* {
        
        //the string of the command. we can easily add another text in the future
        std::string helpText = "add [userid] [productid1] [productid2] … \n"
                               "recommend [userid] [productid] \n"
                               "recommend [userid] [productid] \n"
                               "help";
                               
        return new HelpCommand(outputWriter, helpText);
    });

    
    App app(parser);
    app.run();

    return 0; 
}