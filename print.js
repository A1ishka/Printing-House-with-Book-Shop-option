//файл красивенький, но вот подключить его у меня почему-то не вышло

const selectElement = document.getElementById("image-select");
const imageElement = document.getElementById("selected-image");

selectElement.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    const imagePath = `../images/${selectedValue}.jpg`;
    imageElement.src = imagePath;
});


function uploadFile() {
    event.preventDefault();
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];
    var bookNameDiv = document.getElementById("bookName");

    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        let fileContent = reader.result;
        let firstLine = fileContent.split('\n')[0];
        console.log(firstLine);
        bookNameDiv.innerHTML = '<p>' + 'Хорошо, готовим к печати книгу с названием "' + firstLine + '".</p>';
    };
};

function loadImage() {
    event.preventDefault();
    let imageInput = document.getElementById("imageInput");
    let file = imageInput.files[0];
    let fileName = file.name;
            
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
        let imageDataUrl = reader.result;
        let imageElement = document.createElement("img");
        imageElement.src = imageDataUrl;
        var obl_Div = document.getElementById("book_obl");
        obl_Div.appendChild(imageElement);
    };
};

function validateForm(){
    var name = document.getElementById("name").value;
    var phone = document.getElementById("phone").value;
    var type = document.getElementById("selecting").value;
    var radioType = document.querySelector('input[name="r_type"]:checked').value;
    var checked = document.getElementById("checked").checked;

    if(name == "" || phone == ""){
        alert("Ввод контактных данных обязателен!");
        return false;
    }
    return true;
};
    
function AddData(index){
    event.preventDefault();
    alert("Заявка добавлена!");
    if (validateForm() == true){
        var name = document.querySelector("#name").value;
        var phone = document.querySelector("#phone").value;
        var selecting = document.getElementById("selecting").value;
        var r_type = document.querySelector('input[name="r_type"]:checked').value;
        var checked = document.getElementById("checked").checked;
        var dataList;
        if (localStorage.getItem("dataList") == null) {
            dataList = [];
        } else {
            dataList = JSON.parse(localStorage.getItem("dataList"));
        }
        dataList.push({
            name: name,
            phone: phone,
            selecting : selecting,
            r_type: r_type,
            checked: checked,
        });
        localStorage.setItem("dataList", JSON.stringify(dataList));
        document.querySelector("#name").value = "";
        document.querySelector("#phone").value = "";
        document.getElementsByName("selecting").value = "";
        document.getElementsByName("r_type").value = "";
        document.getElementsByName("checked").value = "";

    }
};

function deleteData(index){
    var dataList;
    if (localStorage.getItem("dataList") == null) {
        dataList = [];
    } else {
        dataList = JSON.parse(localStorage.getItem("dataList"));
    }
    dataList.splice(index,1);
    localStorage.setItem("dataList", JSON.stringify(dataList));
};

function deleteTempData(){
    if (confirm("Вы уверены, что хотите отчистить данные формы?") == true) order_form.reset();
};