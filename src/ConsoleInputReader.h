#pragma once
#include <string>
#include "IInputReader.h"

// Class that implements the IInputReader to read input from the console
class ConsoleInputReader : public IInputReader {
public:
    ConsoleInputReader();
    bool hasNext() override;
    std::string readLine() override;
};