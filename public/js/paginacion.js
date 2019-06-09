class Paginacion {
  constructor(props) {
    
    this.props = props;
  }

  setPagina(pagina) {
    this.props.onClick(pagina);
  }

  paginacion() {
    const size =10;
    const numeroPaginas = [];
    
    var endPage = (this.state.pagina+size);
    if(endPage>this.props.cantidadPaginas) {
      endPage = this.props.cantidadPaginas;
    }

    if (this.props.cantidadPaginas==0) {
      endPage=this.props.cantidadPaginas;
    }


    var beginPage = this.state.pagina;
    if ( (endPage-beginPage)<size) {
        beginPage = endPage-size;
    }

    if (this.state.pagina==1) {
      beginPage = this.state.pagina;
    }    


    for (let i = beginPage; i < endPage; i++) {
      numeroPaginas.push(i);
    }

    const paginas = numeroPaginas.map(numero => {
      let pagina = '';
      if (numero == this.state.pagina) {
        pagina = <PaginationItem
          active>
          <PaginationLink
            href="javascript:void(0)">
            {numero}
          </PaginationLink>
        </PaginationItem>
      }
      else {
        pagina = <PaginationItem >
          <PaginationLink
            onClick={() => this.setPagina(numero)}
            href="javascript:void(0)">
            {numero}
          </PaginationLink>
        </PaginationItem>
      }

      return pagina;
    });

    let primeraPagina = "";
    if (this.state.pagina == 1) {
      primeraPagina = <PaginationItem disabled>
        <PaginationLink
          previous
          href="javascript:void(0)" />
      </PaginationItem>
    }
    else {
      primeraPagina = <PaginationItem>
        <PaginationLink
          onClick={() => this.setPagina(this.state.pagina - 1)}
          previous
          href="javascript:void(0)" />
      </PaginationItem>
    }

    let ultimaPagina = "";
    if (this.state.pagina == this.props.cantidadPaginas) {
      ultimaPagina = <PaginationItem disabled>
        <PaginationLink next href="javascript:void(0)" />
      </PaginationItem>
    }
    else {
      ultimaPagina = <PaginationItem>
        <PaginationLink
          onClick={() => this.setPagina(this.state.pagina + 1)}
          next
          href="javascript:void(0)" />
      </PaginationItem>
    }


    return (<Pagination>
      {primeraPagina}
      {paginas}
      {ultimaPagina}
    </Pagination>);
  }

  render() {
    return this.paginacion()
  }


}
