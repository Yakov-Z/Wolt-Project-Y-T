
#pragma once
#include "ICommand.h"
#include "IDataRepository.h"
#include "IPersistanceData.h"
#include "IOutputWriter.h"
#include <string>

/**
 * DeleteCommand encapsulates the action of deleting a list of products viewed by a user.
 * It implements the ICommand interface to allow execution without the caller knowing the details.
 */
class DeleteCommand : public ICommand {
private:
    // References to the data managers injected into the command.
    IDataRepository& dataRepository;
    IPersistanceData& persistenceManager;
    
    // Command state: the specific data needed to execute this action.
    std::string userId;
    std::vector<std::string> productIds;
    IOutputWriter& writer;

public:
    // Constructor that initializes the command with its dependencies and arguments.
    DeleteCommand(IDataRepository& dataRepository, IPersistanceData& persistenceManager,
         const std::string& userId, const std::vector<std::string>& productIds,IOutputWriter& writer);
         
    // Executes the actual logic of deleting the products.
    void execute() override;
};