#pragma once
#include <string>


// Interface for writing output to some destination, without knowing where
class IOutputWriter {
public:
    // Writes a line of output
    virtual void writeLine(const std::string& text) = 0;
    
    // Virtual destructor for prevent memory leak
    virtual ~IOutputWriter() = default;
};