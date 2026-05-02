#include <vector>
#include <string>
#include "RecommendCommand.h"

RecommendCommand::RecommendCommand(IRecommend& recommender,IOutputWriter& outputWriter) : recommender(recommender),
                                     writer(outputWriter) {}
void RecommendCommand::execute() {
    std::vector<std::string> recommendations = recommender.recommend();
    std::string Recommandationtext = "";
    for(int i = 0; i < recommendations.size(); ++i) {
        Recommandationtext += recommendations[i];
        
        if (i < recommendations.size() - 1) {
            Recommandationtext += " ";
        }
    }
    
    writer.writeLine(Recommandationtext);
}
