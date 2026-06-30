# 3. Restaurant Management

The Chikobyte platform allows users to browse and search for restaurants, while providing administrative users with full CRUD (Create, Read, Update, Delete) capabilities.

## Viewing and Searching Restaurants
Any user (guest or registered) can view the available restaurants.

* **Home Screen:** Displays categorized lists such as "Popular" and "Nearby" restaurants.
* **Search Functionality:** Users can use the top search bar to instantly find restaurants or specific menu items. The search implements a 500ms debounce mechanism to ensure smooth mobile performance and prevent keyboard lag without overloading the Node.js server.

<table>
  <tr>
    <td><b><p align="center">Search Results</p></b></td>
    <td><b><p align="center">Home Page</p></b></td>
  </tr>
  <tr>
    <td><img src="../screenshots/19.png" width="250" /></td>
    <td><img src="../screenshots/18.png" width="250" /></td>
  </tr>
</table>

---

## Creating a Restaurant (Admin/Owner)
Users with administrative privileges can add new restaurants to the platform.

1. Log in with an Admin account.
2. Navigate to the **Create Restaurant** dedicated screen.
3. Fill out the required details (Name, Category, Description, Address, Kosher status).
4. Upload a Main Image and a Logo (processed as Base64 strings).
5. Submit the form. The new restaurant is immediately saved to the MongoDB database and visible on the platform.

<table>
  <tr>
    <td><b><p align="center">Create Form</p></b></td>
    <td><b><p align="center">Restaurant Created!</p></b></td>
  </tr>
  <tr>
    <td><img src="../screenshots/20.png" width="250" /></td>
    <td><img src="../screenshots/21.png" width="250" /></td>
  </tr>
</table>


---

## Updating and Deleting a Restaurant
Owners have full control to modify or remove their existing restaurants directly from the mobile app.

* **Updating:** From the specific Restaurant Page, the owner can click the update button to change the description, address, or upload new images.
* **Deleting:** The owner can permanently delete the restaurant. A native confirmation dialogue (Alert) prevents accidental deletions. Once confirmed, the restaurant and all its associated products are securely removed from the database.

<table>
  <tr>
    <td><b><p align="center">Update Restaurant Form</p></b></td>
    <td><b><p align="center">Delete Confirmation Alert</p></b></td>
  </tr>
  <tr>
    <td><img src="../screenshots/22.png" width="250" /></td>
    <td><img src="../screenshots/23.png" width="250" /></td>
  </tr>
</table>