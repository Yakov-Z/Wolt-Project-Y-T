#include <gtest/gtest.h>
#include <iostream>
#include <sstream>
#include "PatchCommand.h"
#include "IOutputWriter.h"

/**
 * A Spy/Fake implementation of IDataRepository used exclusively for testing.
 * It captures the inputs passed to it into a string so we can verify them later.
 */
class MockDataManager4 : public IDataRepository {
public:
    std::string capturedOutput = "";

    // Overrides the target method to record its execution state instead of actually doing the work.
    void postView(const std::string& userId, const std::vector<std::string>& productIds) override {
        capturedOutput+= userId;
        for(const std::string& productId : productIds) {
            capturedOutput+=" "+productId;
        }
    }
    bool user_Exist=true;
    bool userExists(const std::string& userId) const override { return user_Exist; }
    // Dummy implementations for the rest of the interface's pure virtual methods.
    void postView(const std::string& userId, const std::string& productId) override {}
    std::unordered_set<std::string> getProductsByUser(const std::string& userId) const override {
        if (user_Exist) {
            return {"11"}; 
        }
        return {};
    }
    std::unordered_set<std::string> getUsersByProduct(const std::string& productId) const override {
        return {};
    }
    void loadDatatoMemory() override {
    }
    void deleteView(const std::string& userId, const std::string& productId) override {}
    void deleteView(const std::string& userId, const std::vector<std::string>& productIds) override {}
    bool validDelete(const std::string& userId, const std::vector<std::string>& productIds) override { return true; }
};

/**
 * A Spy/Fake implementation of IPersistanceData used exclusively for testing.
 * Like the MockDataManager, it captures the data given to saveData.
 */
class MockPersistenceManager4 : public IPersistanceData {
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
    void deleteData(const UserStorageRecord& data) override {}
};


class MockOutputWriter4 : public IOutputWriter {
public:
    std::string capturedOutput = "";
    void writeLine(const std::string& message) override {
        capturedOutput += message;
    }
};

// Tests if PatchCommand properly passes the data to the DataRepository.
TEST(PatchCommandTest, LocalDataTest) {
    MockDataManager4 mockDataManager;
    MockPersistenceManager4 persistenceManager;
    MockOutputWriter4 mockWriter;
    // -- Start class test --
    std::vector<std::string> productIds = {"101", "102", "103"};
    
    // Inject the mock/spy dependencies into the command.
    PatchCommand patchCommand(mockDataManager, persistenceManager, "1", productIds, mockWriter);

    // Trigger the execution.
    patchCommand.execute();

    // Verify that the DataRepository received exactly the expected string format.
    EXPECT_EQ(mockDataManager.capturedOutput, "1 101 102 103");
}

// Tests if PatchCommand properly passes the data to the PersistenceData manager.
TEST(PatchCommandTest, PersistenceDataTest) {
    MockDataManager4 mockDataManager;
    MockPersistenceManager4 persistenceManager;
    MockOutputWriter4 mockWriter;
    // -- Start class test --
    std::vector<std::string> productIds = {"101", "102", "103"};
    
    // Inject the mock/spy dependencies into the command.
    PatchCommand patchCommand(mockDataManager, persistenceManager, "1", productIds, mockWriter);

    // Trigger the execution.
    patchCommand.execute();

    // Verify that the PersistenceManager received exactly the expected string format.
    EXPECT_EQ(persistenceManager.capturedOutput, "1 101 102 103");
}

// Tests if PatchCommand does nothing and returns 404 when the user don't exists in the system.
TEST(PatchCommandTest, UserDontExistsTest) {
    MockDataManager4 mockDataManager;
    MockPersistenceManager4 persistenceManager;
    MockOutputWriter4 mockWriter;
    // -- Start class test --
    std::vector<std::string> productIds = {"101", "102", "103"};
    
    // tell the test that the user exist
    mockDataManager.user_Exist = false;

    PatchCommand patchCommand(mockDataManager, persistenceManager, "1", productIds, mockWriter);

    // Trigger the execution.
    patchCommand.execute();

    // verify that the information not pass to the data and the persistence.
    EXPECT_EQ(mockDataManager.capturedOutput, "");
    EXPECT_EQ(persistenceManager.capturedOutput, "");
    
    // verify the 404 Not Found output
    EXPECT_EQ(mockWriter.capturedOutput, "404 Not Found\n");
}