let db;

//create local db
const request = indexedDB.open("budget", 1);

// create object store
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.createObjectStore("pending");

  store.add(record);
}
function checkDatabase() {
  //check indexdb for pending transactions
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  const getAll = store.getAll();
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fatch("/api/transaction/bulk", {
        method: "POST",
        body: JOSN.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          //delete indexdb
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.createObjectStore("pending");
          store.clear();
        });
    }
  };
}

//listen for app to come backonline
window.addEventListener("online", checkDatabase);
