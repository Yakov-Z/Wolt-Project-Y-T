#include <gtest/gtest.h>
#include "InputParser.h"
#include "ICommand.h"
#include <vector>
#include <string>
#include <sstream> 
#include <map>
#include <functional>
#include "IInputReader.h"

// Define a type alias for the command map to make the code cleaner
using CommandMap = std::map<std::string, std::function<ICommand*(const std::vector<std::string>&)>>;

// Simulate getting input from the user
class FakeInputReader : public IInputReader {
private:
    std::istringstream stream;
    std::string nextLine;
    bool hasNextLine;

public:
    explicit FakeInputReader(const std::string& simulatedInput) {
        // Initialize the stream with the simulated input
        stream.str(simulatedInput);
        // Pre-fetch the first line to determine if input exists
        hasNextLine = (bool)std::getline(stream, nextLine);
    }
    
    // Check if there is more input to read
    bool hasNext() override {
        return hasNextLine;
    }

    // Read a line of input and return it as a string
    std::string readLine() override {
        std::string currentLine = nextLine;
        hasNextLine = (bool)std::getline(stream, nextLine);
        return currentLine;
    }
};

// Dummy command for testing the parser
class MockCommand : public ICommand {
public:
    void execute() override {}
};

// Test handling of an empty line
TEST(InputParserTest, EmptyLine) {
    FakeInputReader fake("");
    CommandMap emptyMap;
    // Pass the map first, then the reader
    InputParser parser(emptyMap, fake); 
    
    ICommand* command = parser.parseNextCommand();
    
    EXPECT_EQ(command, nullptr);
}

// Test handling of an illegal or unmapped command
TEST(InputParserTest, IllegalCommand) {
    FakeInputReader fake("chikooooo");
    CommandMap emptyMap;
    // Pass the map first, then the reader
    InputParser parser(emptyMap, fake); 
    
    ICommand* command = parser.parseNextCommand(); 
    
    EXPECT_EQ(command, nullptr);
}

// Test parsing of a valid mapped command
TEST(InputParserTest, RealCommand) {
    FakeInputReader fake("test_command 92 94"); 
    CommandMap commands;
    // Pass the map first, then the reader
    InputParser parser(commands, fake); 
    
    // Map the command before parsing
    parser.mapCommand("test_command", [](const std::vector<std::string>& args) -> ICommand* {
        return new MockCommand(); 
    });

    ICommand* command = parser.parseNextCommand(); 
    
    EXPECT_NE(command, nullptr);
    delete command;
}

// Test if arguments are correctly passed to the command creator
TEST(InputParserTest, PassArguments) {
    FakeInputReader fake("test_command 51 4"); 
    CommandMap commands;
    // Pass the map first, then the reader
    InputParser parser(commands, fake); 
    
    bool argsPass = false; 

    parser.mapCommand("test_command", [&argsPass](const std::vector<std::string>& args) -> ICommand* {
        // Check sizes and values inside the mapped command
        if (args.size() == 2 && args[0] == "51" && args[1] == "4") {
            argsPass = true;
        }
        return new MockCommand();
    });

    ICommand* command = parser.parseNextCommand(); 
    
    EXPECT_NE(command, nullptr);
    EXPECT_TRUE(argsPass);
    
    delete command;
}