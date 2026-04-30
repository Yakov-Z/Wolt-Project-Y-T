#include <gtest/gtest.h>
#include <sstream>
#include <iostream>
#include <fstream>
#include "FileRepository.h"
#include "IPersistanceData.h"

/**
 * FileRepositoryTest uses a "Fixture" (the class below).
 * This allows us to share setup and cleanup code for every test case.
 */
class FileRepositoryTest : public ::testing::Test {
protected:
    // We use a separate file name for tests so we don't overwrite real app data.
    const std::string testFilePath = "test_data_temp.txt";

    // Runs automatically before every single TEST_F
    void SetUp() override {
        // Delete any old test file to ensure a "clean slate" for the next test.
        std::remove(testFilePath.c_str()); 
    }

    // Runs automatically after every single TEST_F
    void TearDown() override {
        // Remove the temporary file so it doesn't leave junk on your computer.
        std::remove(testFilePath.c_str());
    }
};

// Check if we can load standard, correctly formatted data[cite: 3].
TEST_F(FileRepositoryTest, StandardLoad) {
    std::string testData0 = "1 10 20 30\n2 40 50\n3 60\n";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << testData0;
    outFile.close();

    FileRepository repo(testFilePath);
    StorageDataList testData = repo.loadAllData();

    // Verify the number of users and specific values[cite: 3].
    ASSERT_EQ(testData.size(), 3);
    EXPECT_EQ(testData[0].userId, 1);
    EXPECT_EQ(testData[0].products[0], 10);
}

// Check if saving data produces the expected text format in the file[cite: 3].
TEST_F(FileRepositoryTest, StandardSave) {
    UserStorageRecord user1 = {1, {500, 501, 502}};
    UserStorageRecord user2 = {2, {600, 601}};
    StorageDataList data = {user1, user2};
    FileRepository repo(testFilePath);

    repo.saveData(data);

    std::string line1, line2;
    std::ifstream inFile(testFilePath);
    ASSERT_TRUE(inFile.is_open());
    std::getline(inFile, line1);
    std::getline(inFile, line2);
    inFile.close();

    // Verify the file content matches our expected space-separated format[cite: 3].
    EXPECT_EQ(line1, "1 500 501 502");
    EXPECT_EQ(line2, "2 600 601");
}

// Test what happens when the file exists but is empty[cite: 3].
TEST_F(FileRepositoryTest, EmptyLoad) {
    std::ofstream outFile(testFilePath);
    outFile.close();

    FileRepository repo(testFilePath);
    StorageDataList testData = repo.loadAllData();
    ASSERT_EQ(testData.size(), 0);
}

// Test the case where the file doesn't exist at all[cite: 3].
TEST_F(FileRepositoryTest, NonExistFile) {
    FileRepository repo(testFilePath);
    StorageDataList testData = repo.loadAllData();
    
    // The code should handle this gracefully and return an empty list[cite: 3].
    EXPECT_TRUE(testData.empty());
}

// Test "dirty" data: letters, symbols, and extra spaces[cite: 3].
TEST_F(FileRepositoryTest, StrangeFile) {
    // Only the third line "1 101" is fully valid and positive[cite: 3].
    std::string testData0 = "ABS 1A3\n 3-@3 555\n 1    101\n 5 -15\n\n\n";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << testData0;
    outFile.close();

    FileRepository repo(testFilePath);
    StorageDataList testData = repo.loadAllData();

    // We expect only 1 valid user to be loaded[cite: 3].
    ASSERT_EQ(testData.size(), 1);
    ASSERT_EQ(testData[0].userId, 1);
    ASSERT_EQ(testData[0].products[0], 101);
}

// Test that a user with an ID but zero products is ignored[cite: 3].
TEST_F(FileRepositoryTest, UserIdOnly) {
    std::string testData0 = "1\n";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << testData0;
    outFile.close();

    FileRepository repo(testFilePath);
    StorageDataList testData = repo.loadAllData();
    
    // Per requirements, a user must have products to be valid[cite: 3].
    ASSERT_EQ(testData.size(), 0);
}

// Test that having the same ID multiple times in a file is allowed[cite: 3].
TEST_F(FileRepositoryTest, SameUser) {
    std::string testData0 = "1 100 101\n2 200 201\n1 300 301";
    std::ofstream outFile(testFilePath);
    ASSERT_TRUE(outFile.is_open());
    outFile << testData0;
    outFile.close();

    FileRepository repo(testFilePath);
    StorageDataList testData = repo.loadAllData();

    // The system should treat these as separate entries in the list[cite: 3].
    ASSERT_EQ(testData.size(), 3);
    ASSERT_EQ(testData[0].userId, 1);
    ASSERT_EQ(testData[2].userId, 1);
}