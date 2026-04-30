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
    
    // If the file can't open, we stop to avoid crashing
    if (!outFile.is_open()) {
        return;
    }

    for (const auto& userRecord : allData) {
        // Write the User ID first
        outFile << userRecord.userId;
        
        // Add each product ID separated by a space
        for (int productId : userRecord.products) {
            outFile << " " << productId;
        }        
        // New line for each user makes it easier to read the file later
        outFile << "\n";
    }    
    outFile.close();
}

StorageDataList FileRepository::loadAllData() {
    StorageDataList allData;
    std::ifstream inFile(filePath);
    
    // If file doesn't exist, we just return an empty list
    if (!inFile.is_open()) {
        return allData; 
    }
    
    std::string line;
    // Read the file line by line
    while (std::getline(inFile, line)) {
        UserStorageRecord userData;
        std::stringstream sLine(line);
        std::string userIdStr;
        
        // Use '>>' to get the first word and check if it is a positive number
        if(sLine >> userIdStr && std::all_of(userIdStr.begin(), userIdStr.end(), ::isdigit)){
            userData.userId = std::stoi(userIdStr);
        } else { 
            continue; // Skip the whole line if the User ID is not a valid number
        }
        
        std::string productStr;
        bool isUserValid = true;
        
        // Read the rest of the numbers (products) on the same line
        while(sLine >> productStr) {
            if(std::all_of(productStr.begin(), productStr.end(), ::isdigit)) {
                userData.products.insert(std::stoi(productStr));
            } else { 
                // If one product is bad (like letters or negative), mark user as invalid
                isUserValid = false; 
                break; 
            }
        }
        
        // Only keep users that have at least one valid product
        if(isUserValid && !userData.products.empty()){
            allData.insert(userData);
        }       
    }
    
    inFile.close();
    return allData;
}