// Variables for inputs and elements
let title = document.getElementById("title");
let price = document.getElementById("price");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let search = document.getElementById("search");
let tbody = document.getElementById("tbody");
let currUpdateIndex = null;
let prodList = [];

// Load products from LocalStorage
if (localStorage.getItem("products")) {
    prodList = JSON.parse(localStorage.getItem("products"));
    showData();
}

// Calculate total
function getTotalPrice() {
    let priceValue = parseFloat(price.value) || 0;
    let discountValue = parseFloat(discount.value) || 0;
    total.innerHTML = (priceValue - discountValue).toFixed(2);
}

// Add a new product or update existing product
function createProd() {
    if (!title.value && !price.value && !discount.value) {
        alert("يرجى تعبئة الحقول المطلوبة.");
        return;
    }

    let newProduct = {
        title: title.value || "N/A",
        price: parseFloat(price.value) || 0,
        discount: parseFloat(discount.value) || 0,
        total: parseFloat(total.innerHTML) || 0,
    };

    if (currUpdateIndex !== null) {
        // Update the product in the list
        prodList[currUpdateIndex] = newProduct;
        currUpdateIndex = null; // Reset the index after updating
        document.getElementById("create").innerText = "إنشاء"; // Reset button text to "Create"
    } else {
        // Add a new product
        prodList.push(newProduct);
    }

    saveProd();
    clearInput();
    showData();
}

// Save products to LocalStorage
function saveProd() {
    localStorage.setItem("products", JSON.stringify(prodList));
    console.log("تم حفظ البيانات في LocalStorage: ", prodList); // Print data in the console
}

// Clear input fields
function clearInput() {
    title.value = "";
    price.value = "";
    discount.value = "";
    total.innerHTML = "";
}

// Display data in the table
function showData() {
    tbody.innerHTML = prodList
        .map((product, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${product.price}</td>
                <td>${product.discount}</td>
                <td>${product.title}</td>
                <td>${product.total}</td>
                <td><button onclick="deleteProd(${index})">حذف</button>
                <button onclick="editProd(${index})">تحديث</button></td>
            </tr>
        `)
        .join("");
    calculateTotals();
}

// Delete a product
function deleteProd(index) {
    prodList.splice(index, 1);
    saveProd();
    showData();
}

// Calculate totals
function calculateTotals() {
    let totalAdvances = prodList.reduce((sum, prod) => sum + prod.price, 0);
    let totalExpenses = prodList.reduce((sum, prod) => sum + prod.discount, 0);

    document.getElementById("totalAdvances").innerText = totalAdvances.toFixed(2);
    document.getElementById("totalExpenses").innerText = totalExpenses.toFixed(2);
    document.getElementById("difference").innerText = (totalAdvances - totalExpenses).toFixed(2);
}

// Edit a product
function editProd(index) {
    let product = prodList[index];
    title.value = product.title;
    price.value = product.price;
    discount.value = product.discount;
    total.innerHTML = product.total;

    // Store the current product index for editing
    currUpdateIndex = index;
    document.getElementById("create").innerText = "تحديث"; // Change the button text to "Update"
}

// Search products
search.addEventListener("input", function () {
    let query = search.value.toLowerCase();
    tbody.innerHTML = prodList
        .filter(
            (prod) =>
                prod.title.toLowerCase().includes(query) ||
                prod.price.toString().includes(query)
        )
        .map((product, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${product.price}</td>
                <td>${product.discount}</td>
                <td>${product.title}</td>
                <td>${product.total}</td>
                <td><button onclick="deleteProd(${index})">حذف</button>
                <button onclick="editProd(${index})">تحديث</button></td>
            </tr>
        `)
        .join("");
});

// Event listeners
document.getElementById("create").addEventListener("click", createProd);
price.addEventListener("input", getTotalPrice);
discount.addEventListener("input", getTotalPrice);

// Show data on page load
showData();
