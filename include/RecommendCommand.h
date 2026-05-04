#pragma once
#include "ICommand.h"
#include "IRecommend.h"
#include "IOutputWriter.h"

class RecommendCommand : public ICommand {
private:
    IRecommend* recommender;
    IOutputWriter& writer;
public:
    RecommendCommand(IRecommend* recommender, IOutputWriter& writer);
    ~RecommendCommand() override;
    void execute() override;
};