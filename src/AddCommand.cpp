#pragma once
#include "ICommand.h"
#include "IDataRepository.h"
#include "IPersistanceData.h"
#include <string>
#include <vector>
#include "AddCommand.h"

// Initializes the command's members using an initializer list.
AddCommand::AddCommand(IDataRepository& dataRepository, IPersistanceData& persistenceManager,
         const std::string& userId, const std::vector<std::string>& productIds)
    : dataRepository(dataRepository), persistenceManager(persistenceManager), userId(userId), productIds(productIds) {}

// Executes the command by invoking the necessary methods on both the persistence and data managers.
void AddCommand::execute() {
    // Saves the raw data to the file/persistent storage first.
    persistenceManager.saveData({userId , productIds});
    
    // Updates the in-memory data repository to reflect the new views immediately.
    dataRepository.addView(userId,productIds);
}