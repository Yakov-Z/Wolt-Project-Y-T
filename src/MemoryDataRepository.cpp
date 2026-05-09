#include "MemoryDataRepository.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <vector>
#include "IPersistanceData.h"


void MemoryDataRepository::postView(const std::string& userId, const std::string& productId) {
    // we use sets to prevent duplicates
    userToProducts[userId].insert(productId);
    productToUsers[productId].insert(userId);
}

//fuction overload - get more than 1 product
void MemoryDataRepository::postView(const std::string& userId, const std::vector<std::string>& productIds) {
    
    for (const std::string& productId : productIds) {
        userToProducts[userId].insert(productId);
        productToUsers[productId].insert(userId);
    }
}
void MemoryDataRepository::patchView(const std::string& userId, const std::string& productId) {
    // we use sets to prevent duplicates
    userToProducts[userId].insert(productId);
    productToUsers[productId].insert(userId);
}

//fuction overload - get more than 1 product
void MemoryDataRepository::patchView(const std::string& userId, const std::vector<std::string>& productIds) {
    
    for (const std::string& productId : productIds) {
        userToProducts[userId].insert(productId);
        productToUsers[productId].insert(userId);
    }
}

bool MemoryDataRepository::validDelete(const std::string& userId, const std::vector<std::string>& productIds) {
    
    //check if the user exist
    auto userIt = userToProducts.find(userId);
    if (userIt == userToProducts.end()) {
        return false; 
    }

    //check if the user deleted a product that not in the list
    const auto& products = userIt->second;
    for (const std::string& productID : productIds) {
        if (products.find(productID) == products.end()) {
            return false; 
        }
    }

    //the delete command is valid
    return true; 
}


void MemoryDataRepository::deleteView(const std::string& userId, const std::string& productId) {
    // we use sets to prevent duplicates
    userToProducts[userId].erase(productId);
    productToUsers[productId].erase(userId);
}

//fuction overload - get more than 1 product
void MemoryDataRepository::deleteView(const std::string& userId, const std::vector<std::string>& productIds) {
    
    for (const std::string& productId : productIds) {
        userToProducts[userId].erase(productId);
        productToUsers[productId].erase(userId);
    }
}

//initial load from file to the hash, for get the history
void MemoryDataRepository::loadDatatoMemory() {
    
    StorageDataList allData = persistence.loadAllData();
    
    for (const UserStorageRecord& record : allData) {
        if (userToProducts.count(record.userId) > 0) {
            patchView(record.userId, record.products);
        } else {
            postView(record.userId, record.products);
        } 
    }
}

//checks if the user exist
bool MemoryDataRepository::userExists(const std::string& userId) const {
    return userToProducts.count(userId) > 0;
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