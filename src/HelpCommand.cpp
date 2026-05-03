#include <iostream>
#include <string>
#include "HelpCommand.h"

HelpCommand::HelpCommand(IOutputWriter& outputWriter, const std::string& text) :
 writer(outputWriter), helpText(text) {}
void HelpCommand::execute() {
    writer.writeLine(helpText);
}
