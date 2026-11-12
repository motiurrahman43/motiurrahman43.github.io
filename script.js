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
