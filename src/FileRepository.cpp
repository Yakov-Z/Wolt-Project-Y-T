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
    
    // New line for this user makes it easier to read the file later
    outFile << "\n";
    
    // Close the file to flush the buffer and release the lock
    outFile.close();
}

void FileRepository::deleteData(const UserStorageRecord& data) {
    //open the file for reading
    std::ifstream inFile(filePath);
    
    //if the file can't open, we stop to avoid crashing
    if (!inFile.is_open()) {
        return; 
    }

    std::vector<std::string> allLines;
    std::string line;

    //read the file line by line
    while (std::getline(inFile, line)) {
        std::istringstream input_line(line);
        std::string currentUserId;
        input_line >> currentUserId;

        //if this is the user we need to delete his products
        if (currentUserId == data.userId) {
            std::vector<std::string> productsToKeep;
            std::string productId;
            
            //read all products in this line
            while (input_line >> productId) {
                bool needDelete = false;
                //check if this product is in the list of products to delete
                for (const std::string& prodToDelete : data.products) {
                    if (productId == prodToDelete) {
                        needDelete = true;
                        break;
                    }
                }
                
                //if it's not in the delete list, we keep it
                if (!needDelete) {
                    productsToKeep.push_back(productId);
                }
            } 

            //after we classified the prodycts, we write the line back only with the stayed products
            std::string newLine = currentUserId;
            for (const std::string& p : productsToKeep) {
                newLine += " " + p;
            }
            allLines.push_back(newLine);

        } else { 
            //this is a different user, keep the line exactly as it was
            allLines.push_back(line);
        }
    } 
    
    inFile.close();

    //open the file in TRUNCATE mode, so we can write the updated data without override data
    std::ofstream outFile(filePath, std::ios::trunc);
    if (!outFile.is_open()) {
        return;
    }

    //write everything back
    for (const std::string& updatedLine : allLines) {
        outFile << updatedLine << "\n";
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
        
        // Use '>>' to get the first word
        if(sLine >> userIdStr) {
            userData.userId = userIdStr;
        } else { 
            continue; // Skip the whole line if there is no user ID (like an empty line)
        }
        
        std::string productStr;
        bool isUserValid = true;
        
        // Read the rest of the Id's (products) on the same line
        while(sLine >> productStr) {
            userData.products.push_back(productStr);
        }
        
        // Only keep users that have at least one product
        if(!userData.products.empty()){
            allData.push_back(userData);
        }       
    }
    
    inFile.close();
    return allData;
}