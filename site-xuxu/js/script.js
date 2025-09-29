// =================================================================
// 1. SELETORES DE ELEMENTOS
// =================================================================
const containerBotao = document.getElementById('containerBotao');
const btnClique = document.getElementById('btnClique');
const conteudo = document.getElementById('conteudo');

// Elementos da Galeria
const galeria = document.getElementById('galeria');
const fotos = galeria.querySelectorAll('.foto');
const galeriaPontos = document.getElementById('galeria-pontos');

// Elementos do Contador
const tempoAmorValor = document.getElementById('tempoAmor-valor');

// Elementos do Player de Música
const musica = document.getElementById('musica');
const playBtn = document.getElementById('play-btn');
const volumeSlider = document.getElementById('volume-slider');
const songDuration = document.getElementById('song-duration');

// =================================================================
// 2. CONFIGURAÇÕES E ESTADO DA APLICAÇÃO
// =================================================================
const inicioRelacionamento = new Date('2017-10-07T00:00:00'); 

let fotoAtual = 0;
let floatingHeartsInterval;
let tempoInterval;

// =================================================================
// 3. FUNÇÕES
// =================================================================

/**
 * Atualiza o contador de tempo de relacionamento.
 */
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

/**
 * Cria os pontos de navegação para a galeria.
 */
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

/**
 * Navega para uma foto específica na galeria.
 * @param {number} index - O índice da foto para mostrar.
 */
function irParaFoto(index) {
  fotos[fotoAtual].classList.remove('active');
  const pontos = galeriaPontos.querySelectorAll('.ponto');
  pontos[fotoAtual].classList.remove('active');
  
  fotoAtual = index;
  
  fotos[fotoAtual].classList.add('active');
  pontos[fotoAtual].classList.add('active');
}

/**
 * Avança para a próxima foto na galeria.
 */
function proximaFoto() {
  irParaFoto((fotoAtual + 1) % fotos.length);
}

/**
 * Cria um coração flutuante e o adiciona na tela.
 */
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

/**
 * Formata segundos para o formato m:ss.
 * @param {number} seconds - O total de segundos.
 * @returns {string} - O tempo formatado.
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
}

// =================================================================
// 4. INICIALIZAÇÃO E EVENT LISTENERS
// =================================================================

// Evento principal: clique para iniciar a "mágica"
btnClique.addEventListener('click', () => {
  containerBotao.style.opacity = '0';
  
  setTimeout(() => {
    containerBotao.style.display = 'none';
    conteudo.style.display = 'block';
    
    setTimeout(() => {
      conteudo.style.opacity = '1';
    }, 100);
    
    // Inicia todas as funcionalidades
    atualizarTempo();
    tempoInterval = setInterval(atualizarTempo, 1000);
    setInterval(proximaFoto, 5000);
    gerarPontosGaleria(); 
    floatingHeartsInterval = setInterval(criarCoracao, 600);

    // Tenta tocar a música (navegadores modernos podem bloquear isso)
    musica.play().then(() => {
      playBtn.classList.add('playing');
    }).catch(err => {
      console.error("Falha ao iniciar a música automaticamente:", err);
    });
    
  }, 500);
});

// Event listeners do player de música
playBtn.addEventListener('click', () => {
  if (musica.paused) {
    musica.play().then(() => {
      playBtn.classList.add('playing');
    });
  } else {
    musica.pause();
    playBtn.classList.remove('playing');
  }
});

volumeSlider.addEventListener('input', () => {
  musica.volume = volumeSlider.value;
});

musica.addEventListener('loadedmetadata', () => {
  songDuration.textContent = formatTime(musica.duration);
});

musica.addEventListener('error', (e) => {
  console.error("Erro ao carregar música:", e);
  playBtn.style.border = "2px solid #ff6b6b";
  playBtn.title = "Erro ao carregar música. Clique para tentar novamente.";
});

// Inicializa o volume do player
musica.volume = volumeSlider.value;