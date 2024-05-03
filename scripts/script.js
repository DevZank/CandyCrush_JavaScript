document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const width = 8; // Largura da grade
  const squares = []; // Array que armazena os quadrados da grade
  let score = 0; // Pontuação inicial do jogo

  const candyColors = [
    // Cores dos doces em formato de URL
    "url(images/red-candy.png)",
    "url(images/yellow-candy.png)",
    "url(images/orange-candy.png)",
    "url(images/purple-candy.png)",
    "url(images/green-candy.png)",
    "url(images/blue-candy.png)",
  ];

  // Cria a grade do jogo
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div"); // Cria um elemento div para cada quadrado
      square.setAttribute("draggable", true); // Define o atributo "draggable" como true para permitir o arrastar
      square.setAttribute("id", i); // Define o ID de cada quadrado
      let randomColor = Math.floor(Math.random() * candyColors.length); // Escolhe uma cor aleatória para o quadrado
      square.style.backgroundImage = candyColors[randomColor]; // Define a cor de fundo do quadrado
      grid.appendChild(square); // Adiciona o quadrado à grade
      squares.push(square); // Adiciona o quadrado ao array de quadrados
    }
  }
  createBoard();

  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("drageleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage; // Armazena a cor do quadrado sendo arrastado
    squareIdBeingDragged = parseInt(this.id); // Armazena o ID do quadrado sendo arrastado
  }

  function dragOver(e) {
    e.preventDefault(); // Evita o comportamento padrão do navegador
  }

  function dragEnter() {
    e.preventDefault(); // Evita o comportamento padrão do navegador
  }

  function dragLeave() {
    this.style.backgroundImage = ""; // Remove a imagem de fundo quando o cursor deixa a área do quadrado
  }

  function dragDrop() {
    colorBeingReplaced = this.style.backgroundImage; // Armazena a cor do quadrado a ser substituído
    squareIdBeingReplaced = parseInt(this.id); // Armazena o ID do quadrado a ser substituído
    this.style.backgroundImage = colorBeingDragged; // Define a nova cor de fundo para o quadrado solto
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced; // Define a cor de fundo do quadrado arrastado como a cor do quadrado solto
  }

  function dragEnd() {
    let validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingReplaced - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width,
    ];

    let validMove = validMoves.includes(squareIdBeingReplaced); // Verifica se o movimento é válido

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null; // Reseta o ID do quadrado sendo substituído
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced; // Restaura a cor de fundo original do quadrado sendo substituído
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged; // Restaura a cor de fundo original do quadrado arrastado
    } else {
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingDragged; // Define a nova cor de fundo para o quadrado sendo substituído
    }
  }

  // Os doces descem assim que alguns forem removidos
  function moveIntoSquareBelow() {
    for (i = 0; i < 55; i++) {
      if (squares[i + width].style.backgroundImage === "") {
        // Se o quadrado abaixo estiver vazio
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage; // Move o doce para o quadrado abaixo
        squares[i].style.backgroundImage = ""; // Limpa o quadrado atual
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i); // Verifica se o quadrado está na primeira linha
        if (isFirstRow && squares[i].style.backgroundImage === "") {
          // Se o quadrado estiver na primeira linha e estiver vazio
          let randomColor = Math.floor(Math.random() * candyColors.length); // Escolhe uma cor aleatória
          squares[i].style.backgroundImage = candyColors[randomColor]; // Define a nova cor de fundo para o quadrado
        }
      }
    }
  }

  /// Verificações de Combinações
  // para uma fileira de Quatro
  function checkRowForFour() {
    for (i = 0; i < 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55,
      ];
      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 4; // Incrementa a pontuação
        scoreDisplay.innerHTML = score; // Atualiza a exibição da pontuação
        rowOfFour.forEach((index) => {
          squares[index].style.backgroundImage = ""; // Limpa os quadrados da fileira
        });
      }
    }
  }
  checkRowForFour();

  // para uma coluna de Quatro
  function checkColumnForFour() {
    for (i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 4; // Incrementa a pontuação
        scoreDisplay.innerHTML = score; // Atualiza a exibição da pontuação
        columnOfFour.forEach((index) => {
          squares[index].style.backgroundImage = ""; // Limpa os quadrados da coluna
        });
      }
    }
  }
  checkColumnForFour();

  // para uma fileira de Três
  function checkRowForThree() {
    for (i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 3; // Incrementa a pontuação
        scoreDisplay.innerHTML = score; // Atualiza a exibição da pontuação
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = ""; // Limpa os quadrados da fileira
        });
      }
    }
  }
  checkRowForThree();

  // para uma coluna de Três
  function checkColumnForThree() {
    for (i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 3; // Incrementa a pontuação
        scoreDisplay.innerHTML = score; // Atualiza a exibição da pontuação
        columnOfThree.forEach((index) => {
          squares[index].style.backgroundImage = ""; // Limpa os quadrados da coluna
        });
      }
    }
  }
  checkColumnForThree();

  window.setInterval(function () {
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
    moveIntoSquareBelow();
  }, 100);
});
