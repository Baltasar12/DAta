const { ipcRenderer } = require('electron');

document.getElementById('formVariables').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe
    // Obtener todos los campos de texto del formulario
    var inputs = document.querySelectorAll('.ipTxt');
    var ProductData = {};
    // Recorrer los campos y almacenar sus valores en ProductData
    inputs.forEach(function (input) {
        ProductData[input.name] = input.value;
    });
    // Hacer algo con la variable ProductData, por ejemplo, mostrarla en la consola
    console.log(ProductData);
    ipcRenderer.send('guardar-en-archivo', ProductData);
});