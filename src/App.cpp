#include "InputParser.h"
#include "App.h"
#include "ICommand.h"

App::App(InputParser& parser) : parser(parser) {}

void App::run() {
    while(true) {
        ICommand* command = parser.parseNextCommand();
        if(!command) {
            continue;
        }
        command->execute();
    }
}