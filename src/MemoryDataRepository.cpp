#include "MemoryDataRepository.h"

void MemoryDataRepository::addView(const std::string& userId, const std::string& productId) {
    // we use sets to prevent duplicates
    userToProducts[userId].insert(productId);
    productToUsers[productId].insert(userId);
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