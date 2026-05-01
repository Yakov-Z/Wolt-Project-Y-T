#include <gtest/gtest.h>
#include <unordered_set>
#include "MemoryDataRepository.h"

// Test 1: Check User to Products set
TEST(MemoryDataRepositoryTest, RetrievesProductsByUserIdNoDuplicates) {
    MemoryDataRepository repo;
    
    
    repo.addView("user1", "productA");
    repo.addView("user1", "productB");
    //check duplicates
    repo.addView("user1", "productA"); 
    repo.addView("user2", "productC");
    
    std::unordered_set<std::string> expectedForUser1 = {"productA", "productB"};
    EXPECT_EQ(repo.getProductsByUser("user1"), expectedForUser1);
    
    // Expect an empty set for a user that doesn't exist
    EXPECT_TRUE(repo.getProductsByUser("noexistuser").empty());
}

// Test 2: Check Product to Users set
TEST(MemoryDataRepositoryTest, RetrievesUsersByProductIdNoDuplicates) {
    MemoryDataRepository repo;
    
    
    repo.addView("user1", "productA");
    repo.addView("user2", "productA");
    //check duplicates
    repo.addView("user1", "productA"); 
    repo.addView("user3", "productB"); 
    
    
    std::unordered_set<std::string> expectedForProductA = {"user1", "user2"};
    EXPECT_EQ(repo.getUsersByProduct("productA"), expectedForProductA);
}