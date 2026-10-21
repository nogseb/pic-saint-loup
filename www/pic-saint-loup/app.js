(() => {
  'use strict';
  const points = {
    base: {label:'Saint-Jean-de-Cuculles', coords:[43.7533,3.8353], type:'home', url:'https://www.google.com/maps/search/?api=1&query=Saint-Jean-de-Cuculles'},
    matelles: {label:'Les Matelles',coords:[43.7310,3.8098]},
    stmartin: {label:'Saint-Martin-de-Londres',coords:[43.7914,3.7310]},
    notredame: {label:'Notre-Dame-de-Londres',coords:[43.8278,3.7778]},
    ravin: {label:'Ravin des Arcs (départ)',coords:[43.8200681,3.7288284],type:'optional',url:'https://www.grandpicsaintloup-tourisme.fr/itineraires/le-ravin-des-arcs-pr'},
    montpellier: {label:'Montpellier (centre)',coords:[43.6108,3.8767],type:'end'},
    parking: {label:'Parking du Pic Saint-Loup',coords:[43.77031,3.79268],type:'home'},
    sommet: {label:'Sommet du Pic Saint-Loup',coords:[43.779,3.814],type:'trail',url:'https://www.grandpicsaintloup-tourisme.fr/itineraires/le-pic-saint-loup-pr'},
    cazevieille: {label:'Cazevieille',coords:[43.769,3.788]},
    hortus: {label:'Paysages de l’Hortus (Valflaunès)',coords:[43.82,3.869]},
    lac: {label:'Lac de Cécélès',coords:[43.7644,3.8893]}
  };
  const days = {
    samedi:{title:'La boucle du samedi',steps:['base','matelles','stmartin','notredame','montpellier'],route:['base','matelles','stmartin','notredame','base']},
    dimanche:{title:'La montée du dimanche',steps:['base','parking','sommet','cazevieille','hortus'],route:['base','parking','hortus','base']},
    lundi:{title:'La balade du lundi',steps:['base','lac'],route:['base','lac']}
  };
  const tabs = [...document.querySelectorAll('[data-day]')];
  const includeRavin = document.getElementById('include-ravin');
  const mapTitle = document.getElementById('map-day-title');
  const dayMapLink = document.getElementById('day-map-link');
  let current = 'samedi';
  let map = null;
  let layer = null;
  let markers = {};
  function getDays(){
    const config=days[current];
    if(current!=='samedi'||!includeRavin?.checked)return config;
    return {...config,steps:['base','matelles','stmartin','notredame','ravin','montpellier'],route:['base','matelles','stmartin','notredame','ravin']};
  }
  function googleRoute(keys){
    // Route API : étapes ordonnées pour créer un itinéraire routier réel dans Google Maps.
    const items=keys.filter((key,index)=>index===0 || key!==keys[index-1]);
    const labels=items.map(key=>points[key].coords.join(','));
    const origin=labels[0],destination=labels[labels.length-1];
    const middles=labels.slice(1,-1);
    return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(origin)+'&destination='+encodeURIComponent(destination)+(middles.length?'&waypoints='+encodeURIComponent(middles.join('|')):'')+'&travelmode=driving';
  }
  function markerIcon(index,key){
    const type=points[key].type||'main';
    return L.divIcon({className:'',html:`<div class="marker-pin ${type}" aria-hidden="true"><span>${type==='home'?'⌂':type==='trail'?'▲':type==='end'?'★':index}</span></div>`,iconSize:[33,33],iconAnchor:[16,16],popupAnchor:[0,-18]});
  }
  function renderMap(){
    const conf=getDays();
    mapTitle.textContent=conf.title;
    dayMapLink.href=googleRoute(conf.route);
    if(!map || !window.L)return;
    if(layer)layer.remove();
    layer=L.layerGroup().addTo(map); markers={};
    // Les liaisons sont schématiques : elles ne représentent pas le tracé des routes.
    const driveLinks=conf.route.filter(key=>key!=='sommet').map(key=>points[key].coords);
    L.polyline(driveLinks,{color:'#bd764b',weight:3,opacity:.77,dashArray:'3 10',lineCap:'round',interactive:false}).addTo(layer);
    if(current==='dimanche')L.polyline([points.parking.coords,points.sommet.coords],{color:'#375c40',weight:3,opacity:.88,dashArray:'2 8',interactive:false}).addTo(layer);
    const bounds=[];
    const unique=[...new Set(conf.steps)];
    unique.forEach((key,index)=>{
      const point=points[key];bounds.push(point.coords);
      const label=point.label;
      const popup=`<strong>${label.replaceAll('&','&amp;')}</strong><br><a href="${point.url||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(label)}" rel="noopener noreferrer" target="_blank">Ouvrir la destination ↗</a>`;
      const marker=L.marker(point.coords,{icon:markerIcon(index+1,key),title:label}).bindPopup(popup).addTo(layer);
      markers[key]=marker;
    });
    if(bounds.length>1){
      map.fitBounds(L.latLngBounds(bounds).pad(.15),{padding:[35,35],maxZoom:current==='samedi'?11:12,animate:false});
    }
    requestAnimationFrame(()=>map.invalidateSize(false));
  }
  function showDay(next,focus=false){
    if(!days[next])return;
    current=next;
    tabs.forEach(tab=>{
      const active=tab.dataset.day===next;
      tab.classList.toggle('active',active);
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
    });
    for(const panel of document.querySelectorAll('.day-panel')){
      const active=panel.id==='panel-'+next;panel.hidden=!active;panel.classList.toggle('active',active);
    }
    renderMap();
    if(focus)document.getElementById('panel-'+next)?.focus({preventScroll:true});
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>showDay(tab.dataset.day));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const nextIndex=event.key==='Home'?0:event.key==='End'?tabs.length-1:event.key==='ArrowRight'?(index+1)%tabs.length:(index-1+tabs.length)%tabs.length;
      tabs[nextIndex].focus();showDay(tabs[nextIndex].dataset.day);
    });
  });
  includeRavin?.addEventListener('change',renderMap);
  document.querySelectorAll('.stop[data-marker]').forEach(stop=>stop.addEventListener('mouseenter',()=>{
    if(window.matchMedia('(hover:hover)').matches && markers[stop.dataset.marker])markers[stop.dataset.marker].openPopup();
  }));
  function initMap(){
    if(!window.L)return;
    map=L.map('map',{scrollWheelZoom:false,zoomControl:true,preferCanvas:true});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    document.querySelector('.map-stage')?.classList.add('leaflet-ready');
    renderMap();
  }
  window.addEventListener('load',initMap,{once:true});
  showDay('samedi');
})();