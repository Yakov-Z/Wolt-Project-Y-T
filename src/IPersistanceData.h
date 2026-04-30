#pragma once
#include <vector>

/**
 * @brief A simple data container for a user's watched products.
 * Why: Decouples the raw data from memory structures like std::map, 
 * making it easy to change how data is stored or transferred later.
 */
struct UserStorageRecord {
    int userId;
    std::vector<int> products;
};

/**
 * @brief A list of user records.
 */
using StorageDataList = std::vector<UserStorageRecord>;

/**
 * @brief Interface for saving and loading data.
 * Why: Separates the recommendation logic from file operations, 
 * keeping the system flexible for future storage changes (e.g., Database).
 */
class IPersistanceDataRepository {
public:
    virtual ~IPersistanceDataRepository() = default;

    /**
     * @brief Saves a single user's record to storage, by overwriting the entire data.
     * Why: Called automatically after every 'add' command to ensure no data is lost.
     * @param record The entire updated data.
     */
    virtual void saveData(const StorageDataList& data) = 0;
   
    /**
     * @brief Loads all user records from storage.
     * Why: Called once during application startup to rebuild the system's memory state.
     * @return A list of all records. Returns an empty list if storage is empty.
     */
    virtual StorageDataList loadAllData() = 0;
};