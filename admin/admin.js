document.addEventListener("DOMContentLoaded", function () {
  const ordersContainer = document.getElementById("orders");
  const deleteAllButton = document.getElementById("deleteAllButton");
  const notificationSound = new Audio("erhalten.mp3");
  const firebaseConfig = {
    apiKey: "AIzaSyAqX15SQCHohB91DKV05JFiMlw423t4HL0",
    authDomain: "nicefood-ebd41.firebaseapp.com",
    databaseURL: "https://nicefood-ebd41-default-rtdb.firebaseio.com",
    projectId: "nicefood-ebd41",
    storageBucket: "nicefood-ebd41.appspot.com",
    messagingSenderId: "413004406542",
    appId: "1:413004406542:web:a24497bb31b1f26de9c15f",
  };

  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();

  // Funktion zum Abrufen und Anzeigen von Bestellungen
  function displayOrders() {
    ordersContainer.innerHTML = "";
    db.collection("orders")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const orderData = doc.data();
          const orderElement = document.createElement("div");
          orderElement.classList.add("order");

          orderElement.innerHTML = `
            <h3>Bestellung von ${orderData.name}</h3>
            <p>Produkte:<br>${getFormattedOrderItemslist(orderData.items)}</p>
            <p>Telefonnummer: ${orderData.phone}</p>
            <p>Lieferadresse: ${orderData.address}</p>
            <p>Bezirk: ${orderData.district}</p>
            <p>Gesamtbetrag: ${orderData.total} Euro</p>
            <button class="delete-button" data-order-id="${
              doc.id
            }">Löschen</button>
            <hr>
          `;
          ordersContainer.appendChild(orderElement);
        });

        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const orderId = button.getAttribute("data-order-id");
            deleteOrder(orderId);
          });
        });
      })
      .catch(function (error) {
        console.error("Error getting documents: ", error);
      });
  }

  // Funktion zum Löschen einer Bestellung
  function deleteOrder(orderId) {
    db.collection("orders")
      .doc(orderId)
      .delete()
      .then(function () {
        displayOrders();
      })
      .catch(function (error) {
        console.error("Error deleting order: ", error);
      });
  }

  // Funktion zum Formatieren der Bestellungsartikel
  function getFormattedOrderItems(items) {
    return items
      .map((item) => `${item.product} (${item.price} Euro) x ${item.quantity}`)
      .join(", ");
  }
  function getFormattedOrderItemslist(items) {
    return items
      .map((item) => `${item.product} (${item.price} Euro) x ${item.quantity}`)
      .join("<br>");
  }

  // Button-Eventlistener, um alle Bestellungen zu löschen
  deleteAllButton.addEventListener("click", function () {
    if (confirm("Möchtest du wirklich alle Bestellungen löschen?")) {
      deleteAllOrders();
    }
  });

  // Funktion zum Löschen aller Bestellungen
  function deleteAllOrders() {
    db.collection("orders")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
        displayOrders();
      })
      .catch(function (error) {
        console.error("Error deleting documents: ", error);
      });
  }

  function checkForNewOrders() {
    db.collection("orders").onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === "added") {
          notificationSound.play({ userGesture: true });
         
        }
      });
    });
  }

  // Initialisiere Anzeige
  displayOrders();
  checkForNewOrders();
  function refreshPage() {
    displayOrders();
    displayReadyOrders();
  }

  // Starte regelmäßiges Aktualisieren alle 2 Sekunden
  setInterval(refreshPage, 2000);
});
