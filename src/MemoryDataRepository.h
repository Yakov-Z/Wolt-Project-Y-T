#pragma once
#include "IDataRepository.h"
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <vector>
#include "IPersistanceData.h"

class MemoryDataRepository : public IDataRepository {
private:
    //user ID as key, and set of product IDs as value
    std::unordered_map<std::string, std::unordered_set<std::string>> userToProducts;

    //Product ID as key, and set of user IDs as value
    std::unordered_map<std::string, std::unordered_set<std::string>> productToUsers;
    IPersistanceData& persistence;

    void loadDatatoHash();

public:
    // Override the interface methods
    void addView(const std::string& userId, const std::string& productId) override;
    void addView(const std::string& userId, const std::vector<std::string>& productIds);
    MemoryDataRepository(IPersistanceData& p) : persistence(p) {}
    std::unordered_set<std::string> getProductsByUser(const std::string& userId) const override;
    std::unordered_set<std::string> getUsersByProduct(const std::string& productId) const override;
    void loadDatatoMemory();
};