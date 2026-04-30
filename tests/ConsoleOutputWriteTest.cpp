#include <gtest/gtest.h>
#include <sstream>
#include <iostream>
#include "ConsoleOutputWriter.h"

// First test: write standard recommendation line
TEST(ConsoleOutputWriterTest, StandardWrite) {
    // Create our string to write the output
    std::stringstream testConsoleOutput;
    // Save the original buffer of cout, for restoring later
    std::streambuf* originalCoutBuffer = std::cout.rdbuf();
    // Change the buffer of cout to our stringstream buffer for testing
    std::cout.rdbuf(testConsoleOutput.rdbuf());

    // -- Start class test --
    ConsoleOutputWriter writer;
    
    // Expect the writer to output the string
    writer.writeLine("4 51 11");
    
    EXPECT_EQ(testConsoleOutput.str(), "4 51 11\n");

    // Restore the original buffer of cout
    std::cout.rdbuf(originalCoutBuffer);
}

// Second test: write help menu like the example
TEST(ConsoleOutputWriterTest, Help_Write) {
    // Create our string to catch the output
    std::stringstream testConsoleOutput;
    // Save the original buffer of cout, for restoring later
    std::streambuf* originalCoutBuffer = std::cout.rdbuf();
    // Change the buffer of cout to our stringstream buffer for testing
    std::cout.rdbuf(testConsoleOutput.rdbuf());

    // -- Start class test --
    ConsoleOutputWriter writer;
    
    //Write the exact string from the assignment
    std::string helpText = "add [userid] [productid1] [productid2] ...\n"
                           "recommend [userid] [productid]\n"
                           "help";
                           
    writer.writeLine(helpText);
    
    EXPECT_EQ(testConsoleOutput.str(), helpText + "\n");

    // Restore the original buffer of cout
    std::cout.rdbuf(originalCoutBuffer);
}

// Third test: check that the program don't print trash when getting empty line
TEST(ConsoleOutputWriterTest, EmptyWrite) {
    // Create our string to write the output
    std::stringstream fakeConsoleOutput;
    // Save the original buffer of cout, for restoring later
    std::streambuf* originalCoutBuffer = std::cout.rdbuf();
    // Change the buffer of cout to our stringstream buffer for testing
    std::cout.rdbuf(fakeConsoleOutput.rdbuf());

    // -- Start class test --
    ConsoleOutputWriter writer;
    
    // Expect to write an empty string
    writer.writeLine("");
    
    EXPECT_EQ(fakeConsoleOutput.str(), "\n");

    // Restore the original buffer of cout
    std::cout.rdbuf(originalCoutBuffer);
}

