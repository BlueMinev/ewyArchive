window.addEventListener("load", function () {
  let form = document.querySelector("#search form");

  form.addEventListener("submit", sendMessage);

  async function sendMessage(evt) {
    evt.preventDefault();
    reset();
    document.querySelector("#loading").style.display = "block";
    let search = document.querySelector("#searchbar").value.trim();
    let fields_ok = true;
    let success = true;
    if (search.length == 0) {
      fields_ok = false;
    }
    if (fields_ok) {
      // prepare data for transport to server
      let url = "http://localhost:3000/express_api?oid=12345678X";
      //url = url + search;
      // create variables for data on html page that will be changed
      let result = document.querySelector("#result");
      document.querySelector("#loading").style.display = "block";
      // perfom fetch api
      fetch(url)
        .then(function (response) {
          document.querySelector("#result").style.display = "block";
          // hide loading icon when we receive a the response
          document.querySelector("#loading").style.display = "none";
          return response.json();
        })
        .then(function (value) {
          var cardDiv = document.createElement("div");
          cardDiv.className = "card";
          var content = document.createElement("p");
            content.className = "returned";
            content.textContent = value;
            result.appendChild(content);
        })
        .catch(function (error) {
          console.log(error);
          document.querySelector("#error").style.display = "block";
          // hide loading icon when we receive the response
          document.querySelector("#loading").style.display = "none";
        });
    }

    let reset_error = document.querySelector("#reset_error");
    reset_error.addEventListener("click", reset);

    function reset(evt) {
      document.querySelector("#result").style.display = "none";
      document.querySelector("#error").style.display = "none";
      document.querySelector("#loading").style.display = "none";
      document.querySelector("#result").innerHTML = "";
    }
  }
});
