#pragma once
#include <string>

class IInputReader {
public:
    virtual bool hasNext() = 0;
    virtual std::string readLine() = 0;
    virtual ~IInputReader() = default;
};