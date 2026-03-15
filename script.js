function playSound(e) {
     // Klaviatura kodi yoki klik kodi (ikkalasi uchun ham ishlaydi)
     const keyCode = e.keyCode || this.getAttribute('data-key');
     const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
     const key = document.querySelector(`.key[data-key="${keyCode}"]`);
   
     if (!audio) return; // Agar boshqa tugma bosilsa, to'xtatadi
   
     key.classList.add('playing');
     audio.currentTime = 0; // Audioni boshidan boshlaydi (tez bosish uchun)
     audio.play();
   }
   
   function removeTransition(e) {
     if (e.propertyName !== 'transform') return; // Faqat transform tugagach ishlaydi
     this.classList.remove('playing');
   }
   
   // Barcha tugmalarni olish
   const keys = Array.from(document.querySelectorAll('.key'));
   
   // Animatsiya tugashini kuzatish
   keys.forEach(key => {
     key.addEventListener('transitionend', removeTransition);
     key.addEventListener('click', playSound); // Sichqoncha bilan bosish uchun
   });
   
   // Klaviatura bosilishini kuzatish
   window.addEventListener('keydown', playSound);