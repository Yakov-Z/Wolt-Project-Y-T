#pragma once
#include <vector>
#include <string>

class IRecommend {
public:
    virtual std::vector<std::string> recommend() = 0;
    // Virtual destructor to ensure proper cleanup of derived classes.
    virtual ~IRecommend() = default;
    virtual bool isUserExist() = 0;
};