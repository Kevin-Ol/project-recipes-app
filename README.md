# Projeto Recipes App
![recipes-app](https://user-images.githubusercontent.com/82068881/133008026-08ff1b5f-648f-4da6-83a4-8faa45bbabaf.png)

***
Você pode acessar o site no ar [aqui](https://kevin-ol.github.io/project-recipes-app/).

Projeto em grupo feito como critério avaliativo na escola de programação **Trybe**.

Foram utilizadas as tecnologias ReactJS, Redux, Hooks, Styled Components, Material UI, testes com React Testing Library, e aplicadas as metodologias ágeis 
Scrum e Kanban com uso da ferramenta Trello.

O objetivo do projeto foi criar um Aplicativo de Receitas, onde é possível  visualizar, buscar, filtrar, favoritar e acompanhar o processo de preparação de 
refeições e drinks, com layout focado para dispositivos móveis, tomando como base uma tela 360x640 pixels. Foi fornecido apenas o 
[protótipo](https://www.figma.com/file/WatDxtKl7g54QxhDi9qdbq/App-Receitas?node-id=0%3A1) da aplicação através da plataforma Figma, onde fomos livres para 
escolher as tecnologias utilizadas durante o projeto.

O aplicativo foi criado contendo página de login com autenticação, consultas à 2 APIs diferentes: uma para comidas e outra para bebidas, funcionalidades para 
pesquisar de acordo com ingrediente, país, textos e filtros de categoria. Nas páginas de receitas, há a funcionalidade de iniciar uma receita, onde a página se torna
uma checkbox sendo possível marcar os ingredientes acrescentados e por fim finalizar a receita. Na página de perfil, é possível acessar as receitas já finalizadas e
também as favoritadas. Caso inicie uma receita e entre nela novamente, os ingredientes continuam marcados. Em várias telas existem as funções de compartilhar a receita,
que copia o link da mesma para a área de transferência, ou de favoritar, que salva ela na página de favoritos. Todas as ações da pessoa usuária são salvas no local
storage do navegador. Por fim foram desenvolvidos os testes unitários do projeto utilizando a bilioteca React Testing Library, onde foi possível atender um 
percentual superior a 99% de cobertura de testes.

***
Os requisitos que compõem projeto são:

:white_check_mark: Desenvolver testes unitários com cobertura superior a 90%;

:white_check_mark: Criar página de login que:
- Possua campos para preenchimento de email e senha com suas respectivas validações;
- Tenha um botão que redireciona para a página de receitas, iniciando desabilitado até a validação dos campos;
- Ao clicar no botão, salvar o email e os tokens de validação no local storage do navegador;

:white_check_mark: Criar componente Header que:
- Possua ícones de acordo com o protótipo;
- Possua um link para a página de perfil e ferramenta de busca de acordo com o protótipo;
- Esteja disponível nas páginas de acordo com o protótipo;

:white_check_mark: Criar componente Barra de Busca que:
- Esteja posicionada logo abaixo do Header;
- Possua opções de pesquisa por ingrediente, nome e primeira letra;
- Busca na API correta de acordo com o local da página;
- Exiba todos os cards de receita caso encontre várias receitas;
- Exiba um alerta caso nenhuma receita seja encontrada;
- Redirecione para detalhes caso encontre apenas uma receita;

:white_check_mark: Criar componente Menu Inferior que:
- Possua ícones de acordo com o protótipo;
- Possua links para a página de comidas, de bebidas e explorar;
- Esteja disponível nas páginas de acordo com o protótipo;

:white_check_mark: Criar página principal de receitas que:
- Carregue as 12 primeiras receitas de bebida ou comida, de acordo com o local da página;
- Possua botões de filtro por categoria de acordo com local da página;
- Ao clicar em um dos filtros, carrega uma nova lista de receitas;
- Seja possível remover o filtro ao clicar no mesmo botão novamente;
- Seja possível aplicar apenas 1 filtro por vez;
- Possua o botão "All" que remove todos os filtros;
- Ao clicar em um card de receita, redireciona a pessoa usuária para a página de detalhes;

:white_check_mark: Criar página de detalhes de receitas que:
- Faz requisição à API correta de acordo com ID da receita;
- Contenha imagem, título, categoria, lista de ingredientes, instruções, vídeo caso exista e recomendações;
- As recomendações devem ser de bebidas em uma página de comida, e de comidas em uma página de bebida;
- As recomendações devem ser exibidas em um carrossel, mostrando 2 cards por vez;
- Exista botão de Iniciar Receita fixo na tela, que troca de texto para Continuar receita caso já tenha sido iniciada, ou não seja exibido caso a receita esteja finalizada;
- Ao clicar em Iniciar Receita, redireciona o usuário para página de receita em progresso;
- Possua botões de compartilhar receita, que copia link para área de transferência, e favoritar receita, salvando ela na página de favoritos;
- Salve receitas favoritas no local storage;

:white_check_mark: Criar página  de receitas em progresso que:
- Contenha imagem, título, categoria, lista de ingredientes em formato de checkbox, instruções e vídeo caso exista;
- Ao clicar em um ingrediente seu texto deve ficar riscado;
- Salva o estado da receita para caso a pessoa usuária não finalize;
- Possua botões de compartilhar receita, que copia link para área de transferência, e favoritar receita, salvando ela na página de favoritos;
- Possua botão de finalizar receita que só é habilitado com todos os ingredientes marcados e redireciona o usuário para a página de receitas feitas;

:white_check_mark: Criar página de receitas feitas que:
- Contenha botões de filtro all, bebidas e comidas;
- Possua cards de receitas finalizadas contendo imagem, titulo, categoria, data de finalização e botão de compartilhar;
- Ao clicar em um card de receita, redireciona a pessoa usuária para a página de detalhes;

:white_check_mark: Criar página de receitas favoritas que:
- Contenha botões de filtro all, bebidas e comidas;
- Possua cards de receitas favoritas contendo imagem, titulo, categoria, botões de compartilhar e desfavoritar;
- Desfavoritar uma receita a remove do local storage;
- Ao clicar em um card de receita, redireciona a pessoa usuária para a página de detalhes;

:white_check_mark: Criar página de explorar que:
- Contenha botões de explorar bebidas e explorar comidas;
- Ao clicar em um botão, redireciona para página de explorar bebidas ou explorar comidas;

:white_check_mark: Criar página de explorar bebidas que;
- Contenha botões de explorar por ingrediente e me surpreenda!;
- Ao clicar em explorar por ingredientes, redireciona para página de ingredientes de bebidas;
- Ao clicar em me surpreenda! redireciona para uma página de detalhes de receita de bebida aleatória;

:white_check_mark: Criar página de explorar comidas que;
- Contenha botões de explorar por ingrediente, por local de origem e me surpreenda!;
- Ao clicar em explorar por ingredientes, redireciona para página de ingredientes de comidas;
- Ao clicar em explorar por local de origem, redireciona para página de explorar por origem;
- Ao clicar em me surpreenda! redireciona para uma página de detalhes de receita de comida aleatória;

:white_check_mark: Criar página de explorar por ingredientes que;
- Carregue os 12 primeiros ingredientes, de acordo com o local da página;
- Ao clicar em um card de ingrediente, redireciona a pessoa usuária para a página de receitas contendo aquele ingrediente;

:white_check_mark: Criar página de explorar por local de origem que;
- Contenha um dropdown com os possíveis locais de origem de receitas;
- Carregue as 12 primeiras receitas, de acordo com o local de origem;
- Ao clicar em um card de receita, redireciona a pessoa usuária para a página de detalhes;

:white_check_mark: Criar página de perfil que;
- Exiba o email da pessoa usuária;
- Contenha botões de receitas feitas, receitas favoritas e sair;
- Ao clicar no botão receitas feitas redireciona a pessoa usuária para página de receitas feitas;
- Ao clicar no botão receitas favoritas redireciona a pessoa usuária para página de receitas favoritas;
- Ao clicar no botão sair limpa o local storage e redireciona a pessoa usuária para a página inicial;


