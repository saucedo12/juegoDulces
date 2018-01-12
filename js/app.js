///////////////EMPEZAR JUEGO/////////////////////////

$(function() {iniciarJuego();});
// Comienza el juego
function iniciarJuego() {
	colorTituloJuego('h1.main-titulo');
	$('.btn-reinicio').click(function () {
		if ($(this).text() === 'Reiniciar') {
			location.reload(true);
		}
		tablero();
		$(this).text('Reiniciar');
		$('#timer').startTimer({
			onComplete: finJuego
		})
	});
}

//////////// Se llama cuando el juego comienza//////////////////////////////

function tablero() {
	mostrarDulces();
}

function mostrarDulces() {
	var top = 6;
	var column = $('[class^="col-"]');

// Obtiene un tipo de caramelo al azar
	column.each(function () {
		var dulces = $(this).children().length;
		var agrega = top - dulces;
		for (var i = 0; i < agrega; i++) {
			var tipoDulce = getRandomInt(1, 5);
			// Si la columna está vacía
			if (i === 0 && dulces < 1) {
				$(this).append('<img src="image/' + tipoDulce + '.png" class="element"></img>');
			} else {
				$(this).find('img:eq(0)').before('<img src="image/' + tipoDulce + '.png" class="element"></img>');
			}
		}
	});
	addDulcesEvents();
	validar();
}

///////////////TERMINAR JUEGO/////////////////////////

function finJuego() {
	$('div.panel-tablero, div.time').effect('fold',1000);
	$('h1.main-titulo').addClass('title-over').text('Match Game');
	$('div.score, div.moves, div.panel-score').width('100%');

}

