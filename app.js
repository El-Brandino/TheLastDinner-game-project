// GLOBAL
const container = document.getElementById("container");

function nextPage(address) {
  if (container) {
    container.style.opacity = "0";
  }

  setTimeout(() => {
    window.location.href = address;
  }, 1000);
}

window.onload = () => {
  container.style.opacity = "1";
};

const buttons = document.querySelectorAll(".lang-btn");
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");

    const lang = btn.id === "btnID" ? "id" : "en";
    localStorage.setItem("lang", lang);
    applyLanguage(lang);
  });
});

const savedLang = localStorage.getItem("lang");

if (buttons.length > 0) {
  const savedLang = localStorage.getItem("lang");

  if (savedLang) {
    buttons.forEach((b) => b.classList.remove("on"));

    if (savedLang === "id") {
      document.getElementById("btnID")?.classList.add("on");
    } else {
      document.getElementById("btnEN")?.classList.add("on");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let lang = localStorage.getItem("lang") || "en";
  applyLanguage(lang);
});

// MENU PAGE
// ENDING COUNT
let endingCountDisplay = document.getElementById("endingCount");

let unlockedEndings =
  JSON.parse(localStorage.getItem("unlockedEndings")) || [];

const resetCountBtn = document.getElementById("resetCount");

if (resetCountBtn) {
  resetCountBtn.style.display = "none";
}

function updateEndingDisplay() {

  if (endingCountDisplay) {
    endingCountDisplay.innerHTML =
      `Endings: ${unlockedEndings.length}/4`;
  }
}

function addEnding(endingName) {

  if (!unlockedEndings.includes(endingName)) {

    unlockedEndings.push(endingName);

    localStorage.setItem(
      "unlockedEndings",
      JSON.stringify(unlockedEndings)
    );

    updateEndingDisplay();

    console.log("New ending unlocked:", endingName);

    if (unlockedEndings.length >= 4) {

      if (resetCountBtn) {
        resetCountBtn.style.display = "block";
      }

    }

  } else {

    console.log("Ending already unlocked.");
  }
}

function resetEndingCount() {
  unlockedEndings = [];
  localStorage.removeItem("unlockedEndings");
  updateEndingDisplay();
  console.log("Ending counter reset.");
  location.reload();
}
updateEndingDisplay();
if (unlockedEndings.length >= 4) {

  if (resetCountBtn) {
    resetCountBtn.style.display = "block";
  }

}

if (document.body.id === "menu-page") {
  const playBtn = document.getElementById("playBtn");
  const optBtn = document.getElementById("optBtn");
  const exitBtn = document.getElementById("exitBtn");
  const htpBtn = document.getElementById("htpBtn");

  let lang = localStorage.getItem("lang") || "en";

  console.log("LANG MENU:", lang);

  if (playBtn && optBtn && exitBtn && htpBtn) {
    if (lang === "id") {
      playBtn.innerHTML = "Mulai";
      optBtn.innerHTML = "Bahasa";
      exitBtn.innerHTML = "Keluar";
      htpBtn.innerHTML = "Cara Bermain";
    } else {
      playBtn.innerHTML = "Play";
      optBtn.innerHTML = "Language";
      exitBtn.innerHTML = "Exit";
      htpBtn.innerHTML = "How To Play";
    }
  }

  const audioMenu = document.getElementById("menu-bgm");
  const btnBGM = document.getElementById("btnBGM");
  const imgBtn = document.getElementById("imgBtn");
  const volSlide = document.getElementById("volume");
  const volArea = document.querySelector(".music");

  audioMenu.volume = 0.45;
  audioMenu.play();
  audioMenu.muted = false;

  let isOn = true;

  if (btnBGM && imgBtn && audioMenu) {
    btnBGM.addEventListener("click", () => {
      audioMenu.muted = !audioMenu.muted;

      imgBtn.src = audioMenu.muted
        ? "asset/volume-xmark-solid-full.svg"
        : "asset/volume-solid-full.svg";
    });
  }

  volArea.addEventListener("mouseenter", () => {
    volSlide.style.opacity = "1";
    btnBGM.style.opacity = "1";
    volSlide.classList.add("active");
    btnBGM.classList.add("active");
  });

  volArea.addEventListener("mouseleave", () => {
    volSlide.style.opacity = "0";
    btnBGM.style.opacity = "0.3";
    volSlide.classList.remove("active");
    btnBGM.classList.remove("active");
  });

  volSlide.value = 1;
  audioMenu.volume = 1;

  volSlide.addEventListener("input", () => {
    audioMenu.volume = volSlide.value;
    localStorage.setItem("volume", volSlide.value);
  });

  let savedVol = localStorage.getItem("volume");

  if (savedVol !== null) {
    savedVol = parseFloat(savedVol);

    audioMenu.volume = savedVol;
    volSlide.value = savedVol;
  }

  audioMenu.play().catch(() => {
    document.addEventListener(
      "click",
      () => {
        audioMenu.play();
      },
      { once: true },
    );
  });
}

// OPTION
if (document.body.id === "option-page") {
  function applyLanguage(lang) {
    const optText = document.getElementById("optText");
    const langText = document.getElementById("langText");
    const backBtn = document.getElementById("backBtn");

    if (lang === "id") {
      optText.textContent = "Pilihan";
      langText.textContent = "Bahasa";
      backBtn.textContent = "Kembali";
    } else {
      optText.textContent = "Option";
      langText.textContent = "Language";
      backBtn.textContent = "Back";
    }
  }

  if (document.body.id === "option-page") {
    const audioMenu = document.getElementById("menu-bgm");
    const btnBGM = document.getElementById("btnBGM");
    const imgBtn = document.getElementById("imgBtn");
    const volSlide = document.getElementById("volume");
    const volArea = document.querySelector(".music");

    audioMenu.volume = 0.45;
    audioMenu.play();
    audioMenu.muted = false;

    let isOn = true;

    if (btnBGM && imgBtn && audioMenu) {
      btnBGM.addEventListener("click", () => {
        audioMenu.muted = !audioMenu.muted;

        imgBtn.src = audioMenu.muted
          ? "asset/volume-xmark-solid-full.svg"
          : "asset/volume-solid-full.svg";
      });
    }

    volArea.addEventListener("mouseenter", () => {
      volSlide.style.opacity = "1";
      btnBGM.style.opacity = "1";
      volSlide.classList.add("active");
      btnBGM.classList.add("active");
    });

    volArea.addEventListener("mouseleave", () => {
      volSlide.style.opacity = "0";
      btnBGM.style.opacity = "0.3";
      volSlide.classList.remove("active");
      btnBGM.classList.remove("active");
    });

    volSlide.value = 1;
    audioMenu.volume = 1;

    volSlide.addEventListener("input", () => {
      audioMenu.volume = volSlide.value;
      localStorage.setItem("volume", volSlide.value);
    });

    let savedVol = localStorage.getItem("volume");

    if (savedVol !== null) {
      savedVol = parseFloat(savedVol);

      audioMenu.volume = savedVol;
      volSlide.value = savedVol;
    }

    audioMenu.play().catch(() => {
      document.addEventListener(
        "click",
        () => {
          audioMenu.play();
        },
        { once: true },
      );
    });
  }
}

// HOW TO PLAY
if (document.body.id === "htp-page") {
  const audioMenu = document.getElementById("menu-bgm");
    const btnBGM = document.getElementById("btnBGM");
    const imgBtn = document.getElementById("imgBtn");
    const volSlide = document.getElementById("volume");
    const volArea = document.querySelector(".music");

    audioMenu.volume = 0.45;
    audioMenu.play();
    audioMenu.muted = false;

    let isOn = true;

    if (btnBGM && imgBtn && audioMenu) {
      btnBGM.addEventListener("click", () => {
        audioMenu.muted = !audioMenu.muted;

        imgBtn.src = audioMenu.muted
          ? "asset/volume-xmark-solid-full.svg"
          : "asset/volume-solid-full.svg";
      });
    }

    volArea.addEventListener("mouseenter", () => {
      volSlide.style.opacity = "1";
      btnBGM.style.opacity = "1";
      volSlide.classList.add("active");
      btnBGM.classList.add("active");
    });

    volArea.addEventListener("mouseleave", () => {
      volSlide.style.opacity = "0";
      btnBGM.style.opacity = "0.3";
      volSlide.classList.remove("active");
      btnBGM.classList.remove("active");
    });

    volSlide.value = 1;
    audioMenu.volume = 1;

    volSlide.addEventListener("input", () => {
      audioMenu.volume = volSlide.value;
      localStorage.setItem("volume", volSlide.value);
    });

    let savedVol = localStorage.getItem("volume");

    if (savedVol !== null) {
      savedVol = parseFloat(savedVol);

      audioMenu.volume = savedVol;
      volSlide.value = savedVol;
    }

    audioMenu.play().catch(() => {
      document.addEventListener(
        "click",
        () => {
          audioMenu.play();
        },
        { once: true },
      );
    });

  function applyLanguage(lang) {
    const htpText = document.getElementById("htpText");
    const backBtn = document.getElementById("backBtn");
    const htpDescription = document.getElementById("htpDescription");

    if (lang === "id") {
      htpText.textContent = "Cara Bermain";
      backBtn.textContent = "Kembali";
      htpDescription.textContent = "Kamu disini bermain sebagai seekor kelinci detektif yang sedang menyelidiki kasus pembunuhan misterius di sebuah rumah.\n\nCara bermainnya cukup mudah, kamu hanya perlu mengklik pada objek-objek yang mencurigakan untuk mencari petunjuk dan memecahkan misteri pembunuhan tersebut.\n\nSetiap objek yang kamu klik akan memberikan informasi yang berbeda-beda, jadi pastikan untuk memeriksa setiap sudut rumah dengan seksama, dan juga ada sistem inventory dan quest.\n\nKamu harus menyelesaikan apa saja yang disuruh oleh quest petunjuk.\n\nDan yang paling penting, jangan memilih benda di inventory saat ingin berinteraksi dengan objek mencurigakan agar informasinya bisa terlihat jelas.\n\nSelamat bermain dan semoga berhasil memecahkan kasus ini!";
    } else {
      htpText.textContent = "How To Play";
      backBtn.textContent = "Back";
      htpDescription.textContent = "You play as a rabbit detective investigating a mysterious murder case inside a house.\n\nThe gameplay is quite simple. You only need to click on suspicious objects to search for clues and solve the murder mystery.\n\nEvery object you click will provide different information, so make sure to carefully inspect every corner of the house. There is also an inventory and quest system.\n\nYou must complete whatever objectives the quests ask you to do.\n\nAnd most importantly, do not select any item from the inventory before interacting with suspicious objects, so the information can be viewed clearly.\n\nGood luck, and hopefully you can solve the case!";
    }
  }
}
// STORY
let lang = localStorage.getItem("lang") || "en";

if (document.body.id === "prolog-page") {
  const audioProlog = document.getElementById("prolog-bgm");

  audioProlog.play();

  const btnBGM = document.getElementById("btnBGM");
  const imgBtn = document.getElementById("imgBtn");
  const volSlide = document.getElementById("volume");
  const volArea = document.querySelector(".music");

  volArea.addEventListener("mouseenter", () => {
    volSlide.style.opacity = "1";
    btnBGM.style.opacity = "1";

    volSlide.classList.add("active");
    btnBGM.classList.add("active");
  });

  volArea.addEventListener("mouseleave", () => {
    volSlide.style.opacity = "0";
    btnBGM.style.opacity = "0.3";
    volSlide.classList.remove("active");
    btnBGM.classList.remove("active");
  });

  volSlide.value = 1;
  audioProlog.volume = 1;

  volSlide.addEventListener("input", () => {
    audioProlog.volume = volSlide.value;
    localStorage.setItem("volume", volSlide.value);
  });

  let savedVol = localStorage.getItem("volume");

  if (savedVol !== null) {
    savedVol = parseFloat(savedVol);

    audioProlog.volume = savedVol;
    volSlide.value = savedVol;
  }

  audioProlog.play().catch(() => {
    document.addEventListener(
      "click",
      () => {
        audioProlog.play();
      },
      { once: true },
    );
  });

  let scenes;

  if (lang === "id") {
    scenes = [
      {
        img: "asset/prolog-scene 1.png",
        text: "Di pinggiran kota, ada sebuah rumah yang kebanyakan orang abaikan. Terlihat biasa saja. Sepi. Tidak ada yang tampak aneh. Malam itu, tidak ada seorang pun yang menyadari sesuatu yang janggal.",
      },
      {
        img: "asset/prolog-scene 2.png",
        text: "Di dalam rumah itu, semuanya seakan berhenti. Setiap jam membeku pada waktu yang sama — 03:17. Tidak ada tanda-tanda pembobolan, tidak ada perlawanan, tidak ada suara. Hanya keheningan yang terasa tidak wajar.",
      },
      {
        img: "asset/prolog-scene 3.png",
        text: "Pada suatu titik, kebenaran mulai terungkap. Sebuah keluarga ditemukan tak bernyawa di dalam rumah itu. Tapi ada satu hal yang mencolok. Rubah merah ditemukan di tempat lain… terpisah dari yang lainnya.",
      },
      {
        img: "asset/prolog-scene 4.png",
        text: "Siapa pun yang bertanggung jawab sudah pergi. Tapi mereka tidak pergi dengan tangan kosong. Potongan-potongan dari malam itu masih tertinggal — tersembunyi dalam detail kecil, menunggu untuk dipahami.",
      },
    ];
  } else {
    scenes = [
      {
        img: "asset/prolog-scene 1.png",
        text: "On the edge of the city, there was a house that most people ignored. It looked ordinary. Quiet. Nothing seemed out of place. That night, no one noticed anything unusual.",
      },
      {
        img: "asset/prolog-scene 2.png",
        text: "Inside the house, everything had stopped. Every clock was frozen at the same time — 03:17. There were no signs of forced entry, no struggle, no noise. Just a stillness that didn’t feel natural.",
      },
      {
        img: "asset/prolog-scene 3.png",
        text: "At some point, the truth began to surface. A family was found lifeless inside the house. But one detail stood out. The red fox was found elsewhere… Separated from the others.",
      },
      {
        img: "asset/prolog-scene 4.png",
        text: "Whoever was responsible was already gone. But they didn’t leave empty-handed. Pieces of that night remain — hidden in small details, waiting to be understood. And for someone willing to take a closer look… the answers might still be here.",
      },
    ];
  }

  let currentScene = 0;
  let charIndex = 0;

  function typeText() {
    const textEl = document.getElementById("text");
    let current = scenes[currentScene];

    if (charIndex < current.text.length) {
      textEl.innerHTML += current.text.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 40);
    }
  }

  function changeScene() {
    const textEl = document.getElementById("text");
    const imgEl = document.getElementById("scene-img");

    if (!textEl || !imgEl) return;

    let current = scenes[currentScene];

    imgEl.style.opacity = "0";
    textEl.style.opacity = "0";

    setTimeout(() => {
      imgEl.src = current.img;

      textEl.innerHTML = "";
      charIndex = 0;

      imgEl.style.opacity = "1";
      textEl.style.opacity = "1";

      typeText();
    }, 500);
  }

  const prolog = document.getElementById("prolog");
  prolog.addEventListener("click", () => {
    const textEl = document.getElementById("text");
    let current = scenes[currentScene];

    if (!textEl) return;

    if (charIndex < current.text.length) {
      textEl.innerHTML = current.text;
      charIndex = current.text.length;
    } else {
      currentScene++;

      if (currentScene < scenes.length) {
        changeScene();
      } else {
        localStorage.removeItem("bgmTime");
        localStorage.removeItem("hallImageChanged");
        localStorage.removeItem("timerExpired");
        localStorage.removeItem("timerActive");
        localStorage.removeItem("timerStartTime");
        localStorage.setItem("hasLockpick", "false");
        localStorage.setItem("lockDoor", "true");
        localStorage.removeItem("goodEndCondition");
        localStorage.removeItem("vanishEndCondition");
        localStorage.removeItem("cupboardLocked");
        localStorage.removeItem("quests");
        localStorage.removeItem("offeredQuests");
        nextPage("LRoom.html");
      }
    }
  });

  window.onload = () => {
    changeScene();
  };
}