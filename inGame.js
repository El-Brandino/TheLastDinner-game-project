// IN GAME

// AUDIO
const audioInGame = document.getElementById("inGame-bgm");
const btnBGM = document.getElementById("btnBGM");
const imgBtn = document.getElementById("imgBtn");
const volSlide = document.getElementById("volume");
const volArea = document.querySelector(".music");

audioInGame.play();
audioInGame.muted = false;

if (btnBGM && imgBtn && audioInGame) {
  btnBGM.addEventListener("click", () => {
    audioInGame.muted = !audioInGame.muted;

    imgBtn.src = audioInGame.muted
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
audioInGame.volume = 0.3;

// LOAD MUSIC TIME
let savedMusicTime = localStorage.getItem("bgmTime");

if (savedMusicTime !== null) {
  audioInGame.currentTime = parseFloat(savedMusicTime);
}

volSlide.addEventListener("input", () => {
  audioInGame.volume = volSlide.value;

  localStorage.setItem("volume", volSlide.value);
});

let savedVol = localStorage.getItem("volume");

if (savedVol !== null) {
  savedVol = parseFloat(savedVol);

  audioInGame.volume = savedVol;
  volSlide.value = savedVol;
}

audioInGame.play().catch(() => {
  document.addEventListener(
    "click",
    () => {
      audioInGame.play();
    },
    { once: true },
  );
});

// SAVE MUSIC TIME CONTINUOUSLY
const bgmSaveInterval = setInterval(() => {
  localStorage.setItem("bgmTime", audioInGame.currentTime);
}, 1000);


//VANISH END
function triggerVanishEnd() {
  addEnding("VanishEnd");
  clearInterval(bgmSaveInterval);
  localStorage.removeItem("bgmTime");
  if (container) {
    container.style.opacity = "0";
    audioInGame.pause();

    setTimeout(() => {
      nextPage("VanishEnd.html");
    }, 3000);
  }
}

//BAD END
const cupboardOpenSFX = document.getElementById("cupboardOpen");
const stabSFX = document.getElementById("stab");
function triggerBadEnd(playCupboardSound = true) {
  addEnding("BadEnd");
  clearInterval(bgmSaveInterval);
  localStorage.removeItem("bgmTime");
  if (container) {
    container.style.opacity = "0";
    stabSFX.volume = 0.5;
    audioInGame.pause();

    if (playCupboardSound) {
      cupboardOpenSFX.volume = 0.5;
      cupboardOpenSFX.play();
    }

    setTimeout(() => {
      stabSFX.play();
    }, 5000);
    setTimeout(() => {
      nextPage("BadEnd.html");
    }, 15000);
  }
}

//GOOD END
function triggerGoodEnd() {
  addEnding("GoodEnd");
  clearInterval(bgmSaveInterval);
  localStorage.removeItem("bgmTime");
  if (container) {
    container.style.opacity = "0";
    audioInGame.pause();

    setTimeout(() => {
      nextPage("GoodEnd.html");
    }, 3000);
  }
}

//FOOTSTEP SFX
const footstep = document.getElementById("footstep");

if (footstep) {
  function playFootstep() {
    footstep.currentTime = 0;

    footstep.play();

    setTimeout(() => {
      footstep.pause();
      footstep.currentTime = 0;
    }, 3000);
  }
}

//DECLARE ENDING CONDITIONS
let goodEndCondition = localStorage.getItem("goodEndCondition") === "true";
let vanishEndCondition = localStorage.getItem("vanishEndCondition") === "true";
let cupboardLocked = localStorage.getItem("cupboardLocked") === "true";

// TIMER SYSTEM
let timerActive = false;
let timerExpired = false;
let timerInterval = null;
let timerDuration = 10;

function startTimer() {
  if (timerActive) return;

  timerActive = true;
  timerExpired = false;
  timerDuration = 10;

  const timerDisplay = document.getElementById("timerDisplay");

  if (timerDisplay) {
    timerDisplay.style.display = "block";
    timerDisplay.textContent = timerDuration;
  }

  localStorage.setItem("timerActive", "true");
  localStorage.setItem("timerExpired", "false");
  localStorage.setItem("timerStartTime", Date.now().toString());

  timerInterval = setInterval(() => {
    timerDuration--;

    if (timerDisplay) {
      timerDisplay.textContent = timerDuration;
    }

    // TIMER HABIS
    if (timerDuration <= 0) {
      clearInterval(timerInterval);

      timerExpired = true;
      timerActive = false;

      localStorage.setItem("timerExpired", "true");
      localStorage.setItem("timerActive", "false");

      if (timerDisplay) {
        timerDisplay.style.display = "none";
      }

      const currentPage = document.body.id;

      if (currentPage === "Hall-page") {
        vanishEndCondition = false;
        goodEndCondition = false;

        localStorage.setItem("vanishEndCondition", "false");
        localStorage.setItem("goodEndCondition", "false");

        triggerBadEnd(false);
        return;
      }

      if (
        currentPage === "BedRoom-page" ||
        currentPage === "BathRoom-page" ||
        currentPage === "DiningRoom-page"
      ) {
        vanishEndCondition = true;

        localStorage.setItem("vanishEndCondition", "true");

        goodEndCondition = false;

        localStorage.setItem("goodEndCondition", "false");

        console.log("Vanish End Active");
      }
    }
  }, 1000);
}

function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerActive = false;
  timerExpired = false;
  timerDuration = 10;

  const timerDisplay = document.getElementById("timerDisplay");
  if (timerDisplay) {
    timerDisplay.style.display = "none";
  }

  localStorage.setItem("timerActive", "false");
  localStorage.setItem("timerExpired", "false");
}

if (document.body.id === "VanishEnd-page") {
  const textVANEnd = document.getElementById("textVANEnd");
  if (textVANEnd) {
    if (localStorage.getItem("lang") === "en") {
      textVANEnd.innerHTML =
        "The investigation may have ended, but the guilt never truly left you. Every missed clue, every hesitation, and every life that could not be saved continued to linger in your mind long after the case was closed. Though the world moved on, you remained trapped by the memory of your failure, haunted by the feeling that the tragedy could have been prevented if only you had acted sooner.";
    } else {
      textVANEnd.innerHTML =
        "Penyelidikan mungkin telah berakhir, tetapi rasa bersalah itu tidak pernah benar-benar pergi. Setiap petunjuk yang terlewat, setiap keraguan, dan setiap nyawa yang tidak bisa diselamatkan terus menghantui pikiranmu lama setelah kasus ini ditutup. Meskipun dunia terus berjalan, kamu tetap terjebak oleh kenangan kegagalanmu, dihantui oleh perasaan bahwa tragedi ini bisa saja dicegah jika saja kamu bertindak lebih cepat.";
    }
  }
}

if (document.body.id === "CowardEnd-page") {
  const textCWEnd = document.getElementById("textCWEnd");
  if (textCWEnd) {
    if (localStorage.getItem("lang") === "en") {
      textCWEnd.innerHTML =
        "As soon as the investigation began, fear slowly consumed your mind. The silence of the house and the overwhelming sense that something was terribly wrong shattered your confidence, until you finally abandoned the case before uncovering the truth. The investigation was handed to another detective, while your name remained only as the detective who walked away from the mission.";
    } else {
      textCWEnd.innerHTML =
        "Begitu penyelidikan dimulai, ketakutan perlahan menguasai pikiranmu. Keheningan rumah dan perasaan bahwa ada sesuatu yang sangat salah menghancurkan kepercayaan dirimu, hingga akhirnya kamu meninggalkan kasus ini sebelum mengungkap kebenaran. Penyelidikan diserahkan kepada detektif lain, sementara namamu hanya dikenang sebagai detektif yang meninggalkan misi.";
    }
  }
}

if (document.body.id === "BadEnd-page") {
  const textBDEnd = document.getElementById("textBDEnd");
  if (textBDEnd) {
    if (localStorage.getItem("lang") === "en") {
      textBDEnd.innerHTML =
        "Your curiosity led you to make a careless decision. Without thinking twice, you opened something that should have remained sealed, and within moments the situation turned into a nightmare. There was no time to fight back, no chance to escape. Your life was taken right there, leaving the case forever unsolved and the investigation abandoned alongside your own death.";
    } else {
      textBDEnd.innerHTML =
        "Rasa penasaranmu membawamu pada keputusan ceroboh. Tanpa berpikir panjang, kamu membuka sesuatu yang seharusnya tetap tersegel, dan dalam hitungan detik situasinya berubah menjadi mimpi buruk. Tidak ada waktu untuk melawan, tidak ada kesempatan untuk melarikan diri. Hidupmu direnggut di sana juga, meninggalkan kasus ini selamanya tak terpecahkan dan penyelidikan berakhir bersama kematianmu.";
    }
  }
}

if (document.body.id === "GoodEnd-page") {
  const textGDEnd = document.getElementById("textGDEnd");
  if (textGDEnd) {
    if (localStorage.getItem("lang") === "en") {
      textGDEnd.innerHTML =
        "After a long and terrifying investigation, you finally uncovered the truth behind the murders and successfully captured the black fox before he could escape. Every clue inside the house led you closer to the culprit, and in the end, the case was finally closed. Though the nightmare inside that house would never be forgotten, your name remained as the detective who solved the tragedy and brought justice to the victims.";
    } else {
      textGDEnd.innerHTML =
        "Setelah penyelidikan yang panjang dan menakutkan, kamu akhirnya mengungkap kebenaran di balik pembunuhan dan berhasil menangkap rubah hitam sebelum dia bisa melarikan diri. Setiap petunjuk di dalam rumah membawamu lebih dekat ke pelaku, dan pada akhirnya, kasus ini akhirnya terselesaikan. Meskipun mimpi buruk di dalam rumah itu tidak akan pernah dilupakan, namamu tetap menjadi detektif yang menyelesaikan tragedi ini dan membawa keadilan kepada korban.";
    }
  }
}

// ENDING CONFIRM

const confirmBox = document.getElementById("confirmBox");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

// CLICK ENDING CONTAINER
if (container && confirmBox) {

  container.addEventListener("click", () => {

    confirmBox.classList.add("active");
    console.log("Confirm box shown.");
  });
}

// YES BUTTON
if (yesBtn) {

  yesBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    localStorage.removeItem("quests");
    localStorage.removeItem("offeredQuests");
    localStorage.removeItem("timerActive");
    localStorage.removeItem("timerExpired");
    localStorage.removeItem("goodEndCondition");
    localStorage.removeItem("vanishEndCondition");

    nextPage("Menu.html");

  });
}

// NO BUTTON
if (noBtn) {

  noBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    confirmBox.classList.remove("active");

  });
}

const confirmText = document.getElementById("confirmText");

if (localStorage.getItem("lang") === "id") {

  if (confirmText) {
    confirmText.innerHTML =
      "Apakah anda yakin ingin kembali ke menu?";
  }

  if (yesBtn) {
    yesBtn.innerHTML = "IYA";
  }

  if (noBtn) {
    noBtn.innerHTML = "TIDAK";
  }

} else {

  if (confirmText) {
    confirmText.innerHTML =
      "Are you sure want to back to menu?";
  }

  if (yesBtn) {
    yesBtn.innerHTML = "YES";
  }

  if (noBtn) {
    noBtn.innerHTML = "NO";
  }
}

// ITEM SYSTEM

let selectedItem = null;

let blood;
let camera;
let pinset;
let lockpickItem;
let hasLockpick = localStorage.getItem("hasLockpick") === "true";

let offeredQuests = new Set(
  JSON.parse(localStorage.getItem("offeredQuests")) || [],
);

// SAVE OFFERED QUEST
function saveOfferedQuests() {
  localStorage.setItem("offeredQuests", JSON.stringify([...offeredQuests]));
}

function resetSelection() {
  if (blood) blood.classList.remove("selected");
  if (camera) camera.classList.remove("selected");
  if (pinset) pinset.classList.remove("selected");
  if (lockpickItem) lockpickItem.classList.remove("selected");

  selectedItem = null;
}

document.addEventListener("DOMContentLoaded", () => {
  blood = document.getElementById("item-blood");
  camera = document.getElementById("item-camera");
  pinset = document.getElementById("item-pinset");
  lockpickItem = document.getElementById("item-lockpick");

  if (!lockpickItem) {
    const inventory = document.querySelector(".inventory");
    if (inventory) {
      lockpickItem = document.createElement("img");
      lockpickItem.id = "item-lockpick";
      lockpickItem.className = "item";
      lockpickItem.src = "asset/lockpick.png";
      lockpickItem.style.display = "none";
      inventory.appendChild(lockpickItem);
    }
  }

  if (lockpickItem) {
    lockpickItem.style.display = hasLockpick ? "inline-block" : "none";

    if (hasLockpick) {
      const bedroomLockpick = document.getElementById("lockpick");
      if (bedroomLockpick) {
        bedroomLockpick.style.display = "none";
      }
    }

    lockpickItem.addEventListener("click", () => {
      if (selectedItem === "lockpick") {
        resetSelection();
        return;
      }

      resetSelection();

      lockpickItem.classList.add("selected");

      selectedItem = "lockpick";

      console.log("Selected:", selectedItem);
    });
  }

  // BLOOD
  blood.addEventListener("click", () => {
    if (selectedItem === "blood") {
      resetSelection();
      return;
    }

    resetSelection();

    blood.classList.add("selected");

    selectedItem = "blood";

    console.log("Selected:", selectedItem);
  });

  // CAMERA
  camera.addEventListener("click", () => {
    if (selectedItem === "camera") {
      resetSelection();
      return;
    }

    resetSelection();

    camera.classList.add("selected");

    selectedItem = "camera";

    console.log("Selected:", selectedItem);
  });

  // PINSET
  pinset.addEventListener("click", () => {
    if (selectedItem === "pinset") {
      resetSelection();
      return;
    }

    resetSelection();

    pinset.classList.add("selected");

    selectedItem = "pinset";

    console.log("Selected:", selectedItem);
  });

  function getItemHoverLabel(itemId) {
    const lang = localStorage.getItem("lang") || "en";
    const labels = {
      blood: {
        en: "Blood Detector",
        id: "Pendeteksi Darah",
      },
      camera: {
        en: "Camera",
        id: "Kamera",
      },
      pinset: {
        en: "Pinset",
        id: "Pinset",
      },
      lockpick: {
        en: "Lockpick",
        id: "Pengunci",
      },
    };
    return labels[itemId] ? labels[itemId][lang] : "";
  }

  function createHoverLabel() {
    let hoverLabel = document.getElementById("itemHoverLabel");
    if (!hoverLabel) {
      hoverLabel = document.createElement("div");
      hoverLabel.id = "itemHoverLabel";
      hoverLabel.style.position = "fixed";
      hoverLabel.style.left = "20px";
      hoverLabel.style.bottom = "20px";
      hoverLabel.style.background = "rgba(0, 0, 0, 0.8)";
      hoverLabel.style.color = "white";
      hoverLabel.style.padding = "10px 14px";
      hoverLabel.style.borderRadius = "8px";
      hoverLabel.style.fontFamily = "'Press Start 2P', cursive";
      hoverLabel.style.fontSize = "11px";
      hoverLabel.style.whiteSpace = "nowrap";
      hoverLabel.style.pointerEvents = "none";
      hoverLabel.style.display = "none";
      hoverLabel.style.zIndex = "1000";
      document.body.appendChild(hoverLabel);
    }
    return hoverLabel;
  }

  function setupItemHover(itemElement, itemId) {
    if (!itemElement) return;

    const hoverLabel = createHoverLabel();

    itemElement.addEventListener("mouseenter", () => {
      hoverLabel.textContent = getItemHoverLabel(itemId);
      hoverLabel.style.display = "block";
    });

    itemElement.addEventListener("mouseleave", () => {
      hoverLabel.style.display = "none";
      hoverLabel.textContent = "";
    });
  }

  setupItemHover(blood, "blood");
  setupItemHover(camera, "camera");
  setupItemHover(pinset, "pinset");
  setupItemHover(lockpickItem, "lockpick");
});

// QUEST SYSTEM

const questList = document.getElementById("questList");

let quests = [];

loadQuests();
renderQuests();

function saveQuests() {
  localStorage.setItem("quests", JSON.stringify(quests));
}

function loadQuests() {
  const savedQuests = localStorage.getItem("quests");

  if (savedQuests) {
    quests = JSON.parse(savedQuests);
  }
}

function renderQuests() {
  questList.innerHTML = "";

  quests.forEach((q) => {
    const li = document.createElement("li");

    li.textContent = "- " + q.text;

    li.className = "quest-item" + (q.done ? " completed" : "");

    questList.appendChild(li);
  });
}

function addQuest(text) {
  const exists = quests.some((q) => q.text === text);

  if (exists) return;

  const quest = {
    id: Date.now(),
    text: text,
    done: false,
  };

  quests.push(quest);

  saveQuests();
  renderQuests();
}

function completeQuest(id) {
  quests = quests.map((q) => {
    if (q.id === id) {
      q.done = true;
    }

    return q;
  });

  saveQuests();
  renderQuests();

  setTimeout(() => {
    quests = quests.filter((q) => q.id !== id);

    saveQuests();
    renderQuests();
  }, 600);
}

function completeQuestByText(text) {
  const quest = quests.find((q) => q.text === text);

  if (!quest) return;

  completeQuest(quest.id);
}

function removeQuestByText(text) {
  completeQuestByText(text);
}

// DIALOG SYSTEM

let hideTimer;

function showText(text, duration) {
  const dialogueBox = document.getElementById("dialogueBox");

  const dialogueText = document.getElementById("dialogueText");

  dialogueText.textContent = text;

  dialogueBox.style.display = "block";

  clearTimeout(hideTimer);

  hideTimer = setTimeout(() => {
    dialogueBox.style.display = "none";
  }, duration);
}

// HOTSPOT

const enterRoom = document.getElementById("enterRoom");
const interact = document.getElementById("interact");
const enterDoor = document.getElementById("enterDoor");
const interactClock = document.getElementById("interactClock");
const enterLRoom = document.getElementById("enterLRoom");
const enterKitchen = document.getElementById("enterKitchen");
const interactText = document.getElementById("interactText");
const interactTrash = document.getElementById("interactTrash");
const enterHall = document.getElementById("enterHall");
const interactTool = document.getElementById("interactTool");
const enterLivRoom = document.getElementById("enterLivRoom");
const callPoliceBtn = document.getElementById("callPoliceBtn");
const enterDiningRoom = document.getElementById("enterDiningRoom");
const enterBathRoom = document.getElementById("enterBathRoom");
const enterBedRoom = document.getElementById("enterBedRoom");
const interactCupboard = document.getElementById("interactCupboard");
const interactLP = document.getElementById("interactLP");
const lockpick = document.getElementById("lockpick");
const interactToilet = document.getElementById("interactToiletries");
const interactDB = document.getElementById("interactDB");
const interactDF = document.getElementById("interactDF");

//DECLARE LOCKDOOR VARIABLE
let lockDoor = localStorage.getItem("lockDoor") === "false" ? false : true;

//LOCKPICK INTERACT
if (interactLP) {
  interactLP.addEventListener("click", () => {
    if (!hasLockpick) {
      hasLockpick = true;
      localStorage.setItem("hasLockpick", "true");
      localStorage.setItem("lockDoor", "true");

      const bedroomLockpick = document.getElementById("lockpick");
      if (bedroomLockpick) {
        bedroomLockpick.style.display = "none";
      }

      if (lockpickItem) {
        lockpickItem.style.display = "inline-block";
      }

      showText(
        localStorage.getItem("lang") === "en"
          ? "You obtained a lockpick. It has been added to your inventory."
          : "Kamu mendapatkan lockpick. Lockpick telah ditambahkan ke inventory.",
        4000,
      );
    } else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "You already picked up the lockpick."
          : "Kamu sudah mengambil lockpick.",
        3000,
      );
    }

    resetSelection();
  });
}

// DOOR
if (enterDoor) {
  enterDoor.addEventListener("click", () => {
    const doorQuestText =
      localStorage.getItem("lang") === "en"
        ? "Find a way to open the door"
        : "Cari cara membuka pintu";

    if (selectedItem === "lockpick" && hasLockpick) {
      lockDoor = false;
      localStorage.setItem("lockDoor", "false");
      showText(
        localStorage.getItem("lang") === "en"
          ? "*You unlocked the door using the lockpick.*"
          : "*Kamu membuka pintu menggunakan lockpick.*",
        2000,
      );
      completeQuestByText(doorQuestText);
      resetSelection();

      setTimeout(() => {
        nextPage("MainRoom.html");
      }, 2000);
      return;
    }

    if (lockDoor === false) {
      showText(
        localStorage.getItem("lang") === "en"
          ? "*The door is already unlocked.*"
          : "*Pintu sudah tidak terkunci.*",
        2000,
      );
      completeQuestByText(doorQuestText);
      setTimeout(() => {
        nextPage("MainRoom.html");
      }, 2000);
      return;
    }

    showText(
      localStorage.getItem("lang") === "en"
        ? "*The door is locked.*"
        : "*Pintu terkunci.*",
      3000,
    );
    addQuest(doorQuestText);
  });
}

// PICTURE
if (interact) {
  interact.addEventListener("click", () => {
    if (selectedItem === "camera") {
      const targetText =
        localStorage.getItem("lang") === "en"
          ? "Take a photo with the camera"
          : "Potret Foto dengan kamera";
      removeQuestByText(targetText);
      showText(
        localStorage.getItem("lang") === "en"
          ? "Photo taken."
          : "Foto diambil.",
        2000,
      );
      resetSelection();
    } else if (selectedItem === null) {
      const questText =
        localStorage.getItem("lang") === "en"
          ? "Take a photo with the camera"
          : "Potret Foto dengan kamera";
      if (!offeredQuests.has(questText)) {
        if (localStorage.getItem("lang") === "en") {
          showText("Why is something scribbled here?", 3000);
          addQuest("Take a photo with the camera");
        } else {
          showText("Kenapa ada yang dicoret?", 3000);
          addQuest("Potret Foto dengan kamera");
        }
        offeredQuests.add(questText);
        saveOfferedQuests();
      }
    } else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "There's nothing you can do with this item."
          : "Tidak ada yang bisa dilakukan dengan item ini.",
        3000,
      );
    }
  });
}

// DEAD BODY INTERACT
if (interactDB) {
  interactDB.addEventListener("click", () => {
    const photoQuestKey = "deadBodyPhotoQuest";
    const bloodQuestKey = "deadBodyBloodQuest";

    const photoQuest =
      localStorage.getItem("lang") === "en"
        ? "Take a picture of the dead body with the camera"
        : "Potret mayat dengan kamera";

    const bloodQuest =
      localStorage.getItem("lang") === "en"
        ? "Take a blood sample from the dead body"
        : "Ambil sampel darah dari mayat";

    // NO ITEM
    if (selectedItem === null) {
      if (!offeredQuests.has(photoQuestKey)) {
        showText(
          localStorage.getItem("lang") === "en"
            ? "The culprit must have been very vengeful towards the red fox."
            : "Si pelaku pasti sangat dendam terhadap rubah merah.",
          3000,
        );

        addQuest(photoQuest);

        setTimeout(() => {
          addQuest(bloodQuest);
        }, 3000);

        offeredQuests.add(photoQuestKey);
        offeredQuests.add(bloodQuestKey);

        saveOfferedQuests();
      } else {
        showText(
          localStorage.getItem("lang") === "en"
            ? "The corpse is still covered in blood..."
            : "Mayat itu masih dipenuhi darah...",
          3000,
        );
      }
    }

    // CAMERA
    else if (selectedItem === "camera") {
      const questExists = quests.some((q) => q.text === photoQuest);

      if (questExists) {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You photographed the corpse."
            : "Kamu memotret mayat itu.",
          3000,
        );

        completeQuestByText(photoQuest);
      } else {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You already photographed the corpse."
            : "Kamu sudah memotret mayat itu.",
          3000,
        );
      }

      resetSelection();
    }

    // BLOOD DETECTOR
    else if (selectedItem === "blood") {
      const questExists = quests.some((q) => q.text === bloodQuest);

      if (questExists) {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You collected a blood sample from the corpse."
            : "Kamu mengambil sampel darah dari mayat.",
          3000,
        );
        completeQuestByText(bloodQuest);
        setTimeout(() => {
          showText(
            localStorage.getItem("lang") === "en"
              ? "The blood has decayed, it's estimated that the blood has been out of the corpse since around 9 PM yesterday."
              : "Darahnya membusuk, perkiraan darah sudah keluar dari mayat pada sekitar jam 9 malam, kemarin.",
          5000
        );
      }, 3000);
      setTimeout(() => {
        showText(
          localStorage.getItem("lang") === "en"
            ? "Is this crazy person, sleeping with a corpse? Impossible, he left the lockpick in the room just like that."
            : "Apakah si gila ini, tidur bersama mayat? Tidak mungkin, ia meninggalkan lockpick dikamar satunya begitu saja",
          5000,
        );
      }, 8000);
      } else {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You already analyzed the blood."
            : "Kamu sudah menganalisis darah ini.",
          3000,
        );
      }

      resetSelection();
    }

    // WRONG ITEM
    else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "This item won't help here."
          : "Item ini tidak akan membantu di sini.",
        3000,
      );

      resetSelection();
    }
  });
}

//ENTER SWAP ROOM
if (enterRoom) {
  enterRoom.addEventListener("click", () => {
    playFootstep();
    setTimeout(() => {
      nextPage("LivRoom.html");
    }, 500);
  });
}

if (enterLRoom) {
  enterLRoom.addEventListener("click", () => {
    playFootstep();
    setTimeout(() => {
      nextPage("LRoom.html");
    }, 500);
  });
}

if (enterKitchen) {
  enterKitchen.addEventListener("click", () => {
    playFootstep();
    setTimeout(() => {
      nextPage("Kitchen.html");
    }, 500);
  });
}

if (enterLivRoom) {
  enterLivRoom.addEventListener("click", () => {
    playFootstep();
    setTimeout(() => {
      nextPage("LivRoom.html");
    }, 500);
  });
}

if (enterHall) {
  enterHall.addEventListener("click", () => {
    playFootstep();

    // Check if timer has expired and change Hall image
    if (localStorage.getItem("timerExpired") === "true") {
      localStorage.setItem("hallImageChanged", "true");
    }

    setTimeout(() => {
      nextPage("Hall.html");
    }, 500);
  });
}

if (enterKitchen) {
  enterKitchen.addEventListener("click", () => {
    playFootstep();
    console.log("Entering Kitchen...");
    setTimeout(() => {
      nextPage("Kitchen.html");
    }, 500);
  });
}

if (enterDiningRoom) {
  enterDiningRoom.addEventListener("click", () => {
    playFootstep();
    console.log("Entering Dining Room...");
    setTimeout(() => {
      nextPage("DiningRoom.html");
    }, 500);
  });
}

if (enterBathRoom) {
  enterBathRoom.addEventListener("click", () => {
    playFootstep();
    console.log("Entering Bath Room...");
    setTimeout(() => {
      nextPage("BathRoom.html");
    }, 500);
  });
}

if (enterBedRoom) {
  enterBedRoom.addEventListener("click", () => {
    playFootstep();
    console.log("Entering Bed Room...");
    setTimeout(() => {
      nextPage("BedRoom.html");
    }, 500);
  });
} 

function showChoices(choices) {
  const oldChoices = document.getElementById("dialogueChoices");
  if (oldChoices) {
    oldChoices.remove();
  }
  const dialogueBox = document.getElementById("dialogueBox");
  const choiceContainer = document.createElement("div");
  choiceContainer.id = "dialogueChoices";
  dialogueBox.appendChild(choiceContainer);
  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.classList.add("choice-btn");
    btn.textContent = choice.text;
    btn.addEventListener("click", () => {
      choiceContainer.remove();
      choice.action();
    });
    choiceContainer.appendChild(btn);
  });
}

// Clock Interact
if (interactClock) {
  interactClock.addEventListener("click", () => {
    if (selectedItem === null) {
      showText(
        localStorage.getItem("lang") === "en"
          ? "The clock is stopped at 3:00 PM, maybe it's just the culprit's alibi."
          : "Jam berhenti di pukul 3:00, mungkin ini hanya alibi si pelaku.",
        3000,
      );
    } else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "You can't do anything with the clock."
          : "Kamu tidak bisa melakukan apa-apa dengan jam ini.",
        3000,
      );
    }
  });
}

console.log("JS JALAN");

//TOILETIRIES INTERACT
if (interactToilet) {
  interactToilet.addEventListener("click", () => {
    if (selectedItem === null) {
      showText(
        localStorage.getItem("lang") === "en"
          ? "The toilet is clean and functional."
          : "Toilet ini bersih dan berfungsi.",
        3000,
      );
    } else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "You can't do anything with the toilet."
          : "Kamu tidak bisa melakukan apa-apa dengan toilet ini.",
        3000,
      );
    }
  });
}

//DF INTERACT
if (interactDF) {
  interactDF.addEventListener("click", () => {

    const photoQuestKey = "familyPhotoQuest";
    const bloodQuestKey = "familyPhotoBloodQuest";

    const photoQuest =
      localStorage.getItem("lang") === "en"
        ? "Take a photo of the family portrait"
        : "Potret foto keluarga";

    const bloodQuest =
      localStorage.getItem("lang") === "en"
        ? "Analyze the blood on the family portrait"
        : "Analisis darah pada foto keluarga";

    // NO ITEM
    if (selectedItem === null) {

      if (!offeredQuests.has(photoQuestKey)) {

        showText(
          localStorage.getItem("lang") === "en"
            ? "This culprit is really crazy!! He massacred his own family??"
            : "Si pelaku ini benar-benar gila!! Dia membantai 1 keluarganya sendiri??",
          3000,
        );

        addQuest(photoQuest);

        setTimeout(() => {
          addQuest(bloodQuest);
        }, 3000);

        offeredQuests.add(photoQuestKey);
        offeredQuests.add(bloodQuestKey);

        saveOfferedQuests();

      } else {

        showText(
          localStorage.getItem("lang") === "en"
            ? "The family corpse is still feel disturbing..."
            : "Mayat keluarga ini masih terasa mengganggu...",
          3000,
        );
      }
    }

    // CAMERA
    else if (selectedItem === "camera") {

      const questExists = quests.some(
        (q) => q.text === photoQuest
      );

      if (questExists) {

        showText(
          localStorage.getItem("lang") === "en"
            ? "You photographed the family corpse."
            : "Kamu memotret Mayat keluarga.",
          3000,
        );

        completeQuestByText(photoQuest);

      } else {

        showText(
          localStorage.getItem("lang") === "en"
            ? "You already photographed this corpse."
            : "Kamu sudah memotret mayat ini.",
          3000,
        );
      }

      resetSelection();
    }

    // BLOOD DETECTOR
    else if (selectedItem === "blood") {

      const questExists = quests.some(
        (q) => q.text === bloodQuest
      );

      if (questExists) {

        showText(
          localStorage.getItem("lang") === "en"
            ? "You analyzed the blood on the family portrait using the blood detector! The blood dried around 7 PM yesterday."
            : "Kamu menganalisis darah kering pada mayat. Darah ini tampaknya keluar dari mayat pada jam 7 malam kemarin.",
          7000,
        );

        completeQuestByText(bloodQuest);

      } else {

        showText(
          localStorage.getItem("lang") === "en"
            ? "You already analyzed the blood."
            : "Kamu sudah menganalisis darah ini.",
          3000,
        );
      }

      resetSelection();
    }

    // WRONG ITEM
    else {

      showText(
        localStorage.getItem("lang") === "en"
          ? "This item won't help here."
          : "Item ini tidak akan membantu di sini.",
        3000,
      );

      resetSelection();
    }
  });
}

// TEXT INTERACT
if (interactText) {
  interactText.addEventListener("click", () => {
    const photoQuestKey = "photoQuest";
    const bloodQuestKey = "bloodQuest";
    const photoQuest =
      localStorage.getItem("lang") === "en"
        ? "Take a photo of the blood writing with the camera"
        : "Potret Tulisan darah dengan kamera";
    const bloodQuest =
      localStorage.getItem("lang") === "en"
        ? "Take a blood writing sample with the blood detector"
        : "Ambil sampel tulisan darah dengan pendeteksi darah";
    if (selectedItem === null) {
      if (!offeredQuests.has(photoQuestKey)) {
        showText(
          localStorage.getItem("lang") === "en"
            ? "What kind of crazy person scribbles like this?..."
            : "Orang gila macam apa?...",
          3000,
        );
        addQuest(photoQuest);
        setTimeout(() => {
          addQuest(bloodQuest);
        }, 3000);
        offeredQuests.add(photoQuestKey);
        offeredQuests.add(bloodQuestKey);
        saveOfferedQuests();
      } else {
        showText(
          localStorage.getItem("lang") === "en"
            ? "The dried blood writing is still here..."
            : "Tulisan darah kering itu masih ada...",
          3000,
        );
      }
    } else if (selectedItem === "camera") {
      const questExists = quests.some((q) => q.text === photoQuest);
      if (questExists) {
        showText(
          localStorage.getItem("lang") === "en"
            ? "The photo of the writing has been taken."
            : "Foto tulisan ini berhasil diambil.",
          3000,
        );
        completeQuestByText(photoQuest);
      } else {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You already photographed this writing."
            : "Kamu sudah memotret tulisan ini.",
          3000,
        );
      }
      resetSelection();
    } else if (selectedItem === "blood") {
      const questExists = quests.some((q) => q.text === bloodQuest);
      if (questExists) {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You took a blood sample from this writing using the blood detector! The blood dried around 7 AM."
            : "Kamu mengambil sampel darah dari tulisan ini menggunakan pendeteksi darah! Darah ini mengering sekitar jam 7 pagi.",
          7000,
        );
        completeQuestByText(bloodQuest);
      } else {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You already analyzed the blood."
            : "Kamu sudah menganalisis darah ini.",
          3000,
        );
      }
      resetSelection();
    } else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "This item won't help here."
          : "Item ini tidak akan membantu di sini.",
        3000,
      );
      resetSelection();
    }
  });
}

// TRASH INTERACT
if (interactTrash) {
  interactTrash.addEventListener("click", () => {
    const questText =
      localStorage.getItem("lang") === "en"
        ? "Search the trash can, using the pinset"
        : "Cari di tempat sampah, menggunakan pinset";
    // NO ITEM
    if (selectedItem === null) {
      // CEK APAKAH QUEST SUDAH PERNAH DIBERIKAN
      if (!offeredQuests.has(questText)) {
        showText(
          localStorage.getItem("lang") === "en"
            ? "The trash can is full of garbage, maybe there's something useful in it."
            : "Tempat sampah penuh dengan sampah, mungkin ada sesuatu yang berguna di dalamnya.",
          3000,
        );
        addQuest(questText);
        // SIMPAN MEMORY QUEST
        offeredQuests.add(questText);
        saveOfferedQuests();
      } else {
        showText(
          localStorage.getItem("lang") === "en"
            ? "It's still the same dirty trash can."
            : "Masih tempat sampah kotor yang sama.",
          2000,
        );
      }
    }
    // CORRECT ITEM
    else if (selectedItem === "pinset") {
      showText(
        localStorage.getItem("lang") === "en"
          ? "You found a vial and a bloody tissue in the trash can using the pinset!"
          : "Kamu menemukan sebuah ampul dan tisu bernoda darah di tempat sampah menggunakan pinset!",
        3000,
      );

      setTimeout(() => {
        showText(
          localStorage.getItem("lang") === "en"
            ? "The vial contains Devilish Spit poison, maybe this was used by the culprit to kill the victim."
            : "Ampul ini berisi racun Devilish Spit, mungkin ini digunakan pelaku untuk melumpuhkan korban.",
          6000,
        );
      }, 3000);

      setTimeout(() => {
        showText(
          localStorage.getItem("lang") === "en"
            ? "This tissue is stained with blood, maybe the culprit cleaned the knife with this tissue."
            : "Tisu bernoda darah ini, mungkin pelaku membersih kan pisaunya dengan tisu ini.",
          6000,
        );
      }, 9000);
      // COMPLETE QUEST
      completeQuestByText(questText);
      // REMOVE ITEM SELECT
      resetSelection();
    }
    // WRONG ITEM
    else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "This item won't help here."
          : "Item ini tidak akan membantu di sini.",
        2000,
      );
    }
  });
}

if (interactTool) {
  interactTool.addEventListener("click", () => {
    if (selectedItem === null) {
      showText(
        localStorage.getItem("lang") === "en"
          ? "The kitchen is well-equipped, but the knife is missing."
          : "Alat dapurnya juga lengkap, tapi pisaunya hilang.",
        3000,
      );
      setTimeout(() => {
        showText(
          localStorage.getItem("lang") === "en"
            ? "Maybe the culprit is carrying the knife."
            : "Pasti si pelakunya sedang membawa pisaunya.",
          3000,
        );
      }, 3000);
      setTimeout(() => {
        showText(
          localStorage.getItem("lang") === "en"
            ? "Maybe the culprit is still here."
            : "Bisa jadi si pelaku masih ada di sini.",
          3000,
        );
      }, 6000);
    } else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "You can't do anything with this tool."
          : "Kamu tidak bisa melakukan apa-apa dengan alat ini.",
        3000,
      );
    }
  });
}

// INTERACT CUPBOARD
if (interactCupboard) {
  interactCupboard.addEventListener("click", () => {
    interactCupboard.style.display = "none";
    interactCupboard.style.pointerEvents = "none";
    const cupboardQuestText =
      localStorage.getItem("lang") === "en"
        ? "Find something to lock the cupboard."
        : "Cari sesuatu untuk mengunci lemari.";

    // Check if HallAway-2.png is displayed (timer expired)
    if (localStorage.getItem("hallImageChanged") === "true") {
      const helpPhoneQuest =
        localStorage.getItem("lang") === "en"
          ? "Call for help on the phone"
          : "Panggil bantuan melalui telepon";
      
      showText(
        localStorage.getItem("lang") === "en"
          ? "The cupboard is open widely. You better call for help immediately..."
          : "Lemari terbuka lebar. Sebaiknya kamu segera panggil bantuan...",
        4000,
      );
      
      // Add help phone quest if not already added
      const helpQuestExists = quests.some((q) => q.text === helpPhoneQuest);
      if (!helpQuestExists) {
        addQuest(helpPhoneQuest);
      }
      resetSelection();
      return;
    }

    if (selectedItem === "lockpick" && hasLockpick) {
      const cupboardQuestExists = quests.some(
        (q) => q.text === cupboardQuestText,
      );
      if (cupboardQuestExists) {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You used the lockpick to lock the cupboard, now call for backup."
            : "Kamu menggunakan lockpick untuk mengunci lemari, sekarang panggil bantuan.",
          4000,
        );
        completeQuestByText(cupboardQuestText);
        resetTimer();
        cupboardLocked = true;
        localStorage.setItem("cupboardLocked", "true");
        goodEndCondition = true;
        localStorage.setItem("goodEndCondition", "true");
        const policeQuest =
          localStorage.getItem("lang") === "en"
            ? "Call the police"
            : "Hubungi polisi";
        addQuest(policeQuest);
        resetSelection();
      } else {
        showText(
          localStorage.getItem("lang") === "en"
            ? "You don't need to use the lockpick here right now."
            : "Kamu tidak perlu menggunakan lockpick di sini sekarang.",
          3000,
        );
        resetSelection();
      }
      return;
    }

    if (cupboardLocked) {
      resetTimer();
      showText(
        localStorage.getItem("lang") === "en"
          ? "You already locked this door."
          : "Kamu sudah mengunci pintu ini.",
        3000,
      );
      resetSelection();
      return;
    }

    if (selectedItem === null) {
      showText(
        localStorage.getItem("lang") === "en"
          ? "I hear breathing sounds from behind the cupboard..."
          : "Aku mendengar suara nafas dari balik lemari...",
        999999,
      );
      goodEndCondition = true;
      localStorage.setItem("goodEndCondition", "true");
      showChoices([
        {
          text:
            localStorage.getItem("lang") === "en"
              ? "OPEN CUPBOARD"
              : "BUKA LEMARI",
          action: () => {
            showText(
              localStorage.getItem("lang") === "en"
                ? "You slowly opened the cupboard..."
                : "Kamu perlahan membuka lemari...",
              3000,
            );

            setTimeout(() => {
              triggerBadEnd();
            }, 3000);
          },
        },
        {
          text:
            localStorage.getItem("lang") === "en"
              ? "LOCK CUPBOARD"
              : "KUNCI LEMARI",
          action: () => {
            showText(
              localStorage.getItem("lang") === "en"
                ? "You decided to lock the cupboard from outside."
                : "Kamu memutuskan mengunci lemari dari luar.",
              3000,
            );
            addQuest(cupboardQuestText);
            startTimer();
          },
        },
      ]);
    } else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "You can't do anything with this item."
          : "Item ini tidak bisa digunakan di sini.",
        3000,
      );
      resetSelection();
    }
  });
}

// CALL POLICE BUTTON
const callPolice = document.getElementById("callPoliceBtn");

if (callPolice) {
  callPolice.addEventListener("click", () => {
    // Complete the help phone quest
    const helpPhoneQuest =
      localStorage.getItem("lang") === "en"
        ? "Call for help on the phone"
        : "Panggil bantuan melalui telepon";
    completeQuestByText(helpPhoneQuest);

    console.log(vanishEndCondition);
    if (vanishEndCondition === true) {
      console.log("Triggering Vanish End...");
      showText(
        localStorage.getItem("lang") === "en"
          ? "You called the police, but the culprit vanished without a trace."
          : "Kamu memanggil polisi, tapi si pelaku lolos begitu saja tanpa jejak.",
        4000,
      );
      setTimeout(() => {
        triggerVanishEnd();
      }, 4000);
    } else if (goodEndCondition === true || cupboardLocked) {
      showText(
        localStorage.getItem("lang") === "en"
          ? "You called the police because you suspected breathing sounds from the cupboard."
          : "Kamu memanggil polisi karena mencurigai bunyi nafas dari lemari.",
        4000,
      );
      setTimeout(() => {
        triggerGoodEnd();
      }, 4000);
    } else {
      showText(
        localStorage.getItem("lang") === "en"
          ? "You decided to call the police and abandon the investigation..."
          : "Kamu memutuskan memanggil polisi dan meninggalkan penyelidikan...",
        4000,
      );

      setTimeout(() => {
        addEnding("CowardEnd");
        clearInterval(bgmSaveInterval);
        localStorage.removeItem("bgmTime");
        nextPage("CowardEnd.html");
      }, 4000);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "en";
  const img = document.getElementById("img");

  // Check and restore timer state if it was running
  if (localStorage.getItem("timerActive") === "true") {
    const timerStartTime = parseInt(
      localStorage.getItem("timerStartTime") || "0",
    );
    const elapsedTime = Math.floor((Date.now() - timerStartTime) / 1000);
    const remainingTime = 10 - elapsedTime;

    if (remainingTime > 0) {
      timerDuration = remainingTime;
      timerActive = true;
      const timerDisplay = document.getElementById("timerDisplay");
      if (timerDisplay) {
        timerDisplay.style.display = "block";
        timerDisplay.textContent = timerDuration;
      }

      timerInterval = setInterval(() => {
        timerDuration--;

        if (timerDisplay) {
          timerDisplay.textContent = timerDuration;
        }

        if (timerDuration <= 0) {
          clearInterval(timerInterval);

          timerExpired = true;
          timerActive = false;

          localStorage.setItem("timerExpired", "true");
          localStorage.setItem("timerActive", "false");

          if (timerDisplay) {
            timerDisplay.style.display = "none";
          }

          const currentPage = document.body.id;

          const safeRooms = [
            "BedRoom-page",
            "BathRoom-page",
            "DiningRoom-page",
          ];

          if (safeRooms.includes(currentPage)) {
            vanishEndCondition = true;

            localStorage.setItem("vanishEndCondition", "true");

            goodEndCondition = false;

            localStorage.setItem("goodEndCondition", "false");

            console.log("Vanish End Active");
          }
        }
      }, 1000);
    } else {
      localStorage.setItem("timerExpired", "true");
      localStorage.setItem("timerActive", "false");
    }
  }

  // Change Hall image if timer expired
  if (img && document.body.id === "Hall-page") {
    if (localStorage.getItem("hallImageChanged") === "true") {
      img.src = "asset/HallAway-2.png";
    } else if (lang === "id") {
      img.src = "asset/HallAway.png";
    } else {
      img.src = "asset/HallAway.png";
    }
  }

  if (img && document.body.id === "LivRoom-page") {
    if (lang === "id") {
      img.src = "asset/LivRoom-ID.png";
    } else {
      img.src = "asset/LivRoom.png";
    }
  }

  const callPoliceBtn = document.getElementById("callPoliceBtn");
  if (callPoliceBtn) {
    if (lang === "id") {
      callPoliceBtn.innerHTML = "HUBUNGI BANTUAN";
    } else {
      callPoliceBtn.innerHTML = "CALL FOR BACKUP";
    }
  }

  // Add initial quest at the start of the game
  const initialQuest =
    lang === "id"
      ? "Cari jejak di setiap jengkal di rumah ini"
      : "Search for clues in every corner of this house";
  addQuest(initialQuest);
});

console.log("In-game script loaded.");