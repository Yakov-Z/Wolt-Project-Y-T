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


TEST(CommonUsersRecommendTest, StandardRecommend) {
    MockPersistanceData mockPersistence;
    MemoryDataRepository repo(mockPersistence);
    
    // Populate the repository with the example data
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
    std::vector<std::string> expected = {"105", "106", "111", "110", "112", "113", "107", "108", "109", "114"};
    EXPECT_EQ(recommendations, expected);
}
