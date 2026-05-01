#include <gtest/gtest.h>
#include "Parser.h"
#include "ICommand.h"
#include <vector>
#include <string>

//check the parser on not real command
class notrealCommand : public ICommand {
public:
    void execute() override {
       
    }
};

//deal with empty line
TEST(InputParserTest, EmptyLine) {
    InputParser parser;
    ICommand* command = parser.parseNextCommand("");
    
    EXPECT_EQ(command, nullptr);
}

//deal with illegal command
TEST(InputParserTest, ilegalCommand) {
    InputParser parser;
    ICommand* command = parser.parseNextCommand("chikooooo");
    EXPECT_EQ(command, nullptr);
}

//deal with real command
TEST(InputParserTest, real_command) {
    InputParser parser;
    
    parser.mapCommand("Hapoel_command", [](const std::vector<std::string>& args) -> ICommand* {
        return new notrealCommand(); 
    });

    ICommand* command = parser.parseNextCommand("Hapoel_command 92 94");
    EXPECT_NE(command, nullptr);
    delete command;
}

//check if the arguments pass well to the function
TEST(InputParserTest, PassArguments) {
    InputParser parser;
    bool argsPass = false; 

   
    parser.mapCommand("real_command", [&argsPass](const std::vector<std::string>& args) -> ICommand* {
        
        if (args.size() == 2 && args[0] == "51" && args[1] == "4") {
            argsPass = true;
        }
        return new notrealCommand();
    });

    ICommand* command = parser.parseNextCommand("real_command 51 4");
    
    EXPECT_NE(command, nullptr);
    EXPECT_TRUE(argsPass);
    
    delete command;
}