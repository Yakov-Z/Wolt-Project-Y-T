#include <gtest/gtest.h>
#include "InputParser.h"
#include "ICommand.h"
#include <vector>
#include <string>
#include <sstream> 
#include "IInputReader.h"

// simulate get input from the user
class FakeInputReader : public IInputReader {
private:
    std::istringstream stream;

public:
    explicit FakeInputReader(const std::string& simulatedInput) {
        // \n in the end to simulate the enter
        stream.str(simulatedInput + "\n"); 
    }
    
    bool readLine(std::string& outLine) override {
        if (std::getline(stream, outLine)) {
            return true; 
        }
        return false; 
    }
};

//check the parser on not real command
class notrealCommand : public ICommand {
public:
    void execute() override {}
};


//deal with empty line
TEST(InputParserTest, EmptyLine) {
    FakeInputReader fake("");
    InputParser parser(&fake); // Fixed: fake instead of fakeReader
    
    ICommand* command = parser.parseNextCommand();
    
    EXPECT_EQ(command, nullptr);
}

//deal with illegal command
TEST(InputParserTest, ilegalCommand) {
    FakeInputReader fake("chikooooo");
    InputParser parser(&fake); // Fixed: fake instead of fakeReader
    
    ICommand* command = parser.parseNextCommand(); // Fixed: removed arguments
    
    EXPECT_EQ(command, nullptr);
}

//deal with real command
TEST(InputParserTest, real_command) {
    FakeInputReader fake("Hapoel_command 92 94"); // Put the full command here
    InputParser parser(&fake); 
    
    // Moved mapping to happen AFTER parser is initialized
    parser.mapCommand("Hapoel_command", [](const std::vector<std::string>& args) -> ICommand* {
        return new notrealCommand(); 
    });

    ICommand* command = parser.parseNextCommand(); // Fixed: read from the fake reader
    
    EXPECT_NE(command, nullptr);
    delete command;
}

//check if the arguments pass well to the function
TEST(InputParserTest, PassArguments) {
    FakeInputReader fake("real_command 51 4"); // Added the FakeInputReader
    InputParser parser(&fake); // Injected the reader
    
    bool argsPass = false; 

    parser.mapCommand("real_command", [&argsPass](const std::vector<std::string>& args) -> ICommand* {
        // Checking sizes and values inside the mapped command
        if (args.size() == 2 && args[0] == "51" && args[1] == "4") {
            argsPass = true;
        }
        return new notrealCommand();
    });

    ICommand* command = parser.parseNextCommand(); // Fixed call
    
    EXPECT_NE(command, nullptr);
    EXPECT_TRUE(argsPass);
    
    delete command;
}