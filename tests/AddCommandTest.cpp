#include <gtest/gtest.h>
#include <iostream>
#include <sstream>
#include "../src/AddCommand.h"

class MockDataManager : public IDataRepository {
public:
    std::string capturedOutput = "";

    void addView(const std::string& userId, const std::vector<std::string>& productIds) override {
        capturedOutput+= userId;
        for(const std::string& productId : productIds) {
            capturedOutput+=" "+productId;
        }
    }
    void addView(const std::string& userId, const std::string& productId) override {
    }
    std::unordered_set<std::string> getProductsByUser(const std::string& userId) const override {
        return {};
    }
    std::unordered_set<std::string> getUsersByProduct(const std::string& productId) const override {
        return {};
    }
    void loadDatatoMemory() override {
    }
};

class MockPersistenceManager : public IPersistanceData {
public:
    std::string capturedOutput = "";

    void saveData(const UserStorageRecord& data) override {
        capturedOutput += data.userId;
        for (const std::string& productId : data.products) {
            capturedOutput += " " + productId;
        }
    }
    StorageDataList loadAllData() override {
        return {}; 
    }
};

TEST(AddCommandTest, LocalDataTest) {
    MockDataManager mockDataManager;
    MockPersistenceManager persistenceManager;
    // -- Start class test --
    std::vector<std::string> productIds = {"101", "102", "103"};
    AddCommand addCommand(mockDataManager, persistenceManager, "1", productIds);

    addCommand.execute();

    EXPECT_EQ(mockDataManager.capturedOutput, "1 101 102 103");
}

TEST(AddCommandTest, PersistenceDataTest) {
    MockDataManager mockDataManager;
    MockPersistenceManager persistenceManager;
    // -- Start class test --
    std::vector<std::string> productIds = {"101", "102", "103"};
    AddCommand addCommand(mockDataManager, persistenceManager, "1", productIds);

    addCommand.execute();

    EXPECT_EQ(persistenceManager.capturedOutput, "1 101 102 103");
}