#include <gtest/gtest.h>
#include <vector>
#include <string>
#include "CommonUsersRecommend.h"
#include "MemoryDataRepository.h"
#include "IPersistanceData.h"

class MockPersistanceData : public IPersistanceData {
public:
    void saveData(const UserStorageRecord& data) override {}
    StorageDataList loadAllData() override {}
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

TEST(CommonUsersRecommendTest, EmptyDatabase) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);

    CommonUsersRecommend recommender(repo, "1", "104");
    std::vector<std::string> recommendations = recommender.recommend();
    EXPECT_TRUE(recommendations.empty());
}