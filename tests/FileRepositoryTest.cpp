#include <gtest/gtest.h>
#include <sstream>
#include <iostream>
#include <fstream>
#include "FileRepository.h"
#include "IPersistanceDataRepository.h"

// Test fixture for FileRepository tests
class FileRepositoryTest : public ::testing::Test {
protected:
    // Use a temporary file name for testing to avoid conflicts with real data
    const std::string testFilePath = "test_data_temp.txt";

    // Runs before each TEST_F
    void SetUp() override {
        // Removing the pre-existing temporary file to ensure starting with a clean slate
        std::remove(testFilePath.c_str()); 
    }

    // Runs after each TEST_F
    void TearDown() override {
        // Clean up the temporary file so it doesn't clutter the directory
        std::remove(testFilePath.c_str());
    }
};

// First test: load standart data from a file
TEST_F(FileRepositoryTest, StandardLoad) {
    std::string testData0 = "1 10 20 30\n2 40 50\n3 60\n";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << testData0;
    outFile.close();

    FileRepository repo(testFilePath);

    StorageDataList testData = repo.loadAllData();

    ASSERT_EQ(testData.size(), 3);
    
    EXPECT_EQ(testData[0].userId, 1);
    EXPECT_EQ(testData[0].products.size(), 3);
    EXPECT_EQ(testData[0].products[0], 10);

    EXPECT_EQ(testData[1].userId, 2);
    EXPECT_EQ(testData[1].products.size(), 2);
    EXPECT_EQ(testData[1].products[0], 40);

    EXPECT_EQ(testData[2].userId, 3);
    EXPECT_EQ(testData[2].products.size(), 1);
    EXPECT_EQ(testData[2].products[0], 60);
}

// Second test: save standart data to a file
TEST_F(FileRepositoryTest, StandardSave) {
    UserStorageRecord user1 = {1, {500, 501, 502}};
    UserStorageRecord user2 = {2, {600, 601}};
    StorageDataList data = {user1, user2};
    FileRepository repo(testFilePath);

    repo.saveData(data);

    std::string line1;
    std::string line2;
    std::string line3;
    std::ifstream inFile(testFilePath);
    ASSERT_TRUE(inFile.is_open());
    std::getline(inFile, line1);
    std::getline(inFile, line2);
    bool hasMoreLines = (bool)std::getline(inFile, line3);
    inFile.close();

    EXPECT_EQ(line1, "1 500 501 502");
    EXPECT_EQ(line2, "2 600 601");

    EXPECT_FALSE(hasMoreLines);
}

TEST_F(FileRepositoryTest, EmptyLoad) {
    std::string emptyStr = "";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << emptyStr;
    outFile.close();

    FileRepository repo(testFilePath);

    StorageDataList testData = repo.loadAllData();
    ASSERT_EQ(testData.size(), 0);
}

TEST_F(FileRepositoryTest, NonExistFile) {
    FileRepository repo(testFilePath);
    StorageDataList testData = repo.loadAllData();
    
    EXPECT_TRUE(testData.empty());
}

TEST_F(FileRepositoryTest, StrangeFile) {
    std::string testData0 = "ABS 1A3\n 3-@3 555\n 1    101\n 5 -15\n\n\n";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << testData0;
    outFile.close();

    FileRepository repo(testFilePath);

    StorageDataList testData = repo.loadAllData();
    ASSERT_EQ(testData.size(), 1);

    ASSERT_EQ(testData[0].userId,1);
    ASSERT_EQ(testData[0].products[0],101);
}

TEST_F(FileRepositoryTest, UserIdOnly) {
    std::string testData0 = "1\n";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << testData0;
    outFile.close();

    FileRepository repo(testFilePath);

    StorageDataList testData = repo.loadAllData();
    ASSERT_EQ(testData.size(), 0);
}

TEST_F(FileRepositoryTest, SameUser) {
    std::string testData0 = "1 100 101\n2 200 201\n1 300 301";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << testData0;
    outFile.close();

    FileRepository repo(testFilePath);

    StorageDataList testData = repo.loadAllData();
    ASSERT_EQ(testData.size(), 3);
    ASSERT_EQ(testData[0].userId,1);
    ASSERT_EQ(testData[0].products.size(),2);
    ASSERT_EQ(testData[0].products[0],100);
    ASSERT_EQ(testData[2].userId,1);
    ASSERT_EQ(testData[2].products.size(),2);
    ASSERT_EQ(testData[2].products[0],300);
}