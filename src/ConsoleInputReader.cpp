#include <iostream>
#include <string>
#include "ConsoleInputReader.h"

ConsoleInputReader::ConsoleInputReader() {}

bool ConsoleInputReader::hasNext() {
    return std::cin.peek() != EOF;
}
std::string ConsoleInputReader::readLine() {
    std::string input;
    std::getline(std::cin, input);
    return input;
}