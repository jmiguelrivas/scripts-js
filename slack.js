(function keepMe(){
  clear();
  const toSeconds = 1000;
  const toMinutes = 60;
  const intervalDuration = 15 * toSeconds * toMinutes; // 15 Minutes
  
  setInterval(() => {
    const hours = new Date().getHours();
    console.clear();
    if(hours >= 6 && hours <= 15) {
      const el = document.querySelector('.ql-editor p');
      const rndString = Math.random().toString(36).substring(2,7);
      el.innerHTML = rndString;
      console.log(`------ Interval Duration: ${intervalDuration}ms == ${intervalDuration / toSeconds / toMinutes}min`);
      console.log('------ Hours', hours);
      console.log('------ Text', rndString);
    }
  }, intervalDuration);
})();