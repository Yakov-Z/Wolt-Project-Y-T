#pragma once
#include "IDataRepository.h"
#include <unordered_map>
#include <unordered_set>
#include <string>

class MemoryDataRepository : public IDataRepository {
private:
    //user ID as key, and set of product IDs as value
    std::unordered_map<std::string, std::unordered_set<std::string>> userToProducts;

    //Product ID as key, and set of user IDs as value
    std::unordered_map<std::string, std::unordered_set<std::string>> productToUsers;

public:
    // Override the interface methods
    void addView(const std::string& userId, const std::string& productId) override;
    std::unordered_set<std::string> getProductsByUser(const std::string& userId) const override;
    std::unordered_set<std::string> getUsersByProduct(const std::string& productId) const override;
    void loadFromFile(const std::string& filePath);
};