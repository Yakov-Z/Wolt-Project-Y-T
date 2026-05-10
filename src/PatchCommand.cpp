
#pragma once
#include "ICommand.h"
#include "IDataRepository.h"
#include "IPersistanceData.h"
#include <string>
#include <vector>
#include "PatchCommand.h"
#include "IOutputWriter.h"

// Initializes the command's members using an initializer list.
PatchCommand::PatchCommand(IDataRepository& dataRepository, IPersistanceData& persistenceManager,
                             const std::string& userId, const std::vector<std::string>& productIds, 
                            IOutputWriter& writer)
    : dataRepository(dataRepository), persistenceManager(persistenceManager), 
      userId(userId), productIds(productIds), writer(writer) {}
// Executes the command by invoking the necessary methods on both the persistence and data managers.
void PatchCommand::execute() {

    //check if the user exist
    if (!dataRepository.userExists(userId)) {
        writer.writeLine("404 Not Found\n");
        return; 
        }


    // Saves the raw data to the file/persistent storage first.
    persistenceManager.saveData({userId , productIds});
    
    // Updates the in-memory data repository to reflect the new views immediately.
    dataRepository.postView(userId,productIds);

    writer.writeLine("204 No Content\n");
}