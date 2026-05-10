#include <gtest/gtest.h>
#include <iostream>
#include <sstream>
#include "DeleteCommand.h"
#include "PostCommand.h"
#include "IOutputWriter.h"

/**
 * A Spy/Fake implementation of IDataRepository used exclusively for testing.
 * It captures the inputs passed to it into a string so we can verify them later.
 */
class MockDataManager : public IDataRepository {
public:
    std::string capturedOutput = "";

    // Overrides the target method to record its execution state instead of actually doing the work.
    void deleteView(const std::string& userId, const std::vector<std::string>& productIds) override {
        capturedOutput+= userId;
        for(const std::string& productId : productIds) {
            capturedOutput+=" "+productId;
        }
    }
    
    void postView(const std::string& userId, const std::vector<std::string>& productIds) override {
        capturedOutput += userId;
        for(const std::string& productId : productIds) {
            capturedOutput += " " + productId;
        }
    }
    
    void postView(const std::string& userId, const std::string& productId) override {
        capturedOutput += userId + " " + productId;
    }


    bool userExists(const std::string& userId) const override { return true; }
    
    // Dummy implementations for the rest of the interface's pure virtual methods.
    // These are required for the class to compile, even if unused in this specific test.
    std::unordered_set<std::string> getProductsByUser(const std::string& userId) const override {
        return {};
    }
    std::unordered_set<std::string> getUsersByProduct(const std::string& productId) const override {
        return {};
    }
    void loadDatatoMemory() override {
    }
    void deleteView(const std::string& userId, const std::string& productId) override {
        capturedOutput += userId + " " + productId;
    }
    bool validDelete(const std::string& userId, const std::vector<std::string>& productIds) override {
        //105 is not valid product
        if (!productIds.empty() && productIds[0] == "105") {
            return false;
        }
        return true; 
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
    void deleteData(const UserStorageRecord& data) override {
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

class MockOutputWriter : public IOutputWriter {
public:
    std::string capturedOutput = "";
    void writeLine(const std::string& message) override {
        capturedOutput += message;
    }
};

// Tests if DeleteCommand properly passes the data to the DataRepository.
TEST(DeleteCommandTest, LocalDataTest) {
    MockDataManager mockDataManager;
    MockPersistenceManager persistenceManager;
    MockOutputWriter mockWriter;
    // -- Start class test --
    std::vector<std::string> productIds = {"101", "102", "103"};
    std::vector<std::string> productIds2 = {"101", "102", "103", "104"};

    // Inject the mock/spy dependencies into the command.
    PostCommand postCommand(mockDataManager, persistenceManager, "1", productIds2, mockWriter);

    // Trigger the execution.
    postCommand.execute();

    mockDataManager.capturedOutput = "";

    // Inject the mock/spy dependencies into the command.
    DeleteCommand deleteCommand(mockDataManager, persistenceManager, "1", productIds, mockWriter);

    // Trigger the execution.
    deleteCommand.execute();

    // Verify that the DataRepository received exactly the expected string format.
    EXPECT_EQ(mockDataManager.capturedOutput, "1 101 102 103");
}

// Tests if DeleteCommand properly passes the data to the PersistenceData manager.
TEST(DeleteCommandTest, PersistenceDataTest) {
    MockDataManager mockDataManager;
    MockPersistenceManager persistenceManager;
    MockOutputWriter mockWriter;
    // -- Start class test --
   
    std::vector<std::string> productIds2 = {"101", "102", "103"};
    std::vector<std::string> productIds = {"101", "102", "103", "104"};
    
    // Inject the mock/spy dependencies into the command.
    PostCommand postCommand(mockDataManager, persistenceManager, "1", productIds, mockWriter);

    // Trigger the execution.
    postCommand.execute();

    persistenceManager.capturedOutput = ""; 
    
    // Inject the mock/spy dependencies into the command.
    DeleteCommand deleteCommand(mockDataManager, persistenceManager, "1", productIds2, mockWriter);

    // Trigger the execution.
    deleteCommand.execute();

    // Verify that the PersistenceManager received exactly the expected string format.
    EXPECT_EQ(persistenceManager.capturedOutput, "1 101 102 103");
}

// Tests if DeleteCommand not work when the user delete product that not in the list
TEST(DeleteCommandTest, CheckValid) {
    MockDataManager mockDataManager;
    MockPersistenceManager persistenceManager;
    MockOutputWriter mockWriter;
    // -- Start class test --
   
    std::vector<std::string> productIds2 = {"101", "102", "103"};
    std::vector<std::string> productIds = {"105"};
    
    // Inject the mock/spy dependencies into the command.
    PostCommand postCommand(mockDataManager, persistenceManager, "1", productIds2, mockWriter);

    // Trigger the execution.
    postCommand.execute();

     mockWriter.capturedOutput = "";
     mockDataManager.capturedOutput = ""; 
    
    // Inject the mock/spy dependencies into the command.
    DeleteCommand deleteCommand(mockDataManager, persistenceManager, "1", productIds, mockWriter);

    // Trigger the execution.
    deleteCommand.execute();

    // Verify that the PersistenceManager received exactly the expected string format.
    EXPECT_EQ(mockWriter.capturedOutput, "404 Not Found\n");
}