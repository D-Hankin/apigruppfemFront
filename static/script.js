const getApiKeyDialog = document.getElementById("getApiKeyDialog");
const getApiKey = document.getElementById("getApiKey");
const deactivate = document.getElementById("deactivate");

deactivate.addEventListener("click", () => deactivateEventListener());

getApiKey.addEventListener("click", () => getApiKeyEventListener());

function getApiKeyEventListener () {
    getApiKeyDialog.innerHTML = "";
    let getApiKeyForm = document.createElement("form");
    let enterFirstName = document.createElement("input");
    enterFirstName.placeholder = "First Name";
    enterFirstName.required = true;
    let enterSecondName = document.createElement("input");
    enterSecondName.placeholder = "Second Name";
    enterSecondName.required = true;
    let enterEmail = document.createElement("input");
    enterEmail.placeholder = "@Email";
    enterEmail.type = "email";
    enterEmail.required = true;
    let submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.innerText = "Get API Key"
    submitButton.addEventListener("click", () => submitButtonEventListener(enterFirstName.value, enterSecondName.value, enterEmail.value));
    getApiKeyForm.append(enterFirstName, enterSecondName, enterEmail, submitButton);
    getApiKeyDialog.appendChild(getApiKeyForm);
    getApiKeyDialog.setAttribute("open", true);
}

function submitButtonEventListener(firstName, secondName, email) {

    console.log(firstName, secondName, email)
    
    if (firstName.trim() != "" && secondName.trim() != "" && email.trim() != "") {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const object = JSON.stringify({
          "email": email,
          "firstName": firstName,
          "lastName": secondName
        });
        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: object,
        };
        
        fetch("http://localhost:8080/api/user/create-user", requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                getApiKeyDialog.innerHTML = "";
                let message = document.createElement("h3");
                message.innerText = "Congratulations! Here is your unique API key...";
                let apiKey = document.createElement("h2");
                apiKey.innerText = data.apiKey;
                let message2 = document.createElement("h4");
                message2.innerText = "(Copy it now and keep it safe)";
                let closeBtn = document.createElement("button");
                closeBtn.type = "button";
                closeBtn.innerText = "Close";
                getApiKeyDialog.append(message, apiKey, message2, closeBtn);
                closeBtn.addEventListener("click", () => {
                    getApiKeyDialog.removeAttribute("open");
                })
            })
            .catch((error) => console.error(error));
    } else {
        alert("You need to fill in all the fields");
        getApiKeyDialog.removeAttribute("open");
    }
    
}

function deactivateEventListener() {
    getApiKeyDialog.innerHTML = "";
    let deactivateForm = document.createElement("form");
    let deactivateInput = document.createElement("input");
    deactivateInput.placeholder = "API Key";
    let deactivateBtn = document.createElement("button");
    deactivateBtn.type = "button";
    deactivateBtn.innerText = "Deactivate";
    let starMessage = document.createElement("h4");
    starMessage.innerText = "*Doing this will not remove content from the API connected to this API key.";
    deactivateForm.append(deactivateInput, deactivateBtn, starMessage);
    getApiKeyDialog.appendChild(deactivateForm);
    getApiKeyDialog.setAttribute("open", true);

    deactivateBtn.addEventListener("click", () => deactivateBtnEventListener(deactivateInput.value));
}

function deactivateBtnEventListener(apiKey) {

    if (apiKey.trim() != "") {
        fetch("http://localhost:8080/api/user/" + apiKey + "/deactivate-apikey", {
            method: "PATCH"
        }) 
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to deactivate API key: ${res.statusText}`);
            }
            return res.text();
        })
        .then(data => {
    
            getApiKeyDialog.innerHTML="";
    
            let doneMessage = document.createElement("h3")
            doneMessage.innerText = data;
            let closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.innerText = "close";
            getApiKeyDialog.append(doneMessage, closeBtn);
            closeBtn.addEventListener("click", () => {
                getApiKeyDialog.innerHTML ="";
                getApiKeyDialog.removeAttribute("open");
            })
        }).catch(error => {
            alert(error.message);
            getApiKeyDialog.removeAttribute("open");
        })
    } else {
        alert("You need to enter an API key.")
        getApiKeyDialog.removeAttribute("open");
    }
}
