let gorevListesi = []; // gorev listesi adında değişen oluşturduk id ve isimleri döngü içinde değiştirmek için

if (localStorage.getItem("gorevListesi") !== null) {
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}



let editId;
let iseditTask = false;

const taskInput = document.querySelector("#txtTaskName"); // input a ulaştık ve taskInput adıyla bir değişkene atadık  // ekle butonuna id ile ulaştık ve lick eventi ekledik
const btnClear = document.querySelector("#btnClear");


const filters = document.querySelectorAll(".filters span");

displayTasks("all"); // sayfa yüklendiğinde elemanların çağırılması için aşağıdaki function u çağırıyoruz


function displayTasks(filters) {
    let ul = document.getElementById("task-list") // ul elemanlarına ulaştık

    ul.innerHTML = ""; // boş bir değer ekledik input içerisindeki bilgiyi ekle butonuna basıp eklemeye çalıştığımızda daha önceden içinde olan elemanları tekrar gelmemesi için

    if(gorevListesi.length == 0) {
        ul.innerHTML = "<p class='p-3 m-0'>Görev listeniz boş.</p>"
    }else {

        for (let gorev of gorevListesi) { // liste oluşturduk.Gorev listesi altındaki elemanlara gorev adı vererek tanımladık.Id ve gorev adrını templer ile güncelledik

           let completed = gorev.durum == "completed" ? "checked": "";

            if (filters == gorev.durum || filters == "all") {

            
            let li = `
                <li class="task list-group-item">
                    <div class="form-check">
                        <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}>
                        <label for="${gorev.id}" class="form-check-label ${completed}"> ${gorev.gorevAdi} </label>
                    </div>
                    <div class="dropdown">
                            <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Sil</a></li>
                                <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
                            </ul>
                    </div>
                </li>
            `;
            ul.insertAdjacentHTML("beforeend", li);  // liste ekledik.
        }
        

             }
        }
    }




/* event listeners */

document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document.querySelector("#btnAddNewTask").addEventListener("keypress", function(event) {
    if (event.key == "Enter") {
        document.getElementById("#btnAddNewTask").click();
    }

});

for(let span of filters) {
    span.addEventListener("click", function() {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
        
    })
}





/* listeye eleman ekleme */

function newTask(event) {        
    /* boş bilgi girildiğinde yazdırılmaması için kullandığımız kodlar */

    if(taskInput.value == "") {
        alert("görev Girmelisiniz")
    }else {
        if(!iseditTask) { // edit için ekledik
            // ekleme
            gorevListesi.push({"id": gorevListesi.length + 1, "gorevAdi": taskInput.value, "durum": "pending"}) // input içerisine yazılan yeni değer ekle butonuna basıldığında görev listesinin sonuna eklenecek
        }else {
            // güncelleme
            for(let gorev of gorevListesi) {
                if(gorev.id == editId) {
                    gorev.gorevAdi = taskInput.value;
                }
                iseditTask = false;
            }
        }
        
        taskInput.value = ""; // ekleye basıldıktan sonra input içindeki değerin silinmesi için
        displayTasks(document.querySelector("span.active").id); // Yazılması için tekrar çağırmamız gerekiyor
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    }
    event.preventDefault();// sayfanın yenilenmemesi için event i function a ekledik ve preventdefault kullandık
    
}


/* listeden eleman silme */

function deleteTask(id) {

    let deletedId;

    for(let index in gorevListesi) {
        if(gorevListesi[index].id == id) {
            deletedId = index;
        }
    }
    gorevListesi.splice(deletedId, 1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}

/* eleman güncelleme  start */

function editTask(taskId, taskName) {
    editId = taskId;
    iseditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");
}
/* eleman güncelleme  end */




/* temizle butonu start */

btnClear.addEventListener("click", function() {
    gorevListesi.splice(0, gorevListesi.length);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    displayTasks();
})



/* temizle butonu end */

/* Tamamlanan görevin işaretlenmesi */

function updateStatus(selectedTask) {
    let label = selectedTask.nextElementSibling;
    let durum;

    if (selectedTask.checked) {
        label.classList.add("checked");
        durum = "completed";
    } else {
        label.classList.remove("checked");
        durum = "pending";
    }

    for (let gorev of gorevListesi) {
        if(gorev.id == selectedTask.id) {
            gorev.durum = durum;
        }
    }
    displayTasks(document.querySelector("span.active").id)
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}

/* Tamamlanan görevin işaretlenmesi */
