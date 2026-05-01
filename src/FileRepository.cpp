#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>
#include <cctype>
#include "FileRepository.h"


FileRepository::FileRepository(const std::string& path) : filePath(path) {}

void FileRepository::saveData(const UserStorageRecord& data) {
    // Open the file in append mode (std::ios::app)
    // This ensures we add the new user to the end of the file without deleting existing data
    std::ofstream outFile(filePath, std::ios::app);
    
    // If the file can't open, we stop to avoid crashing
    if (!outFile.is_open()) {
        return;
    }

    // Write the User ID first
    outFile << data.userId;
    
    // Add each product ID separated by a space
    for (std::string productId : data.products) {
        outFile << " " << productId;
    }        
    
    // New line for this user makes it easier to read the file later chiko
    outFile << "\n";
    
    // Close the file to flush the buffer and release the lock
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
            userData.userId = userIdStr;
        } else { 
            continue; // Skip the whole line if the User ID is not a valid number
        }
        
        std::string productStr;
        bool isUserValid = true;
        
        // Read the rest of the numbers (products) on the same line
        while(sLine >> productStr) {
            if(std::all_of(productStr.begin(), productStr.end(), ::isdigit)) {
                userData.products.push_back(productStr);
            } else { 
                // If one product is bad (like letters or negative), mark user as invalid
                isUserValid = false; 
                break; 
            }
        }
        
        // Only keep users that have at least one valid product
        if(isUserValid && !userData.products.empty()){
            allData.push_back(userData);
        }       
    }
    
    inFile.close();
    return allData;
}