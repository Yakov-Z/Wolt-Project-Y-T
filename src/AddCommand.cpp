#pragma once
#include "ICommand.h"
#include "IDataRepository.h"
#include "IPersistanceData.h"
#include <string>
#include <vector>
#include "AddCommand.h"

AddCommand::AddCommand(IDataRepository& dataRepository, IPersistanceData& persistenceManager,
         const std::string& userId, const std::vector<std::string>& productIds)
    : dataRepository(dataRepository), persistenceManager(persistenceManager), userId(userId), productIds(productIds) {}
void AddCommand::execute() {
    persistenceManager.saveData({userId , productIds});
    dataRepository.addView(userId,productIds);
}