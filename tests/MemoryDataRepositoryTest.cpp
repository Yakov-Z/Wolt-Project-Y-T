#include <gtest/gtest.h>
#include <unordered_set>
#include "MemoryDataRepository.h"
#include "IPersistanceData.h"
#include "IOutputWriter.h"

class MockPersistenceData : public IPersistanceData {
public:
    void saveData(const UserStorageRecord& data) override {
    }
    
    StorageDataList loadAllData() override {
        return {}; // Return an empty list for testing
    }

    void deleteData(const UserStorageRecord& data) override {}
};

// Test 1: Check User to Products set
TEST(MemoryDataRepositoryTest, RetrievesProductsByUserIdNoDuplicates) {
    MockPersistenceData persistence; // You can create a mock or stub if needed
    MemoryDataRepository repo(persistence);
    
    
    repo.postView("user1", "productA");
    repo.postView("user1", "productB");
    //check duplicates
    repo.postView("user1", "productA"); 
    repo.postView("user2", "productC");
    
    std::unordered_set<std::string> expectedForUser1 = {"productA", "productB"};
    EXPECT_EQ(repo.getProductsByUser("user1"), expectedForUser1);
    
    // Expect an empty set for a user that doesn't exist
    EXPECT_TRUE(repo.getProductsByUser("noexistuser").empty());
}

// Test 2: Check Product to Users set
TEST(MemoryDataRepositoryTest, RetrievesUsersByProductIdNoDuplicates) {
    MockPersistenceData persistence;
    MemoryDataRepository repo(persistence);

    repo.postView("user1", "productA");
    repo.postView("user2", "productA");
    //check duplicates
    repo.postView("user1", "productA"); 
    repo.postView("user3", "productB"); 
    
    
    std::unordered_set<std::string> expectedForProductA = {"user1", "user2"};
    EXPECT_EQ(repo.getUsersByProduct("productA"), expectedForProductA);
}

//Test 3: Check delete of products from memory
TEST(MemoryDataRepositoryTest, DeletesValidProducts) {
    MockPersistenceData persistence;
    MemoryDataRepository repo(persistence);
    
    repo.postView("user1", "productA");
    repo.postView("user1", "productB");
    repo.postView("user1", "productC");

    //check before the delete
     std::unordered_set<std::string> before = repo.getProductsByUser("user1");
    EXPECT_TRUE(before.count("productA"));
    EXPECT_TRUE(before.count("productC"));
    EXPECT_EQ(before.size(), 3);

    std::vector<std::string> productsToDelete = {"productA", "productC"};
    repo.deleteView("user1", productsToDelete);

   std::unordered_set<std::string> remaining = repo.getProductsByUser("user1");
    
    //check the delete
    EXPECT_EQ(remaining.size(), 1);
    EXPECT_TRUE(remaining.count("productB"));
    EXPECT_FALSE(remaining.count("productA"));
    EXPECT_FALSE(remaining.count("productC"));
}