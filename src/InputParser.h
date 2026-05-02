#pragma once
#include <functional>
#include <vector>
#include <string>
#include <map>
#include "ICommand.h"


class InputParser {
private:
    std::map<std::string, std::function<ICommand*(const std::vector<std::string>&)>> CommandObjectCreate;

public:
    // gets a key(command), and map the function that creates the object
    void mapCommand(const std::string& name, std::function<ICommand*(const std::vector<std::string>&)> creator);

    // reads the next line and returns a new command pointer
    ICommand* parseNextCommand();
};