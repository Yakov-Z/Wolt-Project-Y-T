#pragma once
#include "ICommand.h"
#include "IDataRepository.h"
#include "IPersistanceData.h"
#include <string>

class AddCommand : public ICommand {
private:
    IDataRepository& dataRepository;
    IPersistanceData& persistenceManager;
    std::string userId;
    std::vector<std::string> productIds;
public:
    AddCommand(IDataRepository& dataRepository, IPersistanceData& persistenceManager,
         const std::string& userId, const std::vector<std::string>& productIds);
    void execute() override;
};