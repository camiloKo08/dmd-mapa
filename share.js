// =====================================================================
//  share.js — genera el link público + código QR para compartir.
//  Compartido por mapa.html y lugar.html. Requiere que la página tenga
//  cargado QRious y el HTML del #shareModalOverlay (ver site.css).
// =====================================================================
(function(){
  const overlay = document.getElementById('shareModalOverlay');
  if(!overlay) return;

  const shareTitle = document.getElementById('shareTitle');
  const shareLinkInput = document.getElementById('shareLinkInput');
  const shareQrCanvas = document.getElementById('shareQrCanvas');
  const shareCopiedMsg = document.getElementById('shareCopiedMsg');
  let shareQr = null;

  function openShareModal(title, url){
    shareTitle.textContent = title;
    shareLinkInput.value = url;
    shareCopiedMsg.classList.remove('show');
    if(!shareQr){
      shareQr = new QRious({ element: shareQrCanvas, size: 200, value: url, background:'#ffffff', foreground:'#0B1622' });
    } else {
      shareQr.set({ value: url });
    }
    overlay.classList.add('open');
  }
  window.__openShareModal = openShareModal; // usado por cada página para lanzar su propio botón "Compartir"

  document.getElementById('shareCopyBtn').addEventListener('click', function(){
    shareLinkInput.select();
    navigator.clipboard.writeText(shareLinkInput.value).then(function(){
      shareCopiedMsg.classList.add('show');
    }).catch(function(){
      document.execCommand('copy');
      shareCopiedMsg.classList.add('show');
    });
  });

  document.getElementById('shareModalClose').addEventListener('click', function(){
    overlay.classList.remove('open');
  });
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) overlay.classList.remove('open');
  });
})();
