document.addEventListener("DOMContentLoaded", function() {
    const welcomePopup = document.getElementById("welcomePopup");
    const closeWelcomeButton = document.getElementById("closeWelcomeButton");

    closeWelcomeButton.addEventListener("click", function() {
        welcomePopup.style.display = "none";
        showStudentForm();
    });

    welcomePopup.style.display = "block";
});

let studentsArray = []; // Lista para almacenar los estudiantes

function showStudentForm() {
    const studentForm = document.getElementById("studentForm");
    studentForm.style.display = "block";

    // Ocultar el botón "Comenzar" y el título "Programa de la Facultad"
    const startButton = document.getElementById("startButton");
    const pageTitle = document.querySelector("h1");
    startButton.style.display = "none";
    pageTitle.style.display = "none";

    // Agregar evento al formulario para capturar los datos del alumno
    const studentDataForm = document.getElementById("studentDataForm");
    studentDataForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addStudentToList();
    });
}

function addStudentToList() {
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const grade1 = parseFloat(document.getElementById("grade1").value);
    const grade2 = parseFloat(document.getElementById("grade2").value);
    const grade3 = parseFloat(document.getElementById("grade3").value);

    // Validar que name y surname tengan al menos 3 letras y solo contengan letras y espacios
    const namePattern = /^[A-Za-z\s]{3,}$/;
    
    if (!name.match(namePattern)) {
        alert("El campo 'Nombre' debe tener al menos 3 letras y contener solo letras y espacios.");
        return;
    }

    if (!surname.match(namePattern)) {
        alert("El campo 'Apellido' debe tener al menos 3 letras y contener solo letras y espacios.");
        return;
    }

    const student = {
        name: name,
        surname: surname,
        grades: [grade1, grade2, grade3]
    };

    calculateAverageAndStatus(student); // Calcular promedio y estado del alumno

    studentsArray.push(student); // Agregar al estudiante a la lista

    // Limpiar el formulario después de agregar un estudiante
    document.getElementById("studentDataForm").reset();

    // Llamada a la función para mostrar la lista de estudiantes
    displayStudentList(studentsArray);
}

function calculateAverageAndStatus(student) {
    let average = student.grades.reduce((sum, grade) => sum + grade, 0) / 3;
    student.average = average.toFixed(2);

    if (average >= 6) {
        student.status = "Aprobado";
    } else if (average >= 4) {
        student.status = "Recuperación";
    } else {
        student.status = "Desaprobado";
    }
}

function displayStudentList(studentsArray) {
    const studentTableBody = document.getElementById("studentTableBody");
    studentTableBody.innerHTML = ""; // Limpiar contenido existente

    for (let i = 0; i < studentsArray.length; i++) {
        const student = studentsArray[i];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.surname}</td>
            <td>${student.grades[0]}</td>
            <td>${student.grades[1]}</td>
            <td>${student.grades[2]}</td>
            <td>${student.average}</td>
            <td>${student.status}</td>
            <td>
                <button class="edit-button" data-index="${i}">Editar</button>
                <button class="delete-button" data-index="${i}">Eliminar</button>
            </td>
        `;
        studentTableBody.appendChild(row);
    }

    // Mostrar la sección de información de estudiantes
    const studentInfoDiv = document.getElementById("studentInfo");
    studentInfoDiv.style.display = "block";

    // Agregar eventos a los botones de editar y eliminar
    const editButtons = document.querySelectorAll(".edit-button");
    const deleteButtons = document.querySelectorAll(".delete-button");

    editButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            const index = event.target.getAttribute("data-index");
            editStudent(index);
        });
    });

    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            const index = event.target.getAttribute("data-index");
            deleteStudent(index);
        });
    });
}

function editStudent(index) {
    const student = studentsArray[index];
    
    // Rellenar el formulario de edición con los datos actuales
    document.getElementById("editIndex").value = index;
    document.getElementById("editName").value = student.name;
    document.getElementById("editSurname").value = student.surname;
    document.getElementById("editGrade1").value = student.grades[0];
    document.getElementById("editGrade2").value = student.grades[1];
    document.getElementById("editGrade3").value = student.grades[2];

    // Mostrar la ventana emergente de edición
    const editPopup = document.getElementById("editPopup");
    editPopup.style.display = "block";

    // Agregar evento al formulario de edición
    const editStudentForm = document.getElementById("editStudentForm");
    editStudentForm.addEventListener("submit", function(event) {
        event.preventDefault();
        saveEditedStudent();
    });

    // Agregar evento al botón de cancelar edición
    const cancelEditButton = document.getElementById("cancelEditButton");
    cancelEditButton.addEventListener("click", function() {
        editPopup.style.display = "none";
    });
}

function saveEditedStudent() {
    const index = parseInt(document.getElementById("editIndex").value);
    const newName = document.getElementById("editName").value;
    const newSurname = document.getElementById("editSurname").value;
    const newGrade1 = parseFloat(document.getElementById("editGrade1").value);
    const newGrade2 = parseFloat(document.getElementById("editGrade2").value);
    const newGrade3 = parseFloat(document.getElementById("editGrade3").value);

    if (
        newName.trim() !== "" &&
        newSurname.trim() !== "" &&
        !isNaN(newGrade1) &&
        !isNaN(newGrade2) &&
        !isNaN(newGrade3)
    ) {
        studentsArray[index].name = newName;
        studentsArray[index].surname = newSurname;
        studentsArray[index].grades = [newGrade1, newGrade2, newGrade3];

        // Recalcular el promedio después de editar las notas
        calculateAverageAndStatus(studentsArray[index]);

        // Actualizar la tabla y ocultar la ventana emergente de edición
        displayStudentList(studentsArray);
        document.getElementById("editPopup").style.display = "none";
    }
}

function deleteStudent(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
        studentsArray.splice(index, 1);
        displayStudentList(studentsArray); // Actualizar la tabla
    }
}

// Función para guardar en LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("studentsArray", JSON.stringify(studentsArray));
}

// Función para cargar desde LocalStorage
function loadFromLocalStorage() {
    const storedStudents = localStorage.getItem("studentsArray");
    if (storedStudents) {
        studentsArray = JSON.parse(storedStudents);
        displayStudentList(studentsArray); // Mostrar estudiantes almacenados
    }
}

// Cargar estudiantes almacenados al cargar la página
loadFromLocalStorage();

// Agregar evento al botón "Guardar en LocalStorage"
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", saveToLocalStorage);
