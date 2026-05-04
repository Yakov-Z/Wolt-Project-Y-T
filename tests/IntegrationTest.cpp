#include <gtest/gtest.h>
#include <vector>
#include <string>
#include <memory>


#include "MemoryDataRepository.h"
#include "AddCommand.h"
#include "RecommendCommand.h"
#include "CommonUsersRecommend.h"
#include "ConsoleOutputWriter.h" 

// fake object fot the test
class FakePersistence : public IPersistanceData {
public:
    void saveData(const UserStorageRecord& data) override {} // Do nothing in memory test
    StorageDataList loadAllData() override { return {}; }
};

TEST(SystemIntegrationTest, Exe_Example) {
    
    FakePersistence fake;
    MemoryDataRepository repo(fake);
    ConsoleOutputWriter writer; 
   
    //insert the data
    AddCommand(repo, fake, "1",  {"100", "101", "102", "103"}).execute();
    AddCommand(repo, fake, "2",  {"101", "102", "104", "105", "106"}).execute();
    AddCommand(repo, fake, "3",  {"100", "104", "105", "107", "108"}).execute();
    AddCommand(repo, fake, "4",  {"101", "105", "106", "107", "109", "110"}).execute();
    AddCommand(repo, fake, "5",  {"100", "102", "103", "105", "108", "111"}).execute();
    AddCommand(repo, fake, "6",  {"100", "103", "104", "110", "111", "112", "113"}).execute();
    AddCommand(repo, fake, "7",  {"102", "105", "106", "107", "108", "109", "110"}).execute();
    AddCommand(repo, fake, "8",  {"101", "104", "105", "106", "109", "111", "114"}).execute();
    AddCommand(repo, fake, "9",  {"100", "103", "105", "107", "112", "113", "115"}).execute();
    AddCommand(repo, fake, "10", {"100", "102", "105", "106", "107", "109", "110", "116"}).execute();

    //Run Recommendation for User 1 on Product 104
    CommonUsersRecommend algo(repo, "1", "104");
    std::vector<std::string> recommendations = algo.recommend();

    //Comparing to the excersice Output
    std::vector<std::string> expected = {
        "105", "106", "111", "110", "112", "113", "107", "108", "109", "114"
    };

    ASSERT_EQ(recommendations.size(), expected.size());
    
    for(size_t i = 0; i < expected.size(); ++i) {
        EXPECT_EQ(recommendations[i], expected[i]);
    }
}