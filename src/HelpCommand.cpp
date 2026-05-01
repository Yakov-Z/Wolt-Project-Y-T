#include <iostream>
#include <string>
#include "HelpCommand.h"

HelpCommand::HelpCommand(IOutputWriter& outputWriter) : writer(outputWriter) {}
void HelpCommand::execute() {
    writer.writeLine("add [userid] [productid1] [productid2] ...\n"
                           "recommend [userid] [productid]\n"
                           "help\n");
}
