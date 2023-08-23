document.addEventListener("DOMContentLoaded", function() {
    const ordersContainer = document.getElementById("orders");
    const deleteAllButton = document.getElementById("deleteAllButton");
  
    const readyOrdersTable = document.getElementById("readyOrdersTable");
    const readyOrdersBody = document.getElementById("readyOrdersBody");
  
    const firebaseConfig = {
        apiKey: "AIzaSyAqX15SQCHohB91DKV05JFiMlw423t4HL0",
        authDomain: "nicefood-ebd41.firebaseapp.com",
        databaseURL: "https://nicefood-ebd41-default-rtdb.firebaseio.com",
        projectId: "nicefood-ebd41",
        storageBucket: "nicefood-ebd41.appspot.com",
        messagingSenderId: "413004406542",
        appId: "1:413004406542:web:a24497bb31b1f26de9c15f"
      };
  
    firebase.initializeApp(firebaseConfig);
  
    const db = firebase.firestore();
  
    // Funktion zum Abrufen und Anzeigen von Bestellungen
    function displayOrders() {
      ordersContainer.innerHTML = "";
      db.collection("orders").get()
        .then(function(querySnapshot) {
          const orders = [];
          querySnapshot.forEach(function(doc) {
            orders.unshift(doc.data());
          });
          orders.forEach(function(orderData) {
            const orderElement = document.createElement("div");
            orderElement.classList.add("order");
            orderElement.innerHTML = `
              <h3>Bestellung von ${orderData.name}</h3>
              <p>Produkt: ${orderData.product}</p>
              <p>Telefonnummer: ${orderData.phone}</p>
              <p>Lieferadresse: ${orderData.address}</p>
              <hr>
            `;
            ordersContainer.appendChild(orderElement);
          });
        })
        .catch(function(error) {
          console.error("Error getting documents: ", error);
        });
    }
  
    // Funktion zum Löschen aller Bestellungen
    function deleteAllOrders() {
      db.collection("orders").get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          });
          displayOrders();
        })
        .catch(function(error) {
          console.error("Error deleting documents: ", error);
        });
    }
  
    // Button-Eventlistener, um alle Bestellungen zu löschen
    deleteAllButton.addEventListener("click", function() {
      if (confirm("Möchtest du wirklich alle Bestellungen löschen?")) {
        deleteAllOrders();
      }
    });
  
    // Funktion zum Abrufen und Anzeigen von bereiten Bestellungen
    function displayReadyOrders() {
      readyOrdersBody.innerHTML = "";
      db.collection("readyOrders").get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            const orderData = doc.data();
            const row = readyOrdersBody.insertRow();
  
            const nameCell = row.insertCell(0);
            const productCell = row.insertCell(1);
            const actionsCell = row.insertCell(2);
  
            nameCell.textContent = orderData.name;
            productCell.textContent = orderData.product;
  
            const completeButton = document.createElement("button");
            completeButton.textContent = "Bereit";
            completeButton.addEventListener("click", function() {
              db.collection("completedOrders").add(orderData)
                .then(function() {
                  doc.ref.delete();
                  displayReadyOrders();
                })
                .catch(function(error) {
                  console.error("Error moving order: ", error);
                });
            });
  
            actionsCell.appendChild(completeButton);
          });
        })
        .catch(function(error) {
          console.error("Error getting ready orders: ", error);
        });
    }
  
    // Initialisiere Anzeige
    displayOrders();
    displayReadyOrders();
    function refreshPage() {
        displayOrders();
        displayReadyOrders();
      }
      
      // Starte regelmäßiges Aktualisieren alle 2 Sekunden
      setInterval(refreshPage, 10000);
  });
  