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
    });