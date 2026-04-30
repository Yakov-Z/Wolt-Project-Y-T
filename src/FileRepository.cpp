#include <iostream>
#include <fstream>
#include <string>
#include "FileRepository.h"

FileRepository::FileRepository(const std::string& path) : filePath(path) {}

void FileRepository::saveData(const StorageDataList& allData) {
    std::ofstream outFile(filePath);
    // Check if the file opened successfully before attempting to write
    if (!outFile.is_open()) {
        return;
    }

    // Iterate over the user's data to save it to a file.
    for (const auto& userRecord : allData) {
        // Write the user ID directly to the stream
        outFile << userRecord.userId;
        
        // Iterate over the products and write them with a leading space
        for (int productId : userRecord.products) {
            outFile << " " << productId;
        }        
        // End the line for the current user
        outFile << "\n";
    }    
    // Close the file to flush the buffer and release the lock
    outFile.close();
}

StorageDataList FileRepository::loadAllData() {
    std::ifstream outFile(filePath);
}