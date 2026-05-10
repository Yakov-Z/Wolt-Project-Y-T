#pragma once
#include <string>
#include <unordered_set>
#include <vector>

// Interface for Saving the products that every user saw, and the users that saw every product
class IDataRepository {
public:
    // Saves a record that a user viewed a specific product
    virtual void postView(const std::string& userId, const std::string& productId) = 0;

    // Saves a record that a user viewed a list of products
    virtual void postView(const std::string& userId, const std::vector<std::string>& productIds) = 0;

    // Saves a record that a user wants to delete a specific product
    virtual void deleteView(const std::string& userId, const std::string& productId) = 0;

    // Checks if user exist in the system
    virtual bool userExists(const std::string& userId) const = 0;

    // Saves a record that a user wants to delete viewed a list of products
    virtual void deleteView(const std::string& userId, const std::vector<std::string>& productIds) = 0;
    
    // Returns a set of all unique product IDs viewed by user ID
    virtual std::unordered_set<std::string> getProductsByUser(const std::string& userId) const = 0;
    
    // Returns a set of all unique user IDs who viewed product ID
    virtual std::unordered_set<std::string> getUsersByProduct(const std::string& productId) const = 0;
    
    ////check if the user delete products in the list
    virtual bool validDelete(const std::string& userId, const std::vector<std::string>& productIds) = 0;
    
    virtual void loadDatatoMemory() = 0;
    virtual ~IDataRepository() = default;
};