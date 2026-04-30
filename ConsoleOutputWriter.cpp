#include <iostream>
#include <string>
#include "ConsoleOutputWriter.h"

ConsoleOutputWriter::ConsoleOutputWriter() {}

void ConsoleOutputWriter::writeLine(const std::string& text) {
    // Prints the text, go one line above and clean the  buffer
    std::cout << text << std::endl;
}