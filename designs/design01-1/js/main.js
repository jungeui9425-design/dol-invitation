let invitationData = null;
let customerId = "sample01-1";

const params = new URLSearchParams(window.location.search);
if (params.get("c")) {
  customerId = params.get("c");
}

function customerImg(filename) {
  return "../../customers/" + customerId + "/img/" + filename;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el && html) el.innerHTML = html;
}

function setImage(id, filename) {
  const el = document.getElementById(id);
  if (el && filename) el.src = customerImg(filename);
}



document.addEventListener("DOMContentLoaded", function () {
    loadInvitationData();
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
   9. 초대장 링크 복사
========================= */
function copyInviteLink() {
  copyToClipboard(
    window.location.href,
    "초대장 링크가 복사되었습니다."
  );
}




/* =========================
   JSON 데이터 불러오기
========================= */
function loadInvitationData() {
  fetch("../../customers/" + customerId + "/data.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      invitationData = data;

      // 브라우저 탭 제목 변경
      if (data.page && data.page.title) {
      document.title = data.page.title;
      }

     applyInvitationData(data);
     initJsonGallery(data);
    })
    .catch(function (error) {
      console.error("data.json을 불러오지 못했습니다.", error);
    });
}

/* =========================
   JSON 내용을 HTML에 넣기
========================= */
function applyInvitationData(data) {
  setText("title", data.baby.title);
  setHTML(
     "babySub",
     data.baby.subText
    );

  setText("eventDate", data.event.date + ", " + data.event.time);
  setText("eventFullDate", data.event.date + ", " + data.event.time);
  setText("eventPlace", data.event.place);
  setText("eventPlace2", data.event.place);
  setText("eventAddress", data.event.address);

  setHTML(
    "parentsText",
    "아빠. " + data.parents.father.name + " <span>♥</span> 엄마. " + data.parents.mother.name
  );

  setText("fatherName", "父 " + data.parents.father.name);
  setText("motherName", "母 " + data.parents.mother.name);

  const fatherTel = document.getElementById("fatherTel");
  const fatherSms = document.getElementById("fatherSms");
  const motherTel = document.getElementById("motherTel");
  const motherSms = document.getElementById("motherSms");

  if (fatherTel) fatherTel.href = "tel:" + data.parents.father.phone;
  if (fatherSms) fatherSms.href = "sms:" + data.parents.father.phone;
  if (motherTel) motherTel.href = "tel:" + data.parents.mother.phone;
  if (motherSms) motherSms.href = "sms:" + data.parents.mother.phone;

  setImage("introBaby", data.images.introBaby);
  setImage("messageLeft", data.images.messageLeft);
  setImage("messageRight", data.images.messageRight);

  if (data.message) {
    setHTML("messageText", data.message.join("<br>"));
  }

  setText("fatherAccountTitle", "아빠 " + data.parents.father.name + " 계좌번호 확인하기 ▼");
  setText("motherAccountTitle", "엄마 " + data.parents.mother.name + " 계좌번호 확인하기 ▼");

  setText("fatherAccount", data.parents.father.account);
  setText("motherAccount", data.parents.mother.account);

  setHTML("thanksText", data.thanks);
}

/* =========================
   JSON 갤러리 생성
========================= */
function initJsonGallery(data) {
  const galleryImage = document.getElementById("galleryImage");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const thumbsWrap = document.querySelector(".thumbs");
  const currentIndex = document.getElementById("currentIndex");
  const totalIndex = document.getElementById("totalIndex");

  if (!galleryImage || !thumbsWrap || !data.images.gallery) return;

  let galleryIndex = 0;

  const galleryList = data.images.gallery.map(function (filename) {
    return customerImg(filename);
  });

  thumbsWrap.innerHTML = "";

  galleryList.forEach(function (src, index) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "갤러리 사진 " + (index + 1);

    img.addEventListener("click", function () {
      updateGallery(index);
    });

    thumbsWrap.appendChild(img);
  });

  if (totalIndex) totalIndex.textContent = galleryList.length;

  function updateGallery(index) {
    if (galleryList.length === 0) return;

    galleryIndex = index;

    if (galleryIndex < 0) galleryIndex = galleryList.length - 1;
    if (galleryIndex >= galleryList.length) galleryIndex = 0;

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

  let startX = 0;

  galleryImage.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  });

  galleryImage.addEventListener("touchend", function (e) {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) updateGallery(galleryIndex + 1);
    if (endX - startX > 50) updateGallery(galleryIndex - 1);
  });

  updateGallery(0);
}

/* =========================
   JSON 계좌/주소 복사
========================= */
function copyFatherAccount() {
  if (!invitationData) return;
  copyText(invitationData.parents.father.account);
}

function copyMotherAccount() {
  if (!invitationData) return;
  copyText(invitationData.parents.mother.account);
}

function copyAddress() {
  if (!invitationData) return;
  copyToClipboard(invitationData.event.address, "주소가 복사되었습니다.");
}