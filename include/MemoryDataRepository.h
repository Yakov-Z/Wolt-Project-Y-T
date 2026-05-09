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


public:
    // Override the interface methods
    void postView(const std::string& userId, const std::string& productId) override;
    void postView(const std::string& userId, const std::vector<std::string>& productIds);
    void patchView(const std::string& userId, const std::string& productId) override;
    void patchView(const std::string& userId, const std::vector<std::string>& productIds);
    MemoryDataRepository(IPersistanceData& p) : persistence(p) {}
    std::unordered_set<std::string> getProductsByUser(const std::string& userId) const override;
    std::unordered_set<std::string> getUsersByProduct(const std::string& productId) const override;
    void loadDatatoMemory();
    void deleteView(const std::string& userId, const std::string& productId) override;
    bool userExists(const std::string& userId) const override;
    bool validDelete(const std::string& userId, const std::vector<std::string>& productIds) override;
    void deleteView(const std::string& userId, const std::vector<std::string>& productIds);
};