#include <gtest/gtest.h>
#include <iostream>
#include <sstream>
#include "HelpCommand.h"

class MockOutputWriter : public IOutputWriter {
public:
    std::string capturedOutput = "";

    void writeLine(const std::string& text) override {
        capturedOutput += text;
    }
};



TEST(HelpCommandTest, OutputTest) {
    MockOutputWriter mockWriter;
    // -- Start class test --
    HelpCommand help(mockWriter, "add [userid] [productid1] [productid2] ...\n"
                                "recommend [userid] [productid]\n"
                                "help\n");
    
    //Write the exact string from the assignment
    std::string helpText = "add [userid] [productid1] [productid2] ...\n"
                           "recommend [userid] [productid]\n"
                           "help\n";
                           
    help.execute();
    
    EXPECT_EQ(mockWriter.capturedOutput, helpText);
}