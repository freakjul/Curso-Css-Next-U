var calculadora= {};

calculadora = (function(){
	var valor1, nro = 0;
	var valor2 = 0;
	var resultado = 0;
	var operacion = "";
	var captura = [];

	iniciarCalculadora();

		function guardarCaptura(captura, nro){					
				if(captura.length < 8){
					if(nro == "."){
					
						captura = captura + ".";
						return captura;
					}else{
						return (captura + nro);
					}
					
				}else {
					return captura;
				}

				
		}
		
		function truncarNumero(valor){

			if (valor % 1 == 0) {
				 valor = parseInt(valor);       
		    } else {
		       	valor = parseFloat(valor.toFixed(2));
		     	
		    }
		    if (valor.toString().length > 7){
					valor = valor.toExponential(4);
				}
			return valor;
		} 
	

		function pisarTecla (){
			 teclapis = this;
			 this.style.borderWidth = '3px';
			 var id = this.id;
			 var id1 = parseInt(id);

			 switch (id1){
			  	case 1:
			  	case 2:
			  	case 3:
			  	case 4:
			  	case 5:
			  	case 6:
			  	case 7:
			  	case 8:
			  	case 9:
			  	case 0:
			  		captura = guardarCaptura(captura, id);
			  		document.getElementById('display').innerHTML = captura;
			  		break;			  	
			  } 

			  switch (id){
			  	case "sign":
			  				if (captura != null || captura != 0)
							{
								captura = captura * -1;
								document.getElementById('display').innerHTML = captura;
							}
							break;
				case 	"punto": 	
								  if (captura.indexOf(".") == -1){
								  	if (captura == 0){
								  		captura = guardarCaptura(captura, "0.");
								  	}else {
								  		captura = guardarCaptura(captura, ".");	
								  	}								
								  }
								  document.getElementById('display').innerHTML = captura;
								  break;
				case       "on":valor1 = 0;
						 		valor2 = 0;
						 		resultado = 0;
						 		operacion = "";
								captura = "";
								document.getElementById('display').innerHTML = 0;
								break;
				case      "mas":
				case    "menos":
				case      "por":
				case "dividido":
							//if (resultado == 0) return;
			  				if (id == "mas"){operacion = "+";}
			  				if (id == "menos"){operacion = "-";}
			  				if (id == "por"){operacion = "*";}
			  				if (id == "dividido"){operacion = "/";}
			  				valor1 = captura;
			  				captura = "";
			  				document.getElementById('display').innerHTML = 0;	
			  				break;
			  	case 	"igual":
			  				valor2 = captura;
			  				if (parseFloat(valor1) == 0 || parseFloat(valor2) == 0){
			  					//alert("entre por cero");
			  					break;
			  					
			  				}
			  				if (resultado != 0){
			  					valor1 = resultado;
			  				}
			  				
				
							switch(operacion) {
								  case '+':
								    	resultado = parseFloat(valor1) + parseFloat(valor2);
								    break;
								  case '-':
								    	resultado = parseFloat(valor1) - parseFloat(valor2);
								    break;
								  case '/':
								    	resultado = parseFloat(valor1) / parseFloat(valor2);
								    break;
								  case '*':
								    	resultado = parseFloat(valor1) * parseFloat(valor2);
								    break;
								  /* case '=': 
								   		resultado = */
								  
								}	
								if (resultado != undefined){
									resultado = truncarNumero(resultado);	
								}
								
							   	
								document.getElementById('display').innerHTML = resultado;
								break;
			  }
        	

		}

		function soltarTecla() {
        	teclapis.style.borderWidth = '0';
    	}

		function iniciarCalculadora(){
		var teclas = document.querySelectorAll('.tecla');
	        for ( var i = 0; i < teclas.length; i++ ) {
	            teclas[i].style.width = "80px";
	            teclas[i].style.border = '0 solid #999';
	            teclas[i].onmousedown = pisarTecla;
	            teclas[i].onmouseup = soltarTecla;
	        }

		}	

}());

