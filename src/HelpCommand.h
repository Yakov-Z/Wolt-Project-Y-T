#pragma once
#include "ICommand.h"
#include "IOutputWriter.h"

class HelpCommand : public ICommand {
private:
    IOutputWriter& writer;
public:
    HelpCommand(IOutputWriter& outputWriter);
    void execute() override;
};