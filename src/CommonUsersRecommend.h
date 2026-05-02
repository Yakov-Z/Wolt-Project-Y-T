#pragma once
#include "IRecommend.h"
#include "IDataRepository.h"
#include <vector>
#include <string>

class CommonUsersRecommend : public IRecommend {
private:
    IDataRepository& dataRepository;
    std::string currentUserId;
    std::string currentProductId;
public:
    CommonUsersRecommend(IDataRepository& repo, const std::string& userId, const std::string& productId);
    std::vector<std::string> recommend() override;
};