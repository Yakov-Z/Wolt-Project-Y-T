#pragma once
#include "InputParser.h"

class App {
private:
    InputParser& parser;

public:
    App(InputParser& parser);
    void run();
};