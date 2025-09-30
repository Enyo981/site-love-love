// =================================================================
// 1. SELETORES DE ELEMENTOS (PÁGINA)
// =================================================================
const containerBotao = document.getElementById('containerBotao');
const btnClique = document.getElementById('btnClique');
const conteudo = document.getElementById('conteudo');
const galeria = document.getElementById('galeria');
const fotos = galeria.querySelectorAll('.foto');
const galeriaPontos = document.getElementById('galeria-pontos');
const tempoAmorValor = document.getElementById('tempoAmor-valor');

// =================================================================
// 2. CONFIGURAÇÕES E ESTADO DA APLICAÇÃO
// =================================================================
const inicioRelacionamento = new Date('2017-10-07T00:00:00'); 
let fotoAtual = 0;
let floatingHeartsInterval;
let tempoInterval;

// =================================================================
// 3. FUNÇÕES (DA PÁGINA)
// =================================================================
function atualizarTempo() {
  const agora = new Date();
  let diff = Math.floor((agora - inicioRelacionamento) / 1000); 
  const anos = Math.floor(diff / (3600 * 24 * 365));
  diff -= anos * 3600 * 24 * 365;
  const meses = Math.floor(diff / (3600 * 24 * 30));
  diff -= meses * 3600 * 24 * 30;
  const dias = Math.floor(diff / (3600 * 24));
  diff -= dias * 3600 * 24;
  const horas = Math.floor(diff / 3600);
  diff -= horas * 3600;
  const minutos = Math.floor(diff / 60);
  const segundos = diff % 60;
  tempoAmorValor.textContent =
    `${anos} anos, ${meses} meses, ${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos`;
}

function gerarPontosGaleria() {
  galeriaPontos.innerHTML = ''; 
  fotos.forEach((_, index) => {
      const ponto = document.createElement('span');
      ponto.classList.add('ponto');
      if (index === fotoAtual) {
          ponto.classList.add('active');
      }
      ponto.addEventListener('click', () => irParaFoto(index));
      galeriaPontos.appendChild(ponto);
  });
}

function irParaFoto(index) {
  fotos[fotoAtual].classList.remove('active');
  const pontos = galeriaPontos.querySelectorAll('.ponto');
  pontos[fotoAtual].classList.remove('active');
  fotoAtual = index;
  fotos[fotoAtual].classList.add('active');
  pontos[fotoAtual].classList.add('active');
}

function proximaFoto() {
  irParaFoto((fotoAtual + 1) % fotos.length);
}

function criarCoracao() {
  const heart = document.createElement('span');
  heart.classList.add('floating-heart');
  heart.textContent = '💜'; 
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (12 + Math.random() * 20) + 'px';
  document.body.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 4000);
}

// =================================================================
// 4. INICIALIZAÇÃO E EVENT LISTENERS (PÁGINA)
// =================================================================
btnClique.addEventListener('click', () => {
  // Faz o botão desaparecer e o conteúdo aparecer
  containerBotao.style.opacity = '0';
  setTimeout(() => {
    containerBotao.style.display = 'none';
    conteudo.style.display = 'block';
    setTimeout(() => {
      conteudo.style.opacity = '1';
    }, 100);

    // Inicia todas as funcionalidades da página
    atualizarTempo();
    tempoInterval = setInterval(atualizarTempo, 1000);
    setInterval(proximaFoto, 5000);
    gerarPontosGaleria(); 
    floatingHeartsInterval = setInterval(criarCoracao, 600);

    // =================================================================
    // 5. FUNCIONALIDADE DO PLAYER DE MÚSICA (AGORA ATIVADO APÓS O CLIQUE)
    // =================================================================
    const audio = document.getElementById('audio-player');
    const playPauseBtn = document.querySelector('.play-pause');

    // Função para tocar ou pausar a música
    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
            // Troca o ícone para 'pause'
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
        } else {
            audio.pause();
            // Troca o ícone de volta para 'play'
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
        }
    }

    // Adiciona o 'escutador de evento' ao botão
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    // Toca a música automaticamente ao clicar no botão principal
    togglePlayPause();

  }, 500);
});