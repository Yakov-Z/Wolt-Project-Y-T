#pragma once
#include <string>
#include "IOutputWriter.h"


// Class that implements the IOutputWriter to write output to the console
class ConsoleOutputWriter : public IOutputWriter {
public:
    ConsoleOutputWriter();
    void writeLine(const std::string& text) override;
};