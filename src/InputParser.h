#pragma once
#include <functional>
#include <vector>
#include <string>
#include <map>
#include "ICommand.h"
#include "IInputReader.h"


class InputParser {
private:
    std::map<std::string, std::function<ICommand*(const std::vector<std::string>&)>> CommandObjectCreate;
    IInputReader& reader;

public:
    InputParser(std::map<std::string, std::function<ICommand*(const std::vector<std::string>&)>> commandMap, IInputReader& inputReader);
    // gets a key(command), and map the function that creates the object
    void mapCommand(const std::string& name, std::function<ICommand*(const std::vector<std::string>&)> creator);

    // reads the next line and returns a new command pointer
    ICommand* parseNextCommand();
};