///////////////////////////////////////////
function blinkTitle(selector){
     $(selector)
    .animate({
        opacity: 1 },
        100, function() {
        $(this).css('color', 'white');
    })
    .animate({
        opacity: 1},
        100, function() {
         $(this).css('color', 'yellow');
    })
    .animate({
        opacity: 1},
        100, function() {
         $(this).css('color', 'blue');
    })
    .animate({
        opacity: 1},
        100, function() {
         $(this).css('color', 'red');
    })
    .animate({
        opacity: 1},
        100, function() {
        blinkTitle("h1.main-titulo")
    });

}/////////////////////////////////

function cdwnTimer(){
    var timer = new easytimer.Timer();
    timer.reset();
    timer.stop();
     $('#timer').html("02:00");
    timer.start({countdown: true, startValues: {seconds: 10}});
    $('#timer').html(timer.getTimeValues().toString(['minutes', 'seconds']));
    timer.addEventListener('secondsUpdated', function (e) {
        $('#timer').html(timer.getTimeValues().toString(['minutes', 'seconds']));
    });
   timer.addEventListener('targetAchieved', function (e) {
       terminaJuego()
    });
}
////////////////////////////////////////////////////
function terminaJuego() {
    $('div.panel-tablero, div.time').effect('fold','slow');
    $('h1.main-titulo').addClass('title-over')
        .text('Gracias por jugar!');
    $('div.score, div.moves, div.panel-score').width('100%');
    
}

//////////////////////////////////////////////////
function iniciarJuego(){
    
    cdwnTimer() 
    llenarTablero()
}
/////////////////////////////////////
function obtenerNumero() {
    var x = Math.floor((Math.random() * 4) + 1);
    return x;
}
///////////////////////////////////
function llenarTablero(){
    var max = 6;
    var column = $('[class^="col-"]');

    column.each(function () {
        var candys = $(this).children().length;
        var add = max - candys;
        for (var i = 0; i < add; i++) {
            var typeCandy = obtenerNumero();
            if (i === 0 && candys < 1) {
                $(this).append('<img src="image/' + typeCandy + '.png" class="element candyitem"></img>');
            } else {
                $(this).find('img:eq(0)').before('<img src="image/' + typeCandy + '.png" class="element candyitem"></img>');
            }
        }
    });
    agregaEventosCandy();

}
///////////////////////////////////////////
function agregaEventosCandy() {
    $('img').draggable({
        containment: '.panel-tablero',
        droppable: 'img',
        revert: true,
        revertDuration: 500,
        grid: [100, 100],
        zIndex: 10,
        drag: constrainCandyMovement
    });
    $('img').droppable({
        drop: swapCandy
    });
    activaEventosC();
    validarTablero();
}

////////////////////////////////////
function activaEventosC() {
    $('img').draggable('enable');
    $('img').droppable('enable');
}
/////////////////////////////////////////
function desactivaEventos() {
    $('img').draggable('disable');
    $('img').droppable('disable');
}
///////////////////////////////////////
function constrainCandyMovement(event, candyDrag) {
    candyDrag.position.top = Math.min(100, candyDrag.position.top);
    candyDrag.position.bottom = Math.min(100, candyDrag.position.bottom);
    candyDrag.position.left = Math.min(100, candyDrag.position.left);
    candyDrag.position.right = Math.min(100, candyDrag.position.right);
}
////////////////////////////////////
function swapCandy(event, candyDrag) {
    var candyDrag = $(candyDrag.draggable);
    var dragSrc = candyDrag.attr('src');
    var candyDrop = $(this);
    var dropSrc = candyDrop.attr('src');
    candyDrag.attr('src', dropSrc);
    candyDrop.attr('src', dragSrc);

    setTimeout(function () {
        llenarTablero();
        if ($('img.delete').length === 0) {
            candyDrag.attr('src', dragSrc);
            candyDrop.attr('src', dropSrc);
        } else {
            movimientos();
        }
    }, 500);

}
////////////////////////////////////////////////
function validarTablero() {
    columnValidation();
    rowValidation();
    if ($('img.delete').length !== 0) {
        deletesCandyAnimation();
    }
}
/////////////////////////////////////////////////
function deletesCandyAnimation() {
    desactivaEventos();
    $('img.delete').effect('pulsate', 400);
    $('img.delete').animate({
            opacity: '0'
        }, {
            duration: 300
        })
        .animate({
            opacity: '0'
        }, {
            duration: 400,
            complete: function () {
                deletesCandy()
                    .then(checkBoardPromise)
                    //.catch(showPromiseError);
            },
            queue: true
        });
}
/////////////////////////////////////////////////
function deletesCandy() {
    return new Promise(function (resolve, reject) {
        if ($('img.delete').remove()) {
            resolve(true);
        } else {
            reject('No se pudo eliminar caramelo...');
        }
    })
}
///////////////////////////////////////////////
function deleteColumnCandy(candyPosition, candyColumn) {
    for (var i = 0; i < candyPosition.length; i++) {
        candyColumn.eq(candyPosition[i]).addClass('delete');
    }
}
///////////////////////////////////////////////
function columnValidation() {
    for (var j = 0; j < 7; j++) {
        var counter = 0;
        var candyPosition = [];
        var extraCandyPosition = [];
        var candyColumn = candyColumns(j);
        var comparisonValue = candyColumn.eq(0);
        var gap = false;
        for (var i = 1; i < candyColumn.length; i++) {
            var srcComparison = comparisonValue.attr('src');
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
            comparisonValue = candyColumn.eq(i);
        }
        if (extraCandyPosition.length > 2) {
            candyPosition = $.merge(candyPosition, extraCandyPosition);
        }
        if (candyPosition.length <= 2) {
            candyPosition = [];
        }
        candyCount = candyPosition.length;
        if (candyCount >= 3) {
            deleteColumnCandy(candyPosition, candyColumn);
            marcador(candyCount);
        }
    }
}
////////////////////////////////////////////////
function deleteColumnCandy(candyPosition, candyColumn) {
    for (var i = 0; i < candyPosition.length; i++) {
        candyColumn.eq(candyPosition[i]).addClass('delete');
    }
}
////////////////////////////////////////////////
function rowValidation() {
    for (var j = 0; j < 6; j++) {
        var counter = 0;
        var candyPosition = [];
        var extraCandyPosition = [];
        var candyRow = candyRows(j);
        var comparisonValue = candyRow[0];
        var gap = false;
        for (var i = 1; i < candyRow.length; i++) {
            var srcComparison = comparisonValue.attr('src');
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
            comparisonValue = candyRow[i];
        }
        if (extraCandyPosition.length > 2) {
            candyPosition = $.merge(candyPosition, extraCandyPosition);
        }
        if (candyPosition.length <= 2) {
            candyPosition = [];
        }
        candyCount = candyPosition.length;
        if (candyCount >= 3) {
            deleteHorizontal(candyPosition, candyRow);
            marcador(candyCount);
        }
    }
}
////////////////////////////////////////////////
function deleteHorizontal(candyPosition, candyRow) {
    for (var i = 0; i < candyPosition.length; i++) {
        candyRow[candyPosition[i]].addClass('delete');
    }
}
////////////////////////////////////////////////
function marcador(candyCount) {
    var score = Number($('#score-text').text());
    switch (candyCount) {
        case 3:
            score += 20;
            break;
        case 4:
            score += 40;
            break;
        case 5:
            score += 80;
            break;
        case 6:
            score += 100;
            break;
        case 7:
            score += 150;
    }
    $('#score-text').text(score);
}
////////////////////////////////////////////////
function movimientos() {
    var actualValue = Number($('#movimientos-text').text());
    var result = actualValue += 1;
    $('#movimientos-text').text(result);
}

////////////////////////////////////////////////

function candyRows(index) {
    var candyRow = giveCandyArrays('rows', index);
    return candyRow;
}

//////////////////////////////////////////////////
function candyColumns(index) {
    var candyColumn = giveCandyArrays('columns');
    return candyColumn[index];
}
////////////////////////////////////////////////
function giveCandyArrays(arrayType, index) {

    var candyCol1 = $('.col-1').children();
    var candyCol2 = $('.col-2').children();
    var candyCol3 = $('.col-3').children();
    var candyCol4 = $('.col-4').children();
    var candyCol5 = $('.col-5').children();
    var candyCol6 = $('.col-6').children();
    var candyCol7 = $('.col-7').children();

    var candyColumns = $([candyCol1, candyCol2, candyCol3, candyCol4,
        candyCol5, candyCol6, candyCol7
    ]);

    if (typeof index === 'number') {
        var candyRow = $([candyCol1.eq(index), candyCol2.eq(index), candyCol3.eq(index),
            candyCol4.eq(index), candyCol5.eq(index), candyCol6.eq(index),
            candyCol7.eq(index)
        ]);
    } else {
        index = '';
    }

    if (arrayType === 'columns') {
        return candyColumns;
    } else if (arrayType === 'rows' && index !== '') {
        return candyRow;
    }
}
////////////////////////////////////////////////
function checkBoardPromise(result) {
    if (result) {
        llenarTablero();
    }
}

//////////////////////////////////////////////

function showPromiseError(error) {
    console.log(error);
}
///////////////////////////////////////////////
$(function(){
//llenarTablero()  
blinkTitle("h1.main-titulo")
$('.btn-reinicio').click(function() {
     if ($(this).text() === 'Reiniciar') {
            location.reload(true);
             $('.btn-reinicio').html("Reiniciar");
            iniciarJuego();
        }
    $('.btn-reinicio').html("Reiniciar");

    iniciarJuego();   
});

   
});