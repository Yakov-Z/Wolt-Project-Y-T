#include <gtest/gtest.h>
#include <iostream>
#include <sstream>
#include "HelpCommand.h"
#include "RecommendCommand.h"

class MockOutputWriter : public IOutputWriter {
public:
    std::string capturedOutput = "";

    void writeLine(const std::string& text) override {
        capturedOutput += text;
    }
};

class MockOutputRecommender : public IRecommend {
public:
bool userExists;
    std::vector<std::string> recommend() {
        return {"101", "102", "117"};
    }
    bool isUserExist() override {
        return userExists; 
    }
};

TEST(RecommendCommandTest, RecommendTest) {
    
    MockOutputRecommender* mockRecommender = new MockOutputRecommender();
    mockRecommender->userExists=true;
    MockOutputWriter mockWriter;
    // -- Start class test --
    RecommendCommand recommend(mockRecommender, mockWriter);
                           
    recommend.execute();
    
    EXPECT_EQ(mockWriter.capturedOutput, "200 Ok\n\n101 102 117");
}

TEST(RecommendCommandTest, UserNotExistTest) {
    MockOutputRecommender* mockRecommender = new MockOutputRecommender();
    mockRecommender->userExists=false;
    MockOutputWriter mockWriter;
    
    RecommendCommand recommend(mockRecommender, mockWriter);
    recommend.execute();
    
    EXPECT_EQ(mockWriter.capturedOutput, "404 Not Found\n");
}