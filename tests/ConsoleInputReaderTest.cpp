#include <gtest/gtest.h>
#include <sstream>
#include <iostream>
#include "ConsoleInputReader.h"

// First test: read standart lines
TEST(ConsoleInputReaderTest, StandartRead) {
    // Create our test string as a stream
    std::stringstream fakeKeyboardInput("hello world\ntest line 2\n");
    // Save the original buffer of cin, for restoring later
    std::streambuf* originalCinBuffer = std::cin.rdbuf();
    // Change the buffer of cin to our stringstream buffer for testing
    std::cin.rdbuf(fakeKeyboardInput.rdbuf());

    // -- Start class test --
    ConsoleInputReader reader;
    
    // Expect to read and check the 2 lines correctly
    EXPECT_TRUE(reader.hasNext());

    EXPECT_EQ(reader.readLine(), "hello world");
    
    EXPECT_TRUE(reader.hasNext());

    EXPECT_EQ(reader.readLine(), "test line 2");
    
    EXPECT_FALSE(reader.hasNext());

    // Restore the original buffer of cin
    std::cin.rdbuf(originalCinBuffer);
}

// Second test: don't read empty lines
TEST(ConsoleInputReaderTest, EmptyRead) {
    // Create our empty string as a stream
    std::stringstream emptyInput("");
    // Save the original buffer of cin, for restoring later
    std::streambuf* originalCinBuffer = std::cin.rdbuf();
    // Change the buffer of cin to our stringstream buffer for testing
    std::cin.rdbuf(emptyInput.rdbuf());

    // -- Start class test --
    ConsoleInputReader reader;
    
    // Expect to not read any lines and return empty string
    EXPECT_FALSE(reader.hasNext());
    EXPECT_EQ(reader.readLine(), "");
    // Restore the original buffer of cin
    std::cin.rdbuf(originalCinBuffer);
}

// Third test: read lines with only whitespace
TEST(ConsoleInputReaderTest, HandlesWhitespaceOnly) {
    // Create our whitespace string as a stream
    std::stringstream whitespaceInput("   \n");
    // Save the original buffer of cin, for restoring later
    std::streambuf* originalCinBuffer = std::cin.rdbuf();
    // Change the buffer of cin to our stringstream buffer for testing
    std::cin.rdbuf(whitespaceInput.rdbuf());

    // -- Start class test --
    ConsoleInputReader reader;
    
    // Expect to read the line with whitespace and then no more lines   
    EXPECT_TRUE(reader.hasNext());
    EXPECT_EQ(reader.readLine(), "   ");
    EXPECT_FALSE(reader.hasNext());

    // Restore the original buffer of cin
    std::cin.rdbuf(originalCinBuffer);
}