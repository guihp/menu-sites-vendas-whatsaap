$(document).ready(function() {
    cardapio.eventos.iniciar();
})
// fazendo a mainipulação para escolha do produto 
var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {

    iniciar: () => {
        cardapio.metodos.obterItensCardapio();
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
            $("#modalCarrinho").removeClass('hidden')
        }else {
            $("#modalCarrinho").addClass('hidden')
        }
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
    `
}