const $ = require('jquery');
const { ipcRenderer } = require('electron');
let credenciales = null;
let productData = null;
let semaforo = null;

var jsonData = {
        "status": "HABEAS_DATA\/IDENTIDAD\/APROBAR",
        "message": "explicacion",
        "datosConsultado": {
          "Documento": 25501110,
          "Nombre": "OCHOA, LUIS HORACIO",
          "Edad": 0,
          "score_veraz": {
            "valor": 1,
            "estado": "malo"
          },
          "income_predictor": "-",
          "CMI": 0,
          "actividad_economica": {
            "TipoIngreso": "Rel. Dependencia - SIPA",
            "tipo_actividad": "",
            "antiguedad_laboral": "2 a 5 a\u00f1os",
            "cuit_empleador": "30543740876"
          },
          "Poblacion": "ok",
          "Domicilios": [
            "URQUIZA-267- _ -4200-SANTIAGO DEL ESTERO ",
            " 262-2734- _ -4200-SANTIAGO DEL ESTERO ",
            " PJE 262-2734- _ -4200-SANTIAGO DEL ESTERO ",
            " INDEPENDENCIA-1081- _ -4200-SANTIAGO DEL ESTERO"
          ],
          "Telefonos": [
            "(0385)-422-1902 ",
            " 003850004221902 ",
            " 4167343 ",
            " 03854317654"
          ]
        },
        "consulta": [
          {
            "id": "juiciosComerciales",
            "titulo": "Juicios comerciales",
            "descripcion": "Son los juicios comerciales que tiene el consultado en los ultimos meses",
            "estado": "bueno",
            "detalles": [
              {
                "titulo": "Ultimos 12 meses",
                "valor": 0
              },
              {
                "titulo": "Ultimos 24 meses",
                "valor": 0
              },
              {
                "titulo": "Ultimos 60 meses",
                "valor": 0
              }
            ]
          },
          {
            "id": "chequesSinFondo",
            "titulo": "Cheques sin fondo",
            "descripcion": "son los cheques sin fondo que pertenecen al consultado",
            "estado": "bueno",
            "detalles": [
              {
                "titulo": "Ultimos 3 meses",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Ultimos 6 meses",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Ultimos 12 meses",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Ultimos 24 meses",
                "cantidad": 0,
                "monto": 0
              }
            ]
          },
          {
            "id": "chequesSinFondoNoPagados",
            "titulo": "Cheques sin fondo no pagados",
            "descripcion": "son los cheques sin fondo que no se pagaron que pertenecen al consultado",
            "estado": "bueno",
            "detalles": [
              {
                "titulo": "Ultimos 3 meses",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Ultimos 6 meses",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Ultimos 12 meses",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Ultimos 24 meses",
                "cantidad": 0,
                "monto": 0
              }
            ]
          },
          {
            "id": "cantidadComQui",
            "titulo": "Cantidad de Concursos o Quiebras",
            "descripcion": "Cantidad de concursos o quiebras del consultado en el ultimo tiempo",
            "estado": "bueno",
            "detalles": [
              {
                "titulo": "Ultimos 12 meses",
                "cantidad": 0
              },
              {
                "titulo": "Ultimos 24 meses",
                "cantidad": 0
              },
              {
                "titulo": "Ultimos 60 meses",
                "cantidad": 0
              }
            ]
          },
          {
            "id": "cantidadCon",
            "titulo": "Consultas Financieras y no financieras",
            "descripcion": "Cantidad de consultas Financieras y no financieras",
            "estado": "bueno",
            "detalles": [
              {
                "titulo": "ultimos mes",
                "cantidad": 0
              },
              {
                "titulo": "ultimos 3 meses",
                "cantidad": 0
              }
            ]
          },
          {
            "id": "statusBcra",
            "titulo": "Peor estado en el BCRA",
            "descripcion": "Peor status en el BCRA en los siguientes plazos",
            "estado": "malo",
            "detalles": [
              {
                "titulo": "Actual",
                "status": "5"
              },
              {
                "titulo": "ultimos 6 meses",
                "status": "5"
              },
              {
                "titulo": "de 7 a 12 meses",
                "status": ""
              },
              {
                "titulo": "de 13 a 24 meses",
                "status": ""
              },
              {
                "titulo": "Total de deuda",
                "monto": 49000
              }
            ]
          },
          {
            "id": "statusBureau",
            "titulo": "Status en Bureau",
            "descripcion": "Situacion del consultado en bureau",
            "estado": "bueno",
            "detalles": [
              {
                "titulo": "Actual",
                "status": "-"
              }
            ]
          },
          {
            "id": "cantEntInfo",
            "titulo": "Entidades que informan",
            "descripcion": "Cantidad y montos de entidades que informaron del consultado",
            "estado": "malo",
            "detalles": [
              {
                "titulo": "Situacion 1",
                "cantidad": 1,
                "monto": 43000
              },
              {
                "titulo": "Situacion 2",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Situacion 3",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Situacion 4",
                "cantidad": 0,
                "monto": 0
              },
              {
                "titulo": "Situacion 5",
                "cantidad": 1,
                "monto": 6000
              }
            ]
          },
          {
            "id": "obsVigBA",
            "titulo": "Observaciones vigentes en Base Abierta",
            "descripcion": "Observaciones y montos en Base Abierta",
            "estado": "bueno",
            "detalles": [
              {
                "titulo": "Cantidad en los ultimos 12 meses",
                "cantidad": 0
              },
              {
                "titulo": "Monto",
                "cantidad": 0
              }
            ],
            "Observaciones": [
              {
                "obsAdhRubro": "S",
                "obsAdhSubrubro": "OT",
                "obsAdherente": "C26680",
                "obsNombreAdh": "PEDIDOSYA S.A.",
                "obsMonto": 8836,
                "obsCodigo": "ISI",
                "obsGrupo": 3,
                "obsEstado": "VIG",
                "obsEstadoDesc": "VIGENTE",
                "obsFechaEstado": null,
                "obsDescripcion": "NUESTRO ADHERENTE PEDIDOSYA S.A. INFORMA EL 20200909, SITUACION IRREGULAR DEL RUBRADO. OPERACION FACTURA IMPAGA, C\/PRENDA TITULAR OP: 8000148983 MONTO: 8836.0",
                "obsFechaHasta": "24\/06\/2024",
                "obsExpediente": "PUBLICO",
                "obsFechaAlta": "25\/06\/2019",
                "obsCampo1": "C266800000SR",
                "obsDuracionMeses": 0,
                "obsEstadoFhHabilitado": null,
                "obsRecepcionEnVerazFh": null
              }
            ]
          },
          {
            "id": "obsVigBC",
            "titulo": "Observaciones vigentes en Banco Central",
            "descripcion": "Observaciones y montos en Banco Central",
            "estado": "bueno",
            "detalles": [
              {
                "titulo": "Cantidad en los ultimos 12 meses",
                "cantidad": 0
              },
              {
                "titulo": "Monto",
                "cantidad": 0
              }
            ],
            "Observaciones": "-"
          }
        ]
};
 
// Mostrar algunos datos en la consola
console.log("Nombre: " + jsonData.datosConsultado.Nombre);
console.log("Documento: " + jsonData.datosConsultado.Documento);
console.log("Edad: " + jsonData.datosConsultado.Edad);
console.log("Estado Veraz: " + jsonData.datosConsultado.score_veraz.estado);
console.log("Actividad Económica: " + jsonData.datosConsultado.actividad_economica.TipoIngreso);
// Mostrar Domicilios
console.log("Domicilios:");
jsonData.datosConsultado.Domicilios.forEach(function(domicilio) {
  console.log("- " + domicilio);
});

// Mostrar Teléfonos
console.log("Teléfonos:");
jsonData.datosConsultado.Telefonos.forEach(function(telefono) {
  console.log("- " + telefono);
});

// Mostrar información de consultas
console.log("Consultas:");
jsonData.consulta.forEach(function(consulta) {
  console.log("- " + consulta.titulo);
  console.log("  Descripción: " + consulta.descripcion);
  console.log("  Estado: " + consulta.estado);

  // Mostrar detalles de la consulta
  consulta.detalles.forEach(function(detalle) {
    console.log("  " + detalle.titulo + ": " + (detalle.cantidad || detalle.valor || detalle.status || detalle.monto));
  });
});
// Mostrar Observaciones vigentes en Base Abierta
console.log("Observaciones en Base Abierta:");
var obsVigBA = jsonData.consulta.find(function(consulta) {
  return consulta.id === "obsVigBA";
});
if (obsVigBA) {
  console.log("- Cantidad en los últimos 12 meses: " + obsVigBA.detalles[0].cantidad);
  console.log("- Monto: " + obsVigBA.detalles[1].cantidad);

  // Mostrar detalles de observaciones
  obsVigBA.Observaciones.forEach(function(obs) {
    console.log("  Observación: " + obs.obsDescripcion);
    console.log("    Monto: " + obs.obsMonto);
  });
} else {
  console.log("No hay observaciones en Base Abierta.");
}



var juiciosTable = document.getElementById('juiciosTable');
// Mostrar datos en el DOM
function mostrarDatos() {
    var objeto = JSON.parse(jsonData)
    // Juicios Comerciales
    var juiciosComerciales = objeto.datosConsultado.find(item => item.id === "juiciosComerciales");

    console.log(juiciosComerciales)

    if (juiciosComerciales) {
        var juiciosHTML = '<thead><tr><th>Periodo</th><th>Monto</th></tr></thead><tbody>';

        juiciosComerciales.detalles.forEach(function (detalle) {
            juiciosHTML += '<tr><td>' + detalle.titulo + '</td><td>' + detalle.valor + '</td></tr>';
        });

        juiciosHTML += '</tbody>';
        juiciosTable.innerHTML = juiciosHTML;
        console.log(juiciosHTML)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    mostrarDatos();
});










 /*Dropdown Menu*/
 $('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/

$('.dropdown-menu li').click(function () {
var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
msg = '<span class="msg">Hidden input value: ';
$('.msg').html(msg + input + '</span>');
}); 
$(document).ready(function () {
        const $open = $('.open');
        const $modal_container = $('#modal_container');
        const $close = $('#close');
        const $modalTitle = $('#modalTitle');
        const $modalTable = $('#modalTable');
        const $acquisitionsContainer = $('#acquisitionsContainer');
        const $acquisitionsCanvas = $('#acquisitions');

        $open.click(function () {
            const title = $(this).data('title');
            const tableType = $(this).data('table');
            const showChart = $(this).data('show-chart');

            // Cambiar el título del modal
            $modalTitle.text(title);

            // Cambiar dinámicamente la estructura de la tabla
            if (tableType === 'evolucion') {
                // Lógica para la tabla de Evolución
                $modalTable.html(`
                    <thead>
                        <tr>
                            <th>Periodo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Contenido de la tabla de Evolución -->
                    </tbody>
                `);

                // Mostrar el contenedor de adquisiciones solo para Evolución
                $acquisitionsContainer.show();
            } else if (tableType === 'composicion') {
                // Lógica para la tabla de Composición
                $modalTable.html(`
                    <thead>
                        <tr>
                            <th>Situación</th>
                            <th>Entidad</th>
                            <th>Monto</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Contenido de la tabla de Composición -->
                        <tr>
                            <td>Composición 1</td>
                            <td>Entidad 1</td>
                            <td>Monto 1</td>
                            <td>Cantidad 1</td>
                        </tr>
                        <tr>
                            <td>Composición 2</td>
                            <td>Entidad 2</td>
                            <td>Monto 2</td>
                            <td>Cantidad 2</td>
                        </tr>
                        <!-- Agrega más filas según sea necesario -->
                    </tbody>
                `);

                // Ocultar el contenedor de adquisiciones solo para Composición
                $acquisitionsContainer.hide();
            }

            // Mostrar u ocultar el gráfico según el botón clicado
            if (showChart) {
                // Lógica para el gráfico (puedes ajustar según tus datos y necesidades)
                (async function() {
                    const data = [
                        { year: 2010, count: 10 },
                        { year: 2011, count: 20 },
                        { year: 2012, count: 15 },
                        { year: 2013, count: 25 },
                        { year: 2014, count: 22 },
                        { year: 2015, count: 30 },
                        { year: 2016, count: 28 },
                    ];

                    new Chart(
                        $acquisitionsCanvas[0],
                        {
                            type: 'line',
                            data: {
                                labels: data.map(row => row.year),
                                datasets: [
                                    {
                                        label: 'Acquisitions by year',
                                        data: data.map(row => row.count)
                                    }
                                ]
                            }
                        }
                    );
                })();
            } else {
                // Ocultar el contenedor de adquisiciones si no se muestra el gráfico
                $acquisitionsContainer.hide();
            }

            $modal_container.addClass('show');
        });

        $close.click(function () {
            $modal_container.removeClass('show');
        });

        $('#submitBtn').click(async (event) => {
          event.preventDefault();
          await ConsultaVeraz();
      })

      async function ConsultaVeraz() {
          const dni = $('#numeroInput').val();
          const sexo = $('#sexoInput').val();
          const data = {
                  primaryConsumer: {
                      variablesDeEntrada: {
                          documento: dni,
                          nombre: '',
                          sexo: sexo,
                      },
                      personalInformation: {
                          documento: dni,
                          nombre: '',
                          sexo: sexo,
                      },
                  },
              }
          ipcRenderer.send('solicitarConfig');
          waitForValue('credenciales').then((valor) => {
              credenciales = valor;
              console.log(credenciales);
          });
          waitForValue('productData').then((valor) => {
              productData = valor;
              console.log(productData);
          });
          waitForValue('semaforo').then((valor) => {
              semaforo = valor;
              console.log(semaforo);
          });
          const respuesta = FetchConsultaVeraz(data, semaforo, credenciales, productData);
          console.log(respuesta);
      }

      async function FetchConsultaVeraz(datosConsultado, semaforo, credenciales, productData) {
          try {
              const response = await $.ajax({
                  url: 'http://localhost/api-consultas-veraz/endpoint/consulta.php',
                  type: 'POST',
                  data: {
                      datosConsultado: datosConsultado,
                      semaforo: semaforo,
                      credenciales: credenciales,
                      productData: productData
                  }
              });

              const json = JSON.parse(response);
              return json;
          } catch (error) {
              throw new Error("Error al hacer la consulta al servidor: " + error);
          }
      }

      const waitForValue = (nombreEvento) => {
          return new Promise((resolve) => {
              ipcRenderer.on(nombreEvento, (event, value) => {
                  resolve(value);
              });
          });
      };

      waitForValue('credenciales').then((valor) => {
          credenciales = valor;
          console.log(credenciales);
      });

      waitForValue('productData').then((valor) => {
          productData = valor;
          console.log(productData);
      });

      waitForValue('semaforo').then((valor) => {
          semaforo = valor;
          console.log(semaforo);
      });
    });


