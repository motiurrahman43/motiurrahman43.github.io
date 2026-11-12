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
 gis:{type:'GIS / REMOTE SENSING',title:'Spatial Analysis & Mapping',text:'Applied GIS and remote sensing work across infrastructure, agriculture, environment and settlement mapping projects.',extra:['Thematic mapping and spatial database development','Satellite image analysis, NDVI and land-cover assessment','Flood impact, change detection and spatial modelling']},
 photogrammetry:{type:'UAV / PHOTOGRAMMETRY',title:'3D Mapping & Modeling',text:'Photogrammetric processing of UAV imagery into geospatial products for mapping, measurement and terrain analysis.',extra:['UAV image processing and 3D reconstruction','Orthomosaics, DSMs and DTMs','Point clouds and terrain modelling']}
};
function openModal(key){const d=modalData[key];if(!d)return;document.getElementById('modalType').textContent=d.type;document.getElementById('modalTitle').textContent=d.title;document.getElementById('modalText').textContent=d.text;document.getElementById('modalExtra').innerHTML='<ul>'+d.extra.map(x=>'<li>'+x+'</li>').join('')+'</ul>';modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-modal]').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.modal)));
modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

// ===================================
// INTERACTIVE PROJECT PHOTO GALLERIES
// ===================================
const projectPhotos = {
  gis: ["assets/gis/photo-01.png","assets/gis/photo-02.png","assets/gis/photo-03.jpeg"],
  uav: ["assets/uav/photo-01.jpg","assets/uav/photo-02.jpeg"],
  photogrammetry: ["assets/photogrammetry/photo-01.jpg","assets/photogrammetry/photo-02.jpg","assets/photogrammetry/photo-03.jpg","assets/photogrammetry/photo-04.jpg"],
  rtk: ["assets/rtk-gnss/photo-01.jpeg","assets/rtk-gnss/photo-02.jpeg"]
};

const lightbox = document.createElement("div");
lightbox.className = "photo-lightbox";
lightbox.setAttribute("role","dialog");
lightbox.setAttribute("aria-modal","true");
lightbox.setAttribute("aria-label","Project photo viewer");
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close photo viewer">✕</button>
  <button class="lightbox-prev" aria-label="Previous photo">❮</button>
  <img src="" alt="Project photograph">
  <button class="lightbox-next" aria-label="Next photo">❯</button>
  <span class="lightbox-count" aria-live="polite"></span>
`;
document.body.appendChild(lightbox);
const viewerImage = lightbox.querySelector("img");
const viewerCount = lightbox.querySelector(".lightbox-count");
let currentPhotos = [], currentIndex = 0, lastFocused = null;

function showPhoto(index) {
  if (!currentPhotos.length) return;
  currentIndex = (index + currentPhotos.length) % currentPhotos.length;
  viewerImage.src = currentPhotos[currentIndex];
  viewerCount.textContent = `${String(currentIndex+1).padStart(2,"0")} / ${String(currentPhotos.length).padStart(2,"0")}`;
}
function openGallery(photos,index=0) {
  currentPhotos = photos;
  lastFocused = document.activeElement;
  showPhoto(index);
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close").focus();
}
function closeGallery() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}
lightbox.querySelector(".lightbox-close").addEventListener("click",closeGallery);
lightbox.querySelector(".lightbox-prev").addEventListener("click",()=>showPhoto(currentIndex-1));
lightbox.querySelector(".lightbox-next").addEventListener("click",()=>showPhoto(currentIndex+1));
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeGallery();});

document.querySelectorAll(".project-slider").forEach(slider=>{
  const photos = projectPhotos[slider.dataset.gallery];
  if (!photos || !photos.length) return;
  const img = slider.querySelector("img");
  const counter = slider.querySelector(".photo-count");
  let index = 0, paused = false, timer;
  const updateCounter = () => { if(counter) counter.textContent = `${String(index+1).padStart(2,"0")} / ${String(photos.length).padStart(2,"0")}`; };
  const advance = () => {
    if(paused || lightbox.classList.contains("active") || document.hidden) return;
    index = (index+1)%photos.length;
    img.style.opacity = "0";
    window.setTimeout(()=>{img.src=photos[index];img.style.opacity="1";updateCounter();},220);
  };
  const open = () => openGallery(photos,index);
  slider.addEventListener("click",open);
  slider.addEventListener("keydown",e=>{if(e.key==="Enter" || e.key===" "){e.preventDefault();open();}});
  slider.addEventListener("mouseenter",()=>paused=true);
  slider.addEventListener("mouseleave",()=>paused=false);
  slider.addEventListener("focusin",()=>paused=true);
  slider.addEventListener("focusout",()=>paused=false);
  timer = window.setInterval(advance,5000);
  photos.forEach(src=>{const preload=new Image();preload.src=src;});
  updateCounter();
});

document.addEventListener("keydown",event=>{
  if(lightbox.classList.contains("active")){
    if(event.key==="Escape") closeGallery();
    if(event.key==="ArrowRight") showPhoto(currentIndex+1);
    if(event.key==="ArrowLeft") showPhoto(currentIndex-1);
  }
});

// Expandable toolkit capability cards
 document.querySelectorAll('.skill-toggle').forEach(button=>{
   button.addEventListener('click',()=>{
     const card=button.closest('.skill-card');
     const detail=card.querySelector('.skill-detail');
     const expanded=button.getAttribute('aria-expanded')==='true';
     button.setAttribute('aria-expanded',String(!expanded));
     detail.hidden=expanded;
     card.classList.toggle('expanded',!expanded);
     button.querySelector('span').textContent=expanded?'＋':'−';
     button.firstChild.textContent=expanded?'Explore capabilities ':'Hide capabilities ';
   });
 });
