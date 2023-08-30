document.addEventListener("DOMContentLoaded", function () {
  const productButtons = document.querySelectorAll(".product-button");
  const cartItemsList = document.getElementById("cartItems");
  const orderTotalDisplay = document.getElementById("orderTotal");
  const submitButton = document.getElementById("submitOrder");
  const orderSummary = document.getElementById("orderSummary");
  const districtSelect = document.getElementById("district");

  let cartItems = [];
  let orderTotal = 0;

  productButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const product = this.getAttribute("data-product");
      const productPrice = getProductPrice(product);

      const existingCartItemIndex = cartItems.findIndex(
        (item) => item.product === product
      );

      if (existingCartItemIndex !== -1) {
        cartItems[existingCartItemIndex].quantity++;
      } else {
        cartItems.push({ product, price: productPrice, quantity: 1 });
      }

      orderTotal += productPrice;

      updateCartDisplay();
    });
  });

  function updateCartDisplay() {
    cartItemsList.innerHTML = "";
    cartItems.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.product} (${item.price} Euro) x ${item.quantity}`;

      const removeButton = document.createElement("button");
      removeButton.textContent = "Entfernen";
      removeButton.classList.add("remove-button");
      removeButton.addEventListener("click", function () {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cartItems.splice(index, 1);
        }

        orderTotal -= item.price;
        updateCartDisplay();
      });

      listItem.appendChild(removeButton);
      cartItemsList.appendChild(listItem);
    });

    orderTotalDisplay.textContent = `Gesamtpreis: ${orderTotal} Euro`;

    const selectedDistrict = districtSelect.value;
    if (selectedDistrict === "2" || selectedDistrict === "20") {
      orderSummary.style.display = "block";
      submitButton.disabled = false;
    } else {
      if (orderTotal >= 15) {
        orderSummary.style.display = "block";
        submitButton.disabled = false;
      } else {
        orderSummary.style.display = "block";
        submitButton.disabled = true;
      }
    }
  }

  function getProductPrice(product) {
    const productPrices = {
      "Käse Baguette": 4,
      "Extrawurst Baguette": 4,
      "Wienerwurst Baguette": 4,
      "Putenwurst Baguette": 4,
      "All in One Baguette": 5,
      // Weitere Produkte und Preise hier hinzufügen
    };
    return productPrices[product] || 0;
  }

  districtSelect.addEventListener("change", updateCartDisplay);

  submitButton.addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const selectedDistrict = districtSelect.value;

    const orderDetails = {
      items: cartItems,
      name: name,
      phone: phone,
      address: address,
      district: selectedDistrict,
      total: orderTotal,
    };

    if (selectedDistrict === "2" || selectedDistrict === "20") {
      // Kein Mindestbestellwert erforderlich
      saveOrderToFirebase(orderDetails);
    } else if (orderTotal < 15) {
      alert("Der Mindestbestellwert beträgt 15 Euro.");
    } else {
      saveOrderToFirebase(orderDetails);
    }
  });

  function saveOrderToFirebase(orderDetails) {
    // Firebase initialisieren
    firebase.initializeApp(firebaseConfig);

    // Firestore-Referenz
    const db = firebase.firestore();

    db.collection("orders")
      .add(orderDetails)
      .then(function (docRef) {
        alert(
          "Bestellung aufgegeben:\n\n Danke fürs Bestellen :) \n Für Details Rufnummer: 067761666158"
        );
        // Hier könntest du den Warenkorb leeren oder andere Aktionen durchführen
      })
      .catch(function (error) {
        console.error("Fehler beim Speichern der Bestellung: ", error);
      });
  }
});
