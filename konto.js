document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submitOrder");
  
    submitButton.addEventListener("click", function() {
      const product = document.getElementById("product").value;
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const address = document.getElementById("address").value;
  
      const orderDetails = {
        product: product,
        name: name,
        phone: phone,
        address: address
      };
  
      
  
      // Firebase initialisieren
      firebase.initializeApp(firebaseConfig);
  
      // Firestore-Referenz
      const db = firebase.firestore();
  
      // Daten in Firestore speichern
      db.collection("orders").add(orderDetails)
        .then(function(docRef) {
          alert("Bestellung aufgegeben:\n\n" + JSON.stringify(orderDetails, null, 2));
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    });
  });
  