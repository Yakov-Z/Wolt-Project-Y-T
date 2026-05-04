#pragma once
#include <string>
#include <fstream>
#include "IPersistanceData.h"

/**
 * FileRepository handles saving and loading user data from a text file.
 * It implements the IPersistanceData interface to keep the storage logic 
 * separate from the rest of the application.
 */
class FileRepository : public IPersistanceData {
private:
    std::string filePath; // Path to the text file

public:
    // Prevents the compiler from accidentally converting a string to a FileRepository
    explicit FileRepository(const std::string& path);

    // Saves the list to the file, overwriting any old data
    void saveData(const UserStorageRecord& data);

    // Reads the file and returns a list of valid users and their products
    StorageDataList loadAllData();
};