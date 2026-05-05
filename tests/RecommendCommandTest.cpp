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
    std::vector<std::string> recommend() {
        return {"101", "102", "117"};
    }
};

TEST(RecommendCommandTest, RecommendTest) {
    MockOutputRecommender* mockRecommender = new MockOutputRecommender();
    MockOutputWriter mockWriter;
    // -- Start class test --
    RecommendCommand recommend(mockRecommender, mockWriter);
                           
    recommend.execute();
    
    EXPECT_EQ(mockWriter.capturedOutput, "101 102 117");
}