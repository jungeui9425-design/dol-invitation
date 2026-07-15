document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     1. 음악 버튼
  ========================= */
const musicBtn = document.getElementById("musicBtn");
const bgm = document.getElementById("bgm");

let isPlaying = false;

function playMusic() {
  if (!bgm || isPlaying) return;

  bgm.play().then(function () {
    isPlaying = true;
    musicBtn.classList.remove("paused");
  }).catch(function () {});
}

if (musicBtn && bgm) {
  // 처음 화면은 재생 대기 상태
  musicBtn.classList.remove("paused");

  // 자동재생 시도
  playMusic();

  // 버튼 클릭 시 재생/정지
  musicBtn.addEventListener("click", function () {
    if (isPlaying) {
      bgm.pause();
      isPlaying = false;
      musicBtn.classList.add("paused");
    } else {
      playMusic();
    }
  });

  // 사용자가 화면을 처음 터치하거나 스크롤하려고 하면 재생
  document.addEventListener("touchstart", playMusic, { once: true });
  document.addEventListener("click", playMusic, { once: true });
  document.addEventListener("scroll", playMusic, { once: true });
}

  /* =========================
     2. 메인 첫 화면 등장
  ========================= */
  const heroItems = document.querySelectorAll(".hero-item");

heroItems.forEach(function(item, index) {

  let delay = 0;

  if(index === 0){
    delay = 200;
  }
  else if(index === 1 || index === 2){
    delay = 400;
  }
  else{
    delay = 400 + ((index - 2) * 180);
  }

  setTimeout(function(){
    item.classList.add("show");
  }, delay);

});

const heroInfos = document.querySelectorAll(".hero-info");

setTimeout(function () {

  heroInfos.forEach(function(info){
    info.classList.add("show");
  });

}, 2200);
    
  /* =========================
     3. 스크롤 등장
  ========================= */
  const fadeSections = document.querySelectorAll(".fade-section");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  fadeSections.forEach(function (section) {
    observer.observe(section);
  });

  /* =========================
     4. 계좌 열기 / 닫기
  ========================= */
  const accountItems = document.querySelectorAll(".account-item");

  accountItems.forEach(function (item) {
    const title = item.querySelector(".account-title");

    if (title) {
      title.addEventListener("click", function () {
        item.classList.toggle("open");
      });
    }
  });

  /* =========================
     5. 갤러리
  ========================= */
  const galleryImage = document.getElementById("galleryImage");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const thumbs = document.querySelectorAll(".thumbs img");
  const currentIndex = document.getElementById("currentIndex");
  const totalIndex = document.getElementById("totalIndex");

  let galleryIndex = 0;
  const galleryList = Array.from(thumbs).map(function (img) {
    return img.getAttribute("src");
  });

  if (totalIndex) {
    totalIndex.textContent = galleryList.length;
  }

  function updateGallery(index) {
    if (!galleryImage || galleryList.length === 0) return;

    galleryIndex = index;

    if (galleryIndex < 0) {
      galleryIndex = galleryList.length - 1;
    }

    if (galleryIndex >= galleryList.length) {
      galleryIndex = 0;
    }

    galleryImage.src = galleryList[galleryIndex];

    if (currentIndex) {
      currentIndex.textContent = galleryIndex + 1;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      updateGallery(galleryIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      updateGallery(galleryIndex + 1);
    });
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener("click", function () {
      updateGallery(index);
    });
  });

  updateGallery(0);

  /* =========================
     6. 모바일 스와이프
  ========================= */
  let startX = 0;
  let endX = 0;

  if (galleryImage) {
    galleryImage.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    });

    galleryImage.addEventListener("touchend", function (e) {
      endX = e.changedTouches[0].clientX;

      if (startX - endX > 50) {
        updateGallery(galleryIndex + 1);
      }

      if (endX - startX > 50) {
        updateGallery(galleryIndex - 1);
      }
    });
  }
});

/* =========================
   7. 계좌 복사
========================= */
function copyToClipboard(text, message) {

  const textarea = document.createElement("textarea");

  textarea.value = text;

  document.body.appendChild(textarea);

  textarea.select();
  textarea.setSelectionRange(0, 99999);

  document.execCommand("copy");

  document.body.removeChild(textarea);

  alert(message);
}

function copyText(text) {
  copyToClipboard(text, "복사되었습니다.");
}

/* =========================
   8. 주소 복사
========================= */
function copyAddress() {
  if (!invitationData) return;

  copyToClipboard(
    invitationData.event.address,
    "주소가 복사되었습니다."
  );
}

/* =========================
   9. 초대장 링크 복사
========================= */
function copyInviteLink() {
  copyToClipboard(
    window.location.href,
    "초대장 링크가 복사되었습니다."
  );
}

/* =========================
   10. JSON 데이터 불러오기
========================= */
let invitationData = null;

function loadInvitationData() {
  fetch("./data.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      invitationData = data;

      if (data.page && data.page.title) {
        document.title = data.page.title;
      }

      applyInvitationData(data);
    })
    .catch(function (error) {
      console.error("data.json을 불러오지 못했습니다.", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadInvitationData();
});

function applyInvitationData(data) {
  if (!data) return;

  // 메인 제목
  const titleEl = document.getElementById("title");
  if (titleEl && data.baby && data.baby.title) {
    titleEl.textContent = data.baby.title;
  }

  // 서브 문구
  const babySub = document.getElementById("babySub");
  if (babySub && data.baby && data.baby.subText) {
   babySub.innerHTML = data.baby.subText;
  }

  // 메인 아기사진
  const introBaby = document.getElementById("introBaby");
  if (introBaby && data.images && data.images.introBaby) {
    introBaby.src = "./img/" + data.images.introBaby;
  }

  // 날짜 + 시간
  const eventDate = document.getElementById("eventDate");
  if (eventDate && data.event) {
    eventDate.textContent = data.event.date + ", " + data.event.time;
  }

  // 장소
  const eventPlace = document.getElementById("eventPlace");
  if (eventPlace && data.event && data.event.place) {
    eventPlace.textContent = data.event.place;
  }

  // 부모 이름
  const parentsText = document.getElementById("parentsText");
  if (parentsText && data.parents) {
    parentsText.innerHTML =
      "아빠. " + data.parents.father.name + " <span>♥</span> 엄마. " + data.parents.mother.name;
  }

  // 인사말 사진
  const messageLeft = document.getElementById("messageLeft");
  if (messageLeft && data.images && data.images.messageLeft) {
    messageLeft.src = "./img/" + data.images.messageLeft;
  }

  const messageRight = document.getElementById("messageRight");
  if (messageRight && data.images && data.images.messageRight) {
    messageRight.src = "./img/" + data.images.messageRight;
  }

  // 인사말
  const messageText = document.getElementById("messageText");
  if (messageText && data.message) {
    messageText.innerHTML = data.message.join("<br>");
  }

  // 행사일 안내
  const eventFullDate = document.getElementById("eventFullDate");
  if (eventFullDate && data.event && data.event.fullDate) {
    eventFullDate.textContent = data.event.fullDate;
  }


  // 장소 안내
  const eventPlace2 = document.getElementById("eventPlace2");
  if (eventPlace2 && data.event && data.event.place) {
    eventPlace2.textContent = data.event.place;
  }

  const eventAddress = document.getElementById("eventAddress");
  if (eventAddress && data.event && data.event.address) {
    eventAddress.textContent = data.event.address;
  }

  // 감사 문구
  const thanksText = document.getElementById("thanksText");
  if (thanksText && data.thanks) {
    thanksText.innerHTML = data.thanks;
  }
}