#include "InputParser.h"
#include "ICommand.h"
#include <iostream>
#include <sstream>
#include <vector>
#include <algorithm>
#include <cctype>

InputParser::InputParser(std::map<std::string, std::function<ICommand*(const std::vector<std::string>&)>> commandMap, IInputReader& inputReader, IOutputWriter& outputwriter)
    : CommandObjectCreate(std::move(commandMap)), reader(inputReader), writer(outputwriter) {}

void InputParser::mapCommand(const std::string& name, std::function<ICommand*(const std::vector<std::string>&)> creator) {
    CommandObjectCreate[name] = creator;
}

ICommand* InputParser::parseNextCommand() {
    
    if (!reader.hasNext()) {
        return nullptr;
    }
    std:: string line=reader.readLine();
    
    // Check if the line contains a tab character
    // If it does, it's an illegal command format, return null
    if (line.find('\t') != std::string::npos) {
        return nullptr; 
    }
    
    std::stringstream Words_Line(line);
    std::string commandName;
    // First word is the command
    Words_Line >> commandName; 

    std::transform(commandName.begin(), commandName.end(), commandName.begin(), ::toupper);

    std::vector<std::string> words;
    std::string word;
    
    // Extract the rest of the words into the words vector
    while (Words_Line >> word) {
        words.push_back(word);
    }

    // Look for the command in our dictionary
    auto iterator = CommandObjectCreate.find(commandName);
    if (iterator != CommandObjectCreate.end()) {
        // Execute the lambda function and return the new ICommand*
        return iterator->second(words); 
    }
    //no exist command
    writer.writeLine("400 Bad Request\n"); 
    return nullptr;
}