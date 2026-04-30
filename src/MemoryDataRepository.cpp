#include "MemoryDataRepository.h"
#include <fstream>
#include <sstream>
#include <stdexcept>

void MemoryDataRepository::addView(const std::string& userId, const std::string& productId) {
    // we use sets to prevent duplicates
    userToProducts[userId].insert(productId);
    productToUsers[productId].insert(userId);

    
}

void MemoryDataRepository::loadFromFile(const std::string& filePath) {
        std::ifstream inFile(filePath);
    // If the file can't open, we stop to avoid crashing
    if (!inFile.is_open()) {
        return; 
    }

    std::string line;
   while (std::getline(inFile, line)) {
        if (line.empty()) continue; 

        std::istringstream iss(line);
        std::string userId;
        
        
        if (iss >> userId) {
            std::string productId;
            
            while (iss >> productId) {
                addView(userId, productId); 
            }
        }
    }
    
    inFile.close();
    }

std::unordered_set<std::string> MemoryDataRepository::getProductsByUser(const std::string& userId) const {
    auto it = userToProducts.find(userId);
    
    if (it != userToProducts.end()) {
        return it->second; // Return the set of products
    }
    
    // If the user has a empty set, return empty set
    return {};
}

std::unordered_set<std::string> MemoryDataRepository::getUsersByProduct(const std::string& productId) const {
    auto it = productToUsers.find(productId);
    
    if (it != productToUsers.end()) {
        return it->second; // Return the set of users
    }
    
    // If the product  has a empty set, return empty set
    return {};
}