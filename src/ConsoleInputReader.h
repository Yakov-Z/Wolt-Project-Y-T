#pragma once
#include <string>
#include "IInputReader.h"

class ConsoleInputReader : public IInputReader {
public:
    ConsoleInputReader();
    bool hasNext() override;
    std::string readLine() override;
};