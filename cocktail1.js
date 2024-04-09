
document.querySelector('.btn-success').addEventListener('click', () => {
    $('#paymentModal').modal('show');
});
const menuItems = [
    { id: 1, name: 'Mojito', price: 149 },
    { id: 2, name: 'Cosmopolitan', price: 129 },
    { id: 3, name: 'Old Fashioned', price: 139 },
    { id: 4, name: 'Margarita', price: 199 },
    { id: 5, name: 'Pina Colada', price: 69 },
    { id: 6, name: 'Beer with ice cube', price: 999 }
];


// function addToCart(item) {
//     // Empty the cart first to ensure only one drink is added.
//     cart = []; // Reset the cart to ensure only one item is present
//     cart.push(item);
//     renderCart();
// }
function addToCart(itemId) {
    const cartItem = menuItems.find(item => item.id === itemId);
    if (cart.length === 0) {
        cart[0] = cartItem; // Adds item to cart if empty
    } else {
        cart.splice(0, 1, cartItem); // Replaces the first item if the cart is not empty
    }
    renderCart();
    document.getElementById('menu').style.display = 'none'; // Hides menu after adding an item
}


let cart = [];

function renderMenu() {
    const menuElement = document.getElementById('menu');
    menuItems.forEach(item => {
        const itemElement = document.createElement('button');
        itemElement.classList.add('list-group-item', 'list-group-item-action', 'menu-item');
        itemElement.textContent = `${item.name} - ₹${item.price}`;
        itemElement.onclick = () => addToCart(item.id);
        menuElement.appendChild(itemElement);
    });
}
function removeFromCart(index) {
    cart.splice(index, 1); // Removes the item based on its index
    document.getElementById('menu').style.display = 'block'; // Shows menu for selecting another item
    renderCart();
}

function renderCart() {
    const cartElement = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    cartElement.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('list-group-item');
        itemElement.innerHTML = `${item.name} - ₹${item.price} <button onclick="removeFromCart(${index})" class="btn btn-danger btn-sm">Remove</button>`;
        cartElement.appendChild(itemElement);

        total += item.price;
    });

    totalElement.textContent = total.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    // renderMenu(); // commented out as we removed the menu list
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCart(itemId);
        });
    });

});


document.getElementById('orderNow').addEventListener('click', () => {
    if (cart.length > 0) {
        const drinkId = cart[0].id; // Assuming cart[0] is the current drink
        fetch('http://esp32-server-ip/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: drinkId }),
        })
            .then(response => {
                if (!response.ok) { // Check if response status code is not ok (200-299)
                    throw Error('Failed to place the order. Server responded with an error.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                window.location.href = '/order-processing.html'; // Update as necessary
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to place the order.');
            });
    }
    else {
        alert('Please Add A Drink To Place Order');
    }
});



