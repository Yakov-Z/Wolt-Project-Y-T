# 4. Menu & Products

Each restaurant in Chikobyte features a dynamic menu. Restaurant owners have complete control over their menu items, allowing them to keep their offerings up to date.

## Viewing the Menu
When a user navigates to a specific Restaurant Page, the complete menu is fetched from the MongoDB database and displayed in a clean, scrollable grid. 
Each product card displays its image, name, description, and price. For authenticated users, an "Add to Cart" button is also available.

<p align="center">
  <img src="../screenshots/24.png" width="250" />
</p>

---

## Adding a New Product (Admin/Owner)
Restaurant owners can seamlessly add new dishes to their menu.

1. On the Restaurant Page, the owner clicks the "Add Product" button.
2. A dedicated form opens requiring the product's Name, Description, Category, Price, and an Image.
3. The application enforces strict validation (e.g., the price must be a positive number, and all fields are mandatory).
4. Upon submission, the new product is saved to the database and its ID is instantly appended to the restaurant's menu array.

<table>
  <tr>
    <td><b>Add Product Button</b></td>
    <td><b>Add Product Form</b></td>
  </tr>
  <tr>
    <td><img src="../screenshots/25.png" width="250" /></td>
    <td><img src="../screenshots/26.png" width="250" /></td>
  </tr>
</table>

---

## Updating and Deleting Products
Owners can manage their existing products directly from the menu view. Custom action buttons are visible only to the authorized owner.

* **Updating:** Clicking "Update" on a product card opens a pre-filled form where the owner can adjust details such as the price, description, or image.
* **Deleting:** Clicking "Delete" triggers a native confirmation prompt to prevent accidental data loss. Once confirmed, the product is removed from the database and visually removed from the menu grid immediately.

<table>
  <tr>
    <td><b>Update Product Form</b></td>
    <td><b>Delete Product Alert</b></td>
  </tr>
  <tr>
    <td><img src="../screenshots/27.png" width="250" /></td>
    <td><img src="../screenshots/28.png" width="250" /></td>
  </tr>
</table>