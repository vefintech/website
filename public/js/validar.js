			$(document).ready(function(){
				$('a[href^="#"]').on('click', function (e) {
					e.preventDefault();

					var target = this.hash;
					var $target = $(target);

					$('html, body').animate({
						'scrollTop': $target.offset().top
					}, 1000, 'swing');
				});
			});

	$(document).ready(function(){
		$("#div1").on( "click", function() {
			$('#natural').show(); //muestro mediante id
			$("#div1").css( 'border-color','#52E9FF');

			$('#juridica').hide(); //oculto mediante id
			$("#div2").css( 'border-color','#fff');

			$('#emprendedor').hide(); //oculto mediante id
			$("#div3").css( 'border-color','#fff');

			$('#aliado').hide(); //oculto mediante id
			$("#div4").css( 'border-color','#fff');

		 });
		$("#div2").on( "click", function() {
			$('#juridica').show(); //muestro mediante id
			$("#div2").css( 'border-color','#52E9FF');

			$('#natural').hide(); //oculto mediante id
			$("#div1").css( 'border-color','#fff');

			$('#emprendedor').hide(); //oculto mediante id
			$("#div3").css( 'border-color','#ffffff');

			$('#aliado').hide(); //oculto mediante id
			$("#div4").css( 'border-color','#fff');

		 });

		$("#div3").on( "click", function() {

			$('#emprendedor').show(); //muestro mediante id
			$("#div3").css( 'border-color','#52E9FF');

			$('#juridica').hide(); //oculto mediante id
			$("#div2").css( 'border-color','#fff');

			$('#natural').hide(); //oculto mediante id
			$("#div1").css( 'border-color','#fff');

			$('#aliado').hide(); //oculto mediante id
			$("#div4").css( 'border-color','#fff');

		 });
		$("#div4").on( "click", function() {

			$('#aliado').show(); //muestro mediante id
			$("#div4").css( 'border-color','#52E9FF');

			$('#juridica').hide(); //oculto mediante id
			$("#div2").css( 'border-color','#fff');

			$('#natural').hide(); //oculto mediante id
			$("#div1").css( 'border-color','#fff');

			$('#emprendedor').hide(); //oculto mediante id
			$("#div3").css( 'border-color','#fff');

		 });
	});



                  function isNumberKey(evt)
                  {
                     var charCode = (evt.which) ? evt.which : event.keyCode
                     if (charCode > 31 && (charCode < 48 || charCode > 57))
                        return false;
             
                     return true;
                  }


              function soloLetras(e){
		       key = e.keyCode || e.which;
		       tecla = String.fromCharCode(key).toLowerCase();
		       letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
		       especiales = "8-37-39-46";

		       tecla_especial = false
		       for(var i in especiales){
		            if(key == especiales[i]){
		                tecla_especial = true;
		                break;
		            }
		        }

		        if(letras.indexOf(tecla)==-1 && !tecla_especial){
		            return false;
		        }
		    }
	
	
