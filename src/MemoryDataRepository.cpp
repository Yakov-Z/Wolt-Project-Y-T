#include "MemoryDataRepository.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <vector>
#include "IPersistanceData.h"


void MemoryDataRepository::addView(const std::string& userId, const std::string& productId) {
    // we use sets to prevent duplicates
    userToProducts[userId].insert(productId);
    productToUsers[productId].insert(userId);
}

//fuction overload - get more than 1 product
void MemoryDataRepository::addView(const std::string& userId, const std::vector<std::string>& productIds) {
    
    for (const std::string& productId : productIds) {
        userToProducts[userId].insert(productId);
        productToUsers[productId].insert(userId);
    }
}

//initial load from file to the hash, for get the history
void MemoryDataRepository::loadDatatoMemory() {
    
    StorageDataList allData = persistence.loadAllData();
    
    for (const UserStorageRecord& record : allData) {
        addView(record.userId, record.products); 
    }
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