#include "ICommand.h"
#include "IDataRepository.h"
#include "IPersistanceData.h"
#include <string>
#include <vector>
#include "DeleteCommand.h"
#include "IOutputWriter.h"

// Initializes the command's members using an initializer list.
DeleteCommand::DeleteCommand(IDataRepository& dataRepository, IPersistanceData& persistenceManager,
                             const std::string& userId, const std::vector<std::string>& productIds, 
                            IOutputWriter& writer)
    : dataRepository(dataRepository), persistenceManager(persistenceManager), 
      userId(userId), productIds(productIds), writer(writer) {}
// Executes the command by invoking the necessary methods on both the persistence and data managers.
void DeleteCommand::execute() {
    
    //check if the user delete products in the list
    if (!dataRepository.validDelete(userId, productIds)) {
        writer.writeLine("404 Not Found\n");
        return; 
    }
    // Saves data without the deleted products.
    persistenceManager.deleteData({userId , productIds});
    
    // Updates the in-memory data, without the deleted products.
    dataRepository.deleteView(userId,productIds);

    writer.writeLine("204 No Content\n");
}