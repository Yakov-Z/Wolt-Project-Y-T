#include "CommonUsersRecommend.h"
#include <vector>
#include <string>
#include <unordered_set>
#include <map>
#include <algorithm>

CommonUsersRecommend::CommonUsersRecommend(IDataRepository& repo, const std::string& userId, const std::string& productId)
    : dataRepository(repo), currentUserId(userId), currentProductId(productId) {}

std::vector<std::string> CommonUsersRecommend::recommend() {
    std::vector<std::string> recommendations;
    std::unordered_set<std::string> usersWatched = dataRepository.getUsersByProduct(currentProductId);
    std::unordered_set<std::string> productsWatched = dataRepository.getProductsByUser(currentUserId);
    std::map<std::string, int> productsWeight;
    for(const auto& user: usersWatched) {
        if (user == currentUserId) continue;

        std::unordered_set<std::string> products = dataRepository.getProductsByUser(user);
        
        // Step 1: Calculate the similarity score (number of common products)
        int similarityScore = 0;
        for(const auto& product: products) {
            if(productsWatched.find(product) != productsWatched.end()) {
                similarityScore++;
            }
        }

        // Step 2: For each product watched by this user, add the similarity score to the product's weight
        if (similarityScore > 0) {
            for(const auto& product: products) {
                // Check that it's not the target product AND the user hasn't seen it yet
                if(product != currentProductId && productsWatched.find(product) == productsWatched.end()) {
                    productsWeight[product] += similarityScore;
                }
            }
        }
    }
    // Prepare for sorting
    std::vector<std::pair<std::string, int>> sortedProducts(productsWeight.begin(), productsWeight.end());

    // Step 3: Sort according to the assignment rules
    std::sort(sortedProducts.begin(), sortedProducts.end(),
        [](const std::pair<std::string, int>& a, const std::pair<std::string, int>& b) {
            // Rule 1: Sort by weight in descending order
        if (a.second != b.second) return a.second > b.second; 
        
        // Helper to check if string is purely numeric
        auto isNum = [](const std::string& s) { 
            return !s.empty() && std::all_of(s.begin(), s.end(), ::isdigit); 
        };

        // Rule 2: Sort mathematically if both are numbers and lengths differ
        if (isNum(a.first) && isNum(b.first) && a.first.length() != b.first.length()) {
            return a.first.length() < b.first.length();
        }
        
        // Fallback: Lexicographical sort (works for equal length numbers and strings)
        return a.first < b.first;
        });

    // Step 4: Extract the results
    for(const auto& p : sortedProducts) {
        recommendations.push_back(p.first);
    }

    // Limit to top 10 recommendations
    if (recommendations.size() > 10) {
        recommendations.resize(10);
    }
    return recommendations;
}