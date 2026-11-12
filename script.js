const nav=document.getElementById('mainNav'),toggle=document.getElementById('menuToggle');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.nav-link,.nav-cv').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav-link')];
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section=>observer.observe(section));
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.getElementById('scrollProgress').style.width=(max>0?scrollY/max*100:0)+'%';});
document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.project-card').forEach(card=>{card.hidden=btn.dataset.filter!=='all'&&card.dataset.category!==btn.dataset.filter;});}));
const modal=document.getElementById('projectModal'),modalData={
 rtk:{type:'FIELD SURVEY / GNSS',title:'RTK & GNSS Surveying',text:'Field-based high-precision positioning and spatial data collection. RTK observations can support ground control, georeferencing, field validation and accurate GIS datasets.',extra:['GNSS / RTK field data collection','Ground control and georeferencing support','Spatial data validation and quality assessment']},
 uav:{type:'UAV / PHOTOGRAMMETRY',title:'UAV Aerial Survey',text:'UAV field operations and image acquisition for photogrammetric mapping. Workflows described in the CV include processing imagery into orthomosaics, DSMs, DTMs and 3D point clouds.',extra:['UAV mission planning and image acquisition','Orthomosaic and elevation model generation','Integration with GIS and remote sensing data']},
 gis:{type:'GIS / REMOTE SENSING',title:'Spatial Analysis & Mapping',text:'Applied GIS and remote sensing work across infrastructure, agriculture, environment and settlement mapping projects.',extra:['Thematic mapping and spatial database development','Satellite image analysis, NDVI and land-cover assessment','Flood impact, change detection and spatial modelling']}
};
function openModal(key){const d=modalData[key];if(!d)return;document.getElementById('modalType').textContent=d.type;document.getElementById('modalTitle').textContent=d.title;document.getElementById('modalText').textContent=d.text;document.getElementById('modalExtra').innerHTML='<ul>'+d.extra.map(x=>'<li>'+x+'</li>').join('')+'</ul>';modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-modal]').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.modal)));
modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

// ===================================
// GEOSPATIAL PROJECT PHOTO GALLERIES
// ===================================

const projectPhotos = {
  gis: [
    "assets/projects/gis/photo-01.jpg",
    "assets/projects/gis/photo-02.jpg",
    "assets/projects/gis/photo-03.jpg"
  ],

  uav: [
    "assets/projects/uav/photo-01.jpg",
    "assets/projects/uav/photo-02.jpg",
    "assets/projects/uav/photo-03.jpg"
  ],

  photogrammetry: [
    "assets/projects/photogrammetry/photo-01.jpg",
    "assets/projects/photogrammetry/photo-02.jpg",
    "assets/projects/photogrammetry/photo-03.jpg",
    "assets/projects/photogrammetry/photo-04.jpg"
  ],

  rtk: [
    "assets/projects/rtk-gnss/photo-01.jpg",
    "assets/projects/rtk-gnss/photo-02.jpg",
    "assets/projects/rtk-gnss/photo-03.jpg"
  ]
};

// Create full-screen viewer
const lightbox = document.createElement("div");
lightbox.className = "photo-lightbox";

lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">✕</button>
  <button class="lightbox-prev" aria-label="Previous">❮</button>
  <img src="" alt="Project photograph">
  <button class="lightbox-next" aria-label="Next">❯</button>
`;

document.body.appendChild(lightbox);

const viewerImage = lightbox.querySelector("img");

let currentPhotos = [];
let currentIndex = 0;

function showPhoto(index) {
  if (!currentPhotos.length) return;

  currentIndex =
    (index + currentPhotos.length) % currentPhotos.length;

  viewerImage.src = currentPhotos[currentIndex];
}

function openGallery(photos, index = 0) {
  currentPhotos = photos;
  showPhoto(index);
  lightbox.classList.add("active");
}

function closeGallery() {
  lightbox.classList.remove("active");
}

lightbox.querySelector(".lightbox-close")
  .addEventListener("click", closeGallery);

lightbox.querySelector(".lightbox-prev")
  .addEventListener("click", () =>
    showPhoto(currentIndex - 1)
  );

lightbox.querySelector(".lightbox-next")
  .addEventListener("click", () =>
    showPhoto(currentIndex + 1)
  );

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeGallery();
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("active")) return;

  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
  if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
});

// Automatic slideshow in every project card
document.querySelectorAll(".project-slider").forEach(slider => {

  const galleryName = slider.dataset.gallery;
  const photos = projectPhotos[galleryName];

  if (!photos || !photos.length) return;

  let index = 0;
  let paused = false;

  const img = slider.querySelector("img");

  const counter = slider.querySelector(".photo-count");

  if (counter) {
    counter.textContent = `01 / ${String(photos.length).padStart(2, "0")}`;
  }

  function updatePhoto() {
    if (paused || lightbox.classList.contains("active")) return;

    index = (index + 1) % photos.length;

    img.style.opacity = "0";

    setTimeout(() => {
      img.src = photos[index];
      img.style.opacity = "1";

      if (counter) {
        counter.textContent =
          `${String(index + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
      }
    }, 250);
  }

  const timer = setInterval(updatePhoto, 5000);

  slider.addEventListener("mouseenter", () => paused = true);
  slider.addEventListener("mouseleave", () => paused = false);

  slider.addEventListener("click", () => {
    openGallery(photos, index);
  });

  // Preload photos
  photos.forEach(src => {
    const image = new Image();
    image.src = src;
  });
});
