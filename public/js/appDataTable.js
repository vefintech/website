
class AppDataTable {
    constructor(dataUrl, columnDataDef) {
        this.dataUrl = dataUrl;
        this.columnDataDef = columnDataDef;
        console.log("const")
    }
    initialize() {
        var t = $('.data-table').DataTable(
            {
               ajax:this.dataUrl, 
               columns: this.columnDataDef,
               processing: true,
               serverSide: true,
               ordering: true,
               language: {
                  "sProcessing":     "Procesando...",
                  "sLengthMenu":     "Mostrar _MENU_ registros",
                  "sZeroRecords":    "No se encontraron resultados",
                  "sEmptyTable":     "Ningún dato disponible en esta tabla",
                  "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                  "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                  "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                  "sInfoPostFix":    "",
                  "sSearch":         "Buscar:",
                  "sUrl":            "",
                  "sInfoThousands":  ",",
                  "sLoadingRecords": "Cargando...",
                  "oPaginate": {
                      "sFirst":    "Primero",
                      "sLast":     "Último",
                      "sNext":     "Siguiente",
                      "sPrevious": "Anterior"
                  },
                  "oAria": {
                      "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                      "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                  }
              }
            }
         ); 
         
         var dtable = $(".data-table").dataTable().api();

         $(".dataTables_filter input")
            .unbind() // Unbind previous default bindings
            .bind("input", function(e) { // Bind our desired behavior
                
                if(this.value.length >= 3 || e.keyCode == 13) {
                    dtable.search(this.value).draw();
                }
                
                if(this.value == "") {
                    dtable.search("").draw();
                }
                return;
         });

         return t;

    }
}