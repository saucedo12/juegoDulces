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

///////////////cambia el color del titutlo/////////////////////////

function colorTituloJuego(tittle) {
	$(tittle).animate({
			opacity: '2',
		}, {
			step: function () {
				$(this).css('color', 'white');
			},
			queue: true
		})
		.animate({
			opacity: '2'
		}, {
			step: function () {
				$(this).css('color', 'yellow');
				colorTituloJuego('h1.main-titulo');
			},
			queue: true
		});
}


/////////////// Obtiene números aleatorios////////////////
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

////////////////////
function giveCandyArrays(arrayType, index) {

	var Col1 = $('.col-1').children();
	var Col2 = $('.col-2').children();
	var Col3 = $('.col-3').children();
	var Col4 = $('.col-4').children();
	var Col5 = $('.col-5').children();
	var Col6 = $('.col-6').children();
	var Col7 = $('.col-7').children();

	var Columns = $([Col1, Col2, Col3, Col4,
		Col5, Col6, Col7
	]);

	if (typeof index === 'number') {
		var Row = $([Col1.eq(index), Col2.eq(index), Col3.eq(index),
			Col4.eq(index), Col5.eq(index), Col6.eq(index),
			Col7.eq(index)
		]);
	} else {
		index = '';
	}

	if (arrayType === 'columns') {
		return Columns;
	} else if (arrayType === 'rows' && index !== '') {
		return Row;
	}
}

//////////Crea filas////////
function candyRows(index) {
	var candyRow = giveCandyArrays('rows', index);
	return candyRow;
}

// Crea columnas
function candyColumns(index) {
	var candyColumn = giveCandyArrays('columns');
	return candyColumn[index];
}

// Valida si hay dulces que se eliminarán en una columna
function columnValidation() {
	
	for (var j = 0; j < 7; j++) {
		var counter = 0;
		var candyPosition = [];
		// Salvará la posición de dulces extra
		var extraCandyPosition = [];
		// Crea una candyColumn
		var candyColumn = candyColumns(j);
		// Toma el primer objeto de CandyColumn
		var comparisonValue = candyColumn.eq(0);
		// Se establecerá a true si hay una brecha entre las "líneas de dulces"
		var gap = false;
		// Itera sobre el objeto candyColumn
		for (var i = 1; i < candyColumn.length; i++) {
			// El src attr de comparisonValue
			var srcComparison = comparisonValue.attr('src');
			// El src attr del objeto después de comparisonValue
			var srcCandy = candyColumn.eq(i).attr('src');

			if (srcComparison != srcCandy) {
				if (candyPosition.length >= 3) {
					gap = true;
				} else {
					candyPosition = [];
				}
				counter = 0;
			} else {
				if (counter == 0) {
					if (!gap) {
						candyPosition.push(i - 1);
					} else {
						extraCandyPosition.push(i - 1);
					}
				}
				if (!gap) {
					candyPosition.push(i);
				} else {
					extraCandyPosition.push(i);
				}
				counter += 1;
			}
			// Comparación de actualizaciones Valor
			comparisonValue = candyColumn.eq(i);
		}
		// Si la posición extra de caramelo tiene más de dos elementos, se fusionó con la posición de caramelo
		if (extraCandyPosition.length > 2) {
			candyPosition = $.merge(candyPosition, extraCandyPosition);
		}
		// Si Candy Position tiene menos de / o dos elementos, se elimina
		if (candyPosition.length <= 2) {
			candyPosition = [];
		}
		// Candy Count es igual al número de elementos en Candy Position
		candyCount = candyPosition.length;
		// Si hubiera una "línea de dulces" de 3 o más
		if (candyCount >= 3) {
			deleteColumnCandy(candyPosition, candyColumn);
			setScore(candyCount);
		}
	}
}

// // Añade la clase "eliminar" a "líneas de dulces" que se encuentran en las columnas de dulces
function deleteColumnCandy(candyPosition, candyColumn) {
	for (var i = 0; i < candyPosition.length; i++) {
		candyColumn.eq(candyPosition[i]).addClass('delete');
	}
}

// Valida si hay dulces que deben eliminarse en una fila
function rowValidation() {
	// Itera sobre cada fila de dulces
	for (var j = 0; j < 6; j++) {
		var counter = 0;
		var candyPosition = [];
		var extraCandyPosition = [];
		var candyRow = candyRows(j);
		var comparisonValue = candyRow[0];
		var gap = false;
		for (var i = 1; i < candyRow.length; i++) {
			// El src attr de comparación Valor
			var srcComparison = comparisonValue.attr('src');
			// the src attr of the object after comparisonValue
			var srcCandy = candyRow[i].attr('src');

			if (srcComparison != srcCandy) {
				if (candyPosition.length >= 3) {
					gap = true;
				} else {
					candyPosition = [];
				}
				counter = 0;
			} else {
				if (counter == 0) {
					if (!gap) {
						candyPosition.push(i - 1);
					} else {
						extraCandyPosition.push(i - 1);
					}
				}
				if (!gap) {
					candyPosition.push(i);
				} else {
					extraCandyPosition.push(i);
				}
				counter += 1;
			}
			// Updates comparisonValue
			comparisonValue = candyRow[i];
		}
		// If extraCandyPosition has more than two elements, it's merged with candyPosition
		if (extraCandyPosition.length > 2) {
			candyPosition = $.merge(candyPosition, extraCandyPosition);
		}
		// If candyPosition has less than/or two elements, it is deleted
		if (candyPosition.length <= 2) {
			candyPosition = [];
		}
		// CandyCount is equal to the number of elements in candyPosition
		candyCount = candyPosition.length;
		// If there was a 'candy line' of 3 or more
		if (candyCount >= 3) {
			deleteHorizontal(candyPosition, candyRow);
			setScore(candyCount);
		}
	}
}

// Agrega la clase 'eliminar' a 'líneas de dulces' en las filas de dulces
function deleteHorizontal(candyPosition, candyRow) {
	for (var i = 0; i < candyPosition.length; i++) {
		candyRow[candyPosition[i]].addClass('delete');
	}
}

// Establece la puntuación de acuerdo al número de dulces que tienes
function setScore(count) {
	var score = Number($('#score-text').text());
	switch (count) {
		case 3:
			score += 10;
			break;
		case 4:
			score += 20;
			break;
		case 5:
			score += 30;
			break;
		case 6:
			score += 50;
			break;
		case 7:
			score += 100;
			break;
		case 8:
			score += 500;
			
	}
	$('#score-text').text(score);
}



// Establece las validaciones de columnas y fila
function validar() {
	columnValidation();
	rowValidation();
	// Si hay dulces que borrar
	if ($('img.delete').length !== 0) {
		deletesCandyAnimation();
	}
}

// Añade los eventos de dulces
function addDulcesEvents() {
	$('img').draggable({
		containment: '.panel-tablero',
		droppable: 'img',
		revert: true,
		revertDuration: 500,

	});
	$('img').droppable({
		drop: moverDulce
	});
	enableCandyEvents();
}

function disableCandyEvents() {
	$('img').draggable('disable');
	$('img').droppable('disable');
}

function enableCandyEvents() {
	$('img').draggable('enable');
	$('img').droppable('enable');
}



// Cambia un caramelo por otro
function moverDulce(event, dulceDrag) {

	var dulceDrag = $(dulceDrag.draggable);
	var dragSrc = dulceDrag.attr('src');
	var dulceDrop = $(this);
	var dropSrc = dulceDrop.attr('src');

	dulceDrag.attr('src', dropSrc);
	dulceDrop.attr('src', dragSrc);

	setTimeout(function () {
		tablero();
		// De esta manera, impedimos movimientos equivocados
		if ($('img.delete').length === 0) {
			// Caramelo Arrastrar y caramelo Drop se les da su posicion inicial
			dulceDrag.attr('src', dragSrc);
			dulceDrop.attr('src', dropSrc);
		} else {
			updateMoves();
		}
	}, 500);

}
//revisa el tabelero despues de eliminar
function checkTablero(result) {
	if (result) {
		tablero();
	}
}

// Actualiza el valor de los movimientos
function updateMoves() {
	var actualValue = Number($('#movimientos-text').text());
	var result = actualValue += 1;
	$('#movimientos-text').text(result);
}

// Animación que precede a la eliminación de dulces
function deletesCandyAnimation() {
	disableCandyEvents();
	$('img.delete').effect('pulsate', 700);
	$('img.delete').animate({
			opacity: '0'
		}, {
			duration: 500
		})
		.animate({
			opacity: '0'
		}, {
			duration: 400,
			complete: function () {
				deletesDulces()
					.then(checkTablero)
					
			},
			queue: true
		});
}
// Elimina el caramelo 
function deletesDulces() {
	return new Promise(function (resolve, reject) {
		if ($('img.delete').remove()) {
			resolve(true);
		} else {
			reject('No se pudo eliminar');
		}
	})
}


