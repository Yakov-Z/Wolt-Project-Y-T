#pragma once

// Interface for user commands
class ICommand {
public:
    // Executes the command
    virtual void execute() = 0;
    // Virtual destructor to ensure proper cleanup of derived classes.
    virtual ~ICommand() = default;
};