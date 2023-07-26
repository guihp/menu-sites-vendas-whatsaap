$(document).ready(function() {
    cardapio.eventos.iniciar();
})
// fazendo a mainipulação para escolha do produto 
var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;

var CELULAR_EMPRESA = '5599984457673';

cardapio.eventos = {

    iniciar: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoEncomenda(); 
        cardapio.metodos.carregarWhtsApp();
        cardapio.metodos.carregarWhtsappFooter();
    }
}

cardapio.metodos = {
    // obtem a lista de itens do cardapio
    obterItensCardapio: (categoria ='burgers', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $('#itensCardapio').html('');
            $('#btnVerMais').removeClass('hidden');
        
         }

        

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2)
            .replace('.', ','))
            .replace(/\${id}/g, e.id);

            // botão cer mais clicado para mostrar 12 itens 
            if(vermais && i >= 8 && i <12) {
                $('#itensCardapio').append(temp)
            }
            // pagina normal de 8 itens
            if (!vermais && i < 8) {
                $('#itensCardapio').append(temp)
            }
            

        })
        // remover o ativo
        $('.container-menu a').removeClass('active')

        // setar o menu para ativo

        $('#menu-' + categoria).addClass('active')
    },

      // TIRANDO O VER MAIS E FAZENDO ELE DUNCIONAR 

      verMais: () => {

        var ativo = $('.container-menu a.active').attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $('#btnVerMais').addClass('hidden');
      },
      // diminuir a quantidade do item no cardapio
      diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        
        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }
      },

      // aumentar a quantidade do item no cardapio
      aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
      },

      // adicionando ao carrinho os produtos

      adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        if (qntdAtual > 0) {
            // saber qual categoria ta ativa 
            var categoria = $('.container-menu a.active').attr('id').split('menu-')[1];

            // obter a lista de itens 
            let filtro = MENU[categoria];

            // obter o item
            let item = $.grep(filtro, (e, i) => {return e.id == id})
            if (item.length > 0) {
                // validade ser ja existe esse produto no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});

                //caso exista o produto no carrinho, vai so alterar a quantidade
                if (existe.length > 0 ){
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd =  MEU_CARRINHO[objIndex].qntd + qntdAtual;

                }
                // caso ainda não exista o item no carrinho, adiciona ele  
                else {
                    item[0].qntd = qntdAtual;
                     MEU_CARRINHO.push(item[0])
                }
                
                cardapio.metodos.mensagem('item adicionado ao carrinho', 'green')
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();
          
            }
        }

      },
      // mostrar os valores  totais nos botoes de meu carrinho 
      atualizarBadgeTotal: () => {
        var total = 0
        $.each(MEU_CARRINHO,(i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        } else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }
        $(".badge-total-carrinho").html(total);
      }, 
      // abrir a modal de carrinho
      abrirCarrinho: (abrir) => {
        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();

        }else {
            $("#modalCarrinho").addClass('hidden');
        }
      },

 // aqui vai alterar o texto e exibir os botoes das etapas 
 carregarEtapa: (etapa) => {
    if (etapa == 1) {
        $("#lblTituloEtapa").text('Seu carrinho:');
        $("#itensCarrinho").removeClass('hidden');
        $("#localEntrega").addClass('hidden');
        $("#resumoCarrinho").addClass('hidden');

        $(".etapa").removeClass('active');
        $(".etapa1").addClass('active');

        $("#btnEtapaPedido").removeClass('hidden');
        $("#btnEtapaEndereco").addClass('hidden');
        $("#btnEtapaResumo").addClass('hidden');
        $("#btnVoltar").addClass('hidden');
        
    }
    if (etapa == 2) {
        $("#lblTituloEtapa").text('Endereço de entrega:');
        $("#itensCarrinho").addClass('hidden');
        $("#localEntrega").removeClass('hidden');
        $("#resumoCarrinho").addClass('hidden');

        $(".etapa").removeClass('active');
        $(".etapa1").addClass('active');
        $(".etapa2").addClass('active');

        $("#btnEtapaPedido").addClass('hidden');
        $("#btnEtapaEndereco").removeClass('hidden');
        $("#btnEtapaResumo").addClass('hidden');
        $("#btnVoltar").removeClass('hidden');
    }
    if (etapa == 3) {
        $("#lblTituloEtapa").text('Resumo do Pedido:');
        $("#itensCarrinho").addClass('hidden');
        $("#localEntrega").addClass('hidden');
        $("#resumoCarrinho").removeClass('hidden');

        $(".etapa").removeClass('active');
        $(".etapa1").addClass('active');
        $(".etapa2").addClass('active');
        $(".etapa3").addClass('active');

        $("#btnEtapaPedido").addClass('hidden');
        $("#btnEtapaEndereco").addClass('hidden');
        $("#btnEtapaResumo").removeClass('hidden');
        $("#btnVoltar").removeClass('hidden');
    }
},

    // botão de voltar etapa
    voltarEtapa:() => {
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
    },


    // carrega a lista de produtos  do carrinho
    carregarCarrinho: () => {
        cardapio.metodos.carregarEtapa(1);
        if (MEU_CARRINHO.length > 0 ) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2)
                .replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd);

                $("#itensCarrinho").append(temp);
                // ultimo item do carrinho
                
                if ((i + 1) == MEU_CARRINHO.length){
                    cardapio.metodos.carregarValores();
                    
                }
            })
        }
        else {

            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio!</p>');
            cardapio.metodos.carregarValores();
        }
    },
 // diminuir quantidade do produto dentro do carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        
        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }
        else{
            cardapio.metodos.removerItemCarrinho(id);
        }

    },
 // aumentar quantidade do produto dentro do carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

    },
// para remover o produto do carrinho
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => {return e.id != id});
        cardapio.metodos.carregarCarrinho();

// vai atualizar o botão do carrinho atualizado
        cardapio.metodos.atualizarBadgeTotal();
    },

    // vai servir para atualizar o carrinho 

    atualizarCarrinho:(id, qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id ==id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // vai atualizar o botão do carrinho atualizado
        cardapio.metodos.atualizarBadgeTotal();
// atualizar os valores totais dos carrinhos
        cardapio.metodos.carregarValores();
    },
    // vai carregar os valores de entrega e total e subtotal
    carregarValores:() =>{
        VALOR_CARRINHO = 0;
        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {
            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ $${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }

        })
    },

    // carregar a etapa endereços 
    carregarEndereco:() => {
         if (MEU_CARRINHO <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio')
            return;
         }

         cardapio.metodos.carregarEtapa(2);
    },

    // criando o metodo buscar cep com API viaCEP

    buscarCep: () => {
        // criando a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');
        // verifica se o cep possui valor informado
        if(cep != "") {
            // expressão regular para validar o cCEP
            var validarcep = /^[0-9]{8}$/;
            if(validarcep.test(cep)){

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {
                    if (!("erro" in dados)) {
                        // atualizando os campos com os valores retornados 
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);                      
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);                   
                        $("#txtNumero").focus();
                    } else {

                        // cep deu erro
                        cardapio.metodos.mensagem('CEP não encontrado! Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }
                })

            }else {
                cardapio.metodos.mensagem('Formato do CEP invalido!');
                $("#txtCEP").focus();
            }
        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor!');
            $("#txtCEP").focus();
        }
    },
// validação dos campos antes de ir pro resumo pedido
    resumoPedido:() => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0){

            cardapio.metodos.mensagem("infome o CEP, por favor!");
            $("#txtCEP").focus();
            return;

        }
        if (endereco.length <= 0){

            cardapio.metodos.mensagem("infome o endereço, por favor!");
            $("#txtCEP").focus();
            return;

        }
        if (bairro.length <= 0){

            cardapio.metodos.mensagem("infome o bairro, por favor!");
            $("#txtCEP").focus();
            return;

        }
        if (cidade.length <= 0){

            cardapio.metodos.mensagem("infome a cidade, por favor!");
            $("#txtCEP").focus();
            return;

        }
        if (uf == "-1"){

            cardapio.metodos.mensagem("infome o UF, por favor!");
            $("#txtCEP").focus();
            return;

        }

        if (numero.length <= 0){

            cardapio.metodos.mensagem("infome o numero, por favor!");
            $("#txtCEP").focus();
            return;

        }

        if (complemento.length <= 0){

            cardapio.metodos.mensagem("infome o complemento, por favor!");
            $("#txtCEP").focus();
            return;

        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },


    // carregar o resumo do pedido 
    carregarResumo: () => {
        $("#listaItensResumo").html("");

        $.each(MEU_CARRINHO,(i, e)=> {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2)
            .replace('.', ','))
            .replace(/\${qntd}/g, e.qntd);

            $("#listaItensResumo").append(temp);

        });

        // definindo o local de entrega no resumo do pedido
        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro} `)
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}, ${MEU_ENDERECO.uf}, ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`)

        cardapio.metodos.finalizarPedido();
    },

    // atualiza o link do botão do whatsaap

    finalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null){
            var texto = 'Olá! gostaria de fazer um pedido:';
            texto += `\n*Itens do pedido:* \n\n\${itens}`;
            texto += `\n*Endereço de entrega:*`;
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto +=`\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}. ${MEU_ENDERECO.complemento}.`;
            texto += `\n\n*Total(com entrega): RS ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            var itens = '';
            $.each(MEU_CARRINHO, (i, e) => {
                itens +=`*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`
                // ultimo item
                if ((i + 1) == MEU_CARRINHO.length) {
                    texto = texto.replace(/\${itens}/g, itens);

                    //convertendo a url 
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`

                    $("#btnEtapaResumo").attr('href', URL);
                }

            })

        }
    },
// carrega o link do botão encomenda
    carregarBotaoEncomenda: () => {
        var texto = 'Olá! gostaria de fazer um *encomenda*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`

        $("#btnEncomenda").attr('href', URL);
    },
// vai fazer a ligação 
    carregarBotaoLigar: () => {
        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },
// organizando os depoimentos eleiminar isso depois para usar na panificadora ideal sabores 
    abrirDepoimento: (depoimento) => {
        
        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');
    },
    carregarWhtsApp: () => {

        var texto = 'Olá!';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`

        $("#btnWhatsApp").attr('href', URL)
    }, 

    carregarWhtsappFooter: () => {

        var texto = 'Olá!';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`

        $("#btnWhatsAppFooter").attr('href', URL)

    },

      // mensagens criadas 
      mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div> `;

         $("#container-mensagem").append(msg);

         setTimeout(() =>{
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {

            }, 800)
         }, tempo)
      },
}    





// adicionando o template que estava no html 
cardapio.templates = {
    item: `
    <div class="col-3 mb-5">
    <div class="card card-item id="\${id}"">
        <div class="img-produto">
            <img src="\${img}" >
        </div>
        <p class="title-produto text-center mt-4">
            <b>\${name}</b>
        </p>
        <p class="price-produto text-center">
            <b>R$ \${preco}</b>
        </p>
        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
            <span class="add-numero-itens" id="qntd-\${id}">0</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
            <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')" ><i class="fas fa-shopping-bag"></i></span>
        </div>
    </div>
</div>
    `, 
    itemCarrinho: ` 
    <div class="col-12 item-carrinho">
    <div class="img-produto">
        <img src="\${img}" >
    </div>
    <div class="dados-produto">
        <p class="title-produto">
            <b>\${name}</b>
        </p>
        <p class="price-produto"> 
        <b>R$ \${preco}</b>
        </p>
    </div>
    <div class="add-carrinho">
        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
        <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
        <span class="btn btn-remove"  onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
    </div>
</div>
    `,
    itemResumo: `
                                 <div class="col-12 item-carrinho resumo">
                                    <div class="img-produto-resumo">
                                        <img src="\${img}">
                                    </div>
                                    <div class="dados-produto">
                                        <p class="title-produto-resumo">
                                            <b>\${name}</b>
                                        </p>
                                        <p class="price-produto-resumo">
                                            <b>R$ \${preco}</b>
                                        </p>
                                    </div>
                                    <p class="quantidade-produto-resumo">
                                        x <b>\${qntd}</b>
                                    </p>
                                </div>
    `
    
}
