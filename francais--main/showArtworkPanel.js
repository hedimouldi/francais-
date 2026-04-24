function showArtworkPanel(data) {
  const popup = document.createElement('div');
  popup.id = 'art-popup';
  popup.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 420px; padding: 24px; background: linear-gradient(135deg, rgba(10,30,15,.95), rgba(15,40,20,.9));
    backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(34,197,94,.3);
    color: #d1fae5; z-index: 200; font-family: Inter, sans-serif;
  `;
  popup.innerHTML = `
    <h3 style="font-family: 'Playfair Display'; font-size: 1.4rem; color: #86efac; margin-bottom: 12px;">${data.title}</h3>
    <p style="font-size: .88rem; line-height: 1.5; margin-bottom: 16px;">${data.desc || 'Explorez ce prototype interactif.'}</p>
    <ul style="font-size: .8rem; list-style: none;">
      ${data.facts ? data.facts.map(f => `<li style="margin: 6px 0; color: #86efac;">• ${f}</li>`).join('') : '<li>Aucune info disponible.</li>'}
    </ul>
    <button onclick="document.getElementById('art-popup').remove()" style="margin-top: 16px; padding: 8px 20px; background: #22c55e; border: none; border-radius: 20px; color: white; cursor: pointer;">Fermer</button>
  `;
  document.body.appendChild(popup);
}
