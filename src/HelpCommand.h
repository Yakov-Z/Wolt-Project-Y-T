#pragma once
#include "ICommand.h"
#include "IOutputWriter.h"
#include <string>

class HelpCommand : public ICommand {
private:
    IOutputWriter& writer;
    const std::string& helpText;
public:
    HelpCommand(IOutputWriter& outputWriter, const std::string& helpText);
    void execute() override;
};