#include <gtest/gtest.h>
#include "App.h"
#include "IInputReader.h"
#include "IOutputWriter.h"
#include "InputParser.h"
#include "ICommand.h"
#include <string>
#include <vector>
#include <map>
#include <functional>
#include <stdexcept>

// Define a type alias for the command map
using CommandMap = std::map<std::string, std::function<ICommand*(const std::vector<std::string>&)>>;

// Custom exception to break the infinite loop in App::run() during tests
class EndOfTestException : public std::runtime_error {
public:
    EndOfTestException() : std::runtime_error("End of test input") {}
};

// A smarter MockInputReader that can provide a sequence of inputs and then exit
class MockInputReader : public IInputReader {
public:
    std::vector<std::string> lines;
    size_t currentIndex = 0;

    bool hasNext() override {
        return true; 
    }

    std::string readLine() override {
        // Throw an exception when we run out of inputs to stop the infinite App loop
        if (currentIndex >= lines.size()) {
            throw EndOfTestException();
        }
        return lines[currentIndex++];
    }
};

// A simple MockOutputWriter to print output in tests
class MockOutputWriter : public IOutputWriter {
public:
    std::string capturedOutput = "";
    void writeLine(const std::string& message) override {
        capturedOutput += message;
    }
};

// A simple mock command to track if execute() was successfully called
class AppTestMockCommand : public ICommand {
private:
    bool& executedFlag;
public:
    AppTestMockCommand(bool& flag) : executedFlag(flag) {}
    void execute() override {
        executedFlag = true;
    }
};

// Test parsing and executing a valid mapped command
TEST(AppTest, StandartCommand) {
    MockInputReader reader;
    MockOutputWriter writer;
    // Queue the command we want to test
    reader.lines = {"good_command"}; 
    CommandMap emptyMap;
    InputParser parser(emptyMap, reader, writer);
    
    bool isExecuted = false;
    
    // Map our dummy command to change the boolean flag when executed
    parser.mapCommand("GOOD_COMMAND", [&isExecuted](const std::vector<std::string>& args) -> ICommand* {
        return new AppTestMockCommand(isExecuted);
    });

    App app(parser);
    
    // App::run() loops forever, so we expect our EndOfTestException to eventually be thrown
    EXPECT_THROW(app.run(), EndOfTestException);
    
    // Verify the command was actually executed before the loop ended
    EXPECT_TRUE(isExecuted);
}

// Test how App handles an unmapped/bad command
TEST(AppTest, BadCommand) {
    MockInputReader reader;
    MockOutputWriter writer;
    // Queue an illegal command
    reader.lines = {"bad_command_that_does_not_exist"}; 
    CommandMap emptyMap;
    InputParser parser(emptyMap, reader, writer);
    App app(parser);
    
    // We expect it to ignore the bad command (continue) and try to read again, throwing our exception
    EXPECT_THROW(app.run(), EndOfTestException);
}

// Test how App handles an empty input
TEST(AppTest, EmptyCommand) {
    MockInputReader reader;
    MockOutputWriter writer;
    // Queue an empty string
    reader.lines = {""}; 
    CommandMap emptyMap;
    InputParser parser(emptyMap, reader, writer);
    App app(parser);
    
    // We expect it to ignore the empty line (continue) and try to read again
    EXPECT_THROW(app.run(), EndOfTestException);
}