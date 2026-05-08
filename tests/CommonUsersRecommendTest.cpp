#include <gtest/gtest.h>
#include <vector>
#include <string>
#include "CommonUsersRecommend.h"
#include "MemoryDataRepository.h"
#include "IPersistanceData.h"

class MockPersistanceData : public IPersistanceData {
public:
    void saveData(const UserStorageRecord& data) override {}
    
    StorageDataList loadAllData() override {
        return StorageDataList(); 
    }
    void deleteData(const UserStorageRecord& data) override {}
};

// Helper function to populate the repository with the assignment's dataset
void populateAssignmentData(MemoryDataRepository& repo) {
    repo.addView("1", {"100", "101", "102", "103"});
    repo.addView("2", {"101", "102", "104", "105", "106"});
    repo.addView("3", {"100", "104", "105", "107", "108"});
    repo.addView("4", {"101", "105", "106", "107", "109", "110"});
    repo.addView("5", {"100", "102", "103", "105", "108", "111"});
    repo.addView("6", {"100", "103", "104", "110", "111", "112", "113"});
    repo.addView("7", {"102", "105", "106", "107", "108", "109", "110"});
    repo.addView("8", {"101", "104", "105", "106", "109", "111", "114"});
    repo.addView("9", {"100", "103", "105", "107", "112", "113", "115"});
    repo.addView("10", {"100", "102", "105", "106", "107", "109", "110", "116"});
}

// Test 1: Verifying recommendation logic for a different user and product
// Ensures the sorting (weight descending, ID ascending) works as required.
TEST(CommonUsersRecommendTest, DifferentUserRecommendation) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);
    populateAssignmentData(repo);

    // Target: User 2, Product 103
    // User 2 watched: 101, 102, 104, 105, 106.
    // Product 103 was watched by: Users 1, 5, 6, 9.
    // Similarities with User 2: User 1(2), User 5(2), User 6(1), User 9(1).
    CommonUsersRecommend recommender(repo, "2", "103");
    std::vector<std::string> recommendations = recommender.recommend();
    
    // Expected logic calculation:
    // 100: weight 6 (2+2+1+1)
    // 111: weight 3 (2+1)
    // 108: weight 2
    // 112: weight 2
    // 113: weight 2
    // 107: weight 1
    // 110: weight 1
    // 115: weight 1
    // Sorted by weight (descending), then ID (ascending).
    std::vector<std::string> expected = {"100", "111", "108", "112", "113", "107", "110", "115"};
    EXPECT_EQ(recommendations, expected);
}

// Test 2: Testing edge case where NO ONE has watched the target product
TEST(CommonUsersRecommendTest, EmptyRecommendationForUnknownProduct) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);
    populateAssignmentData(repo);

    // Product 999 does not exist in the dataset.
    CommonUsersRecommend recommender(repo, "1", "999");
    std::vector<std::string> recommendations = recommender.recommend();
    
    // Expecting an empty list because there are no similar users who watched this product.
    EXPECT_TRUE(recommendations.empty());
}

// Test 3: Testing edge case for an unknown user
TEST(CommonUsersRecommendTest, EmptyRecommendationForUnknownUser) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);
    populateAssignmentData(repo);

    // User 99 does not exist, so they have 0 similarity with everyone.
    CommonUsersRecommend recommender(repo, "99", "100");
    std::vector<std::string> recommendations = recommender.recommend();
    
    // Expecting an empty list because the target user has no history to build similarity upon.
    EXPECT_TRUE(recommendations.empty());
}

TEST(CommonUsersRecommendTest, StandardRecommend) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);
    
    populateAssignmentData(repo);

    CommonUsersRecommend recommender(repo, "1", "104");
    std::vector<std::string> recommendations = recommender.recommend();
    std::vector<std::string> expected = {"105", "106", "111", "110", "112", "113", "107", "108", "109", "114"};
    EXPECT_EQ(recommendations, expected);
}

TEST(CommonUsersRecommendTest, EmptyDatabase) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);

    CommonUsersRecommend recommender(repo, "1", "104");
    std::vector<std::string> recommendations = recommender.recommend();
    EXPECT_TRUE(recommendations.empty());
}

// Test 1: Scenario where the algorithm finds LESS than 10 recommendations.
// It should return exactly the number of products found.
TEST(CommonUsersRecommendTest, LessThanTenRecommendations) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);

    // Setup: 
    // User 1 only watched product 100.
    // Fixed: Added {} to match the vector signature
    repo.addView("1", "100");
    
    // User 2 watched 100 (so similarity is 1) and 3 other unique products.
    repo.addView("2", {"100", "201", "202", "203"});

    // Execute: Get recommendations for User 1 based on product 100.
    CommonUsersRecommend recommender(repo, "1", "100");
    std::vector<std::string> recommendations = recommender.recommend();

    // Verify: We expect exactly 3 recommendations.
    EXPECT_EQ(recommendations.size(), 3);
    
    // Since weight is equal (1 for all), they should be sorted by ID ascending.
    std::vector<std::string> expected = {"201", "202", "203"};
    EXPECT_EQ(recommendations, expected);
}

// Test 2: Scenario where the algorithm finds MORE than 10 recommendations.
// According to the assignment requirements, it must cap the output at exactly 10.
TEST(CommonUsersRecommendTest, CappedAtTenRecommendations) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);

    // Setup: 
    // User 1 only watched product 100.
    // Fixed: Added {} to match the vector signature
    repo.addView("1", "100");
    
    // User 2 watched 100 (similarity is 1) and 12 other unique products.
    repo.addView("2", {"100", "201", "202", "203", "204", "205", 
                       "206", "207", "208", "209", "210", "211", "212"});

    // Execute: Get recommendations for User 1 based on product 100.
    CommonUsersRecommend recommender(repo, "1", "100");
    std::vector<std::string> recommendations = recommender.recommend();

    // Verify: Even though 12 products are relevant, we expect exactly 10.
    EXPECT_EQ(recommendations.size(), 10);
    
    // The top 10 should be selected. Since weights are equal, they are sorted by ID.
    // Therefore, 211 and 212 must be dropped from the final result.
    std::vector<std::string> expected = {
        "201", "202", "203", "204", "205", 
        "206", "207", "208", "209", "210"
    };
    EXPECT_EQ(recommendations, expected);
}