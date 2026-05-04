#pragma once
#include <string>

// Interface for reading input from various sources (e.g., console, file, etc.)
class IInputReader {
public:
    // Checks if there is more input to read.
    virtual bool hasNext() = 0;
    // Reads a line of input and returns it as a string.
    virtual std::string readLine() = 0;
    // Virtual destructor to ensure proper cleanup of derived classes.
    virtual ~IInputReader() = default;
};