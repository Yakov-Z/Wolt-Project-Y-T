#include <vector>
#include <string>
#include "RecommendCommand.h"

RecommendCommand::RecommendCommand(IRecommend* recommender,IOutputWriter& outputWriter) : recommender(recommender),
                                     writer(outputWriter) {}
void RecommendCommand::execute() {
    std::vector<std::string> recommendations = recommender->recommend();
    if (!recommender->isUserExist()) {
        writer.writeLine("404 Not Found\n");
        return;
    }
    std::string Recommandationtext = "200 Ok\n\n";
    for(int i = 0; i < recommendations.size(); ++i) {
        Recommandationtext += recommendations[i];
        
        if (i < recommendations.size() - 1) {
            Recommandationtext += " ";
        }
    }
    
    writer.writeLine(Recommandationtext);
}
RecommendCommand::~RecommendCommand() {
    delete recommender;
}
