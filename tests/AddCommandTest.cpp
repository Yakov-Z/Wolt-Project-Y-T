#include <gtest/gtest.h>
#include <iostream>
#include <sstream>
#include "AddCommand.h"

/**
 * A Spy/Fake implementation of IDataRepository used exclusively for testing.
 * It captures the inputs passed to it into a string so we can verify them later.
 */
class MockDataManager : public IDataRepository {
public:
    std::string capturedOutput = "";

    // Overrides the target method to record its execution state instead of actually doing the work.
    void addView(const std::string& userId, const std::vector<std::string>& productIds) override {
        capturedOutput+= userId;
        for(const std::string& productId : productIds) {
            capturedOutput+=" "+productId;
        }
    }
    
    // Dummy implementations for the rest of the interface's pure virtual methods.
    // These are required for the class to compile, even if unused in this specific test.
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

/**
 * A Spy/Fake implementation of IPersistanceData used exclusively for testing.
 * Like the MockDataManager, it captures the data given to saveData.
 */
class MockPersistenceManager : public IPersistanceData {
public:
    std::string capturedOutput = "";

    // Records the UserStorageRecord elements into a single string.
    void saveData(const UserStorageRecord& data) override {
        capturedOutput += data.userId;
        for (const std::string& productId : data.products) {
            capturedOutput += " " + productId;
        }
    }
    
    // Dummy implementation to satisfy the interface requirements.
    StorageDataList loadAllData() override {
        return {}; 
    }
};

// Tests if AddCommand properly passes the data to the DataRepository.
TEST(AddCommandTest, LocalDataTest) {
    MockDataManager mockDataManager;
    MockPersistenceManager persistenceManager;
    // -- Start class test --
    std::vector<std::string> productIds = {"101", "102", "103"};
    
    // Inject the mock/spy dependencies into the command.
    AddCommand addCommand(mockDataManager, persistenceManager, "1", productIds);

    // Trigger the execution.
    addCommand.execute();

    // Verify that the DataRepository received exactly the expected string format.
    EXPECT_EQ(mockDataManager.capturedOutput, "1 101 102 103");
}

// Tests if AddCommand properly passes the data to the PersistenceData manager.
TEST(AddCommandTest, PersistenceDataTest) {
    MockDataManager mockDataManager;
    MockPersistenceManager persistenceManager;
    // -- Start class test --
    std::vector<std::string> productIds = {"101", "102", "103"};
    
    // Inject the mock/spy dependencies into the command.
    AddCommand addCommand(mockDataManager, persistenceManager, "1", productIds);

    // Trigger the execution.
    addCommand.execute();

    // Verify that the PersistenceManager received exactly the expected string format.
    EXPECT_EQ(persistenceManager.capturedOutput, "1 101 102 103");
}