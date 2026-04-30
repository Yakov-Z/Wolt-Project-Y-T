#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>
#include <cctype>
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
    StorageDataList Alldata;
    std::ifstream inFile(filePath);
    if (!inFile.is_open()) {
        return Alldata; 
    }
    std::string line;
    
    while (std::getline(inFile, line)) {
        UserStorageRecord userData;
        std::stringstream sLine(line);
        std::string userId;
        if(sLine >> userId && std::all_of(userId.begin(), userId.end(), ::isdigit)){
            userData.userId = std::stoi(userId);
        } else { continue; }
        std::string product;
        bool isUserValid = true;
        while(sLine >> product) {
            if(std::all_of(product.begin(), product.end(), ::isdigit)) {
                userData.products.push_back(std::stoi(product));
            } else { isUserValid = false; break; }
        }
        if(isUserValid && userData.products.size() != 0){
            Alldata.push_back(userData);
        }       
    }
    
    inFile.close();

    return Alldata;
}