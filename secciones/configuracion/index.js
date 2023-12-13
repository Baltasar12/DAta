const { ipcRenderer } = require('electron');
const $ = require('jquery');
const Swal = require('sweetalert2');
let semaforoGeneral;
let productData;
let credenciales;

$(document).ready(function () {

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
        GuardarValorSemaforoScore();
        const semaforo = semaforoGeneral;
        const infoGeneral = { productData: ProductData, semaforo: semaforo }
        console.log(infoGeneral);
        ipcRenderer.send('guardar-en-archivo', infoGeneral);
        Swal.fire({
            title: 'Configuracion guardada con exito.',
            text: '',
            icon: 'success',
         }).then(()=>{
            window.location.href = '../../index.html';
         });
    });



    $('.ctnSelectorVariablesSemaforo select').on('change', function () {
        const selectedOption = $(this).val();
        if (selectedOption === '-1') {
            return;
        }
        // Encuentra el contenedor .ctnVariablesElegidas en el mismo .ctnGeneralSemaforo
        const ctnVariablesElegidas = $(this).closest('.ctnSemaforoEstado').find('.ctnVariablesElegidas');
        const ctnSemaforoEstado = $(this).closest('.ctnSemaforoEstado');
        // Crea un contenedor con la clase "ctnVariableElegida"
        const ctnVariableElegida = $('<div class="ctnVariableElegida"></div>');
        // Agrega un párrafo con el texto de la opción seleccionada
        ctnVariableElegida.append('<p class="textVariableElegida">' + $(this).find('option:selected').text() + '</p>');
        // Agrega un botón de eliminar
        ctnVariableElegida.append('<button class="BtnEliminarVariable" value="' + selectedOption + '">Eliminar</button>');
        ctnVariablesElegidas.append(ctnVariableElegida);
        const ctnGeneralSemaforo = $(this).closest('.ctnGeneralSemaforo');
        const idSeccion = ctnGeneralSemaforo.attr('id');
        const seccion = ctnSemaforoEstado.attr('seccion');
        console.log('id de la seccion: ' + idSeccion);
        console.log('seccion: ' + seccion);
        EliminarOpcionSelectsCompartidos(ctnGeneralSemaforo, selectedOption);
        $(this).val('-1');
        GuardarValorEnSemaforo(idSeccion, seccion, selectedOption);
        AgregarEventoBtnEliminar();
        console.log(semaforoGeneral);
    });

    const waitForValue = (nombreEvento) => {
        return new Promise((resolve) => {
            ipcRenderer.on(nombreEvento, (event, value) => {
                resolve(value);
            });
        });
    };
    
    $('input[name="hastaScoreMaloOk"]').on('keyup', function () {
        $('input[name="desdeScoreRevisarOk"]').val( parseInt( $('input[name="hastaScoreMaloOk"]').val() ) + 1 );
        $('input[name="hastaScoreRevisarOk"]').attr('min', parseInt( $('input[name="hastaScoreMaloOk"]').val() ) + 1 );
    })

    $('input[name="hastaScoreRevisarOk"]').on('keyup', function () {
        $('input[name="desdeScoreBuenoOk"]').val( parseInt( $('input[name="hastaScoreRevisarOk"]').val()) +1);
    })

    $('input[name="hastaScoreMaloTh"]').on('keyup', function () {
        $('input[name="desdeScoreRevisarTh"]').val( parseInt( $('input[name="hastaScoreMaloTh"]').val())+1 );
        $('input[name="hastaScoreRevisarTh"]').prop('min', parseInt( $('input[name="hastaScoreMaloTh"]').val())+1 );
    })

    $('input[name="hastaScoreRevisarTh"]').on('keyup', function () {
        $('input[name="desdeScoreBuenoTh"]').val(parseInt( $('input[name="hastaScoreRevisarTh"]').val()) + 1);
    })

    waitForValue('semaforo').then((valor) => {
        semaforoGeneral = valor;
        ReiniciarSemaforo();
        console.log(semaforoGeneral);
    });

    waitForValue('productData').then((valor) => {
        productData = valor;
        completarInputsDesdeJSON(productData);
        console.log(productData);
    });

    waitForValue('credenciales').then((valor) => {
        credenciales = valor;
        completarInputsDesdeJSON(credenciales);
        console.log(credenciales);
    });

    function GuardarValorEnSemaforo(id, seccion, valor) {
        for (let index = 0; index < semaforoGeneral.length; index++) {
            if (semaforoGeneral[index]['id'] == id) {
                semaforoGeneral[index]['semaforo'][seccion][0].push(valor);
            }
        }
    }
    function AgregarEventoBtnEliminar() {
        $('.BtnEliminarVariable').on('click', function (event) {
            event.preventDefault();
            const ctnGeneralSemaforo = $(this).closest('.ctnGeneralSemaforo');
            const ctnSemaforoEstado = ctnGeneralSemaforo.find('.ctnSemaforoEstado');
            const idSeccion = ctnGeneralSemaforo.attr('id');
            const seccion = ctnSemaforoEstado.attr('seccion');
            const valor = $(this).attr('value');
            const ctnVariable = $(this).closest('.ctnVariableElegida');
            const textoValor = ctnVariable.find('.textVariableElegida').text();
            EliminarValorEnSemaforo(idSeccion, seccion, valor);
            AgregarOpcionSelectsCompartidos(ctnGeneralSemaforo, valor, textoValor);
            ctnVariable.remove();
        })
    }

    function EliminarValorEnSemaforo(id, seccion, valor) {
        for (let index = 0; index < semaforoGeneral.length; index++) {
            if (semaforoGeneral[index]['id'] == id) {
                const indiceAEliminar = semaforoGeneral[index]['semaforo'][seccion][0].indexOf(valor);
                semaforoGeneral[index]['semaforo'][seccion][0].splice(indiceAEliminar, 1);
            }
        }
    }

    function AgregarOpcionSelectsCompartidos(ctnGeneralSemaforo, valor, texto) {
        ctnGeneralSemaforo.find('select').each(function () {
            $(this).append('<option value="' + valor + '">' + texto + '</option>');
        });
    }

    function EliminarOpcionSelectsCompartidos(ctnGeneralSemaforo, selectedOption) {
        ctnGeneralSemaforo.find('.ctnSelectorVariablesSemaforo select').each(function () {
            $(this).find('option[value="' + selectedOption + '"]').remove();
        });
    }

    function ReiniciarSemaforo() {
        const seccionesEstado = ['bueno', 'revisar', 'malo'];
        const seccionesId = ['peor_status_bcra_actual', 'peor_status_bureau_actual'];
        for (let index = 0; index < semaforoGeneral.length; index++) {
            const idActual = semaforoGeneral[index]['id'];
            if (seccionesId.includes(idActual)) {
                for (let i = 0; i < seccionesEstado.length; i++) {
                    semaforoGeneral[index]['semaforo'][seccionesEstado[i]][0].length = 0;
                }
            }
            if (idActual == 'score_veraz') {
                for (let i = 0; i < seccionesEstado.length; i++) {
                    semaforoGeneral[index]['semaforo']['th'][seccionesEstado[i]].length = 0;
                }
                for (let i = 0; i < seccionesEstado.length; i++) {
                    semaforoGeneral[index]['semaforo']['ok'][seccionesEstado[i]].length = 0;
                }
            }
        } 
    }

    function GuardarValorSemaforoScore() {
        var semaforoVeraz = semaforoGeneral.find(function(objeto) {
            return objeto.id === 'score_veraz';
          });
        semaforoVeraz['semaforo']['th']['bueno'].push( [$('input[name="desdeScoreBuenoTh"]').val() , $('input[name="hastaScoreBuenoTh"]').val()]  );  
        semaforoVeraz['semaforo']['th']['revisar'].push( [$('input[name="desdeScoreRevisarTh"]').val() , $('input[name="hastaScoreRevisarTh"]').val()]  );  
        semaforoVeraz['semaforo']['th']['malo'].push( [$('input[name="desdeScoreMaloTh"]').val() , $('input[name="hastaScoreMaloTh"]').val()] );
        semaforoVeraz['semaforo']['ok']['bueno'].push( [$('input[name="desdeScoreBuenoOk"]').val() , $('input[name="hastaScoreBuenoOk"]').val()]  );
        semaforoVeraz['semaforo']['ok']['revisar'].push( [$('input[name="desdeScoreRevisarOk"]').val() , $('input[name="hastaScoreRevisarOk"]').val()]  );  
        semaforoVeraz['semaforo']['ok']['malo'].push( [$('input[name="desdeScoreMaloOk"]').val() , $('input[name="hastaScoreMaloOk"]').val()]  );
    }

    function completarInputsDesdeJSON(json) {
        // Obtén todos los elementos de entrada con atributo name
        const inputs = document.querySelectorAll('input[name]');
      
        // Itera sobre cada elemento de entrada
        inputs.forEach(input => {
          // Obtén el nombre del atributo name del elemento
          const nombreAtributo = input.getAttribute('name');
      
          // Verifica si el nombre del atributo existe en el JSON
          if (json.hasOwnProperty(nombreAtributo)) {
            // Establece el valor del elemento de entrada con el valor correspondiente del JSON
            input.value = json[nombreAtributo];
          }
        });
      }


});

