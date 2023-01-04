$(init);

// var idMarker = {
// [
//   {
//     "id": 1,
//     "title": "Museum of King Jan III’s Palace at Wilanów - <span>2,5h</span>",
//     "small": "ul. St. Kostki Potockiego 10/16",
//     "img": {
//       "src": "https://warsawtour.pl/wp-content/uploads/2018/07/Wilan%C3%B3w_fot.-Zbigniew-Pan%C3%B3w_pzstudio.pl_.jpg",
//       "alt": "Museum of King Jan III’s Palace at Wilanów"
//     },
//     "description": "<p>Wilanów Palace is a true pearl of Baroque architecture in Warsaw. Learn about King Jan III Sobieski, who successfully fended off the Turks in the battle of Vienna and who lived in Wilanów with his beloved Marysieńka. Take a walk in the park and tour the palace interiors; see the portrait gallery and listen to stories of great romances. The building and the park have both kept their original form, despite the partition, war, and occupation. Wilanów Palace is a must-see when visiting Warsaw. In the wintertime, the venue, illuminated with thousands of lamps, transforms into the Royal Garden of Lights.</p>"
//   },
// };

var greenMarker = L.ExtraMarkers.icon({
    shape: 'circle',
    markerColor: 'green',
});

var redMarker = L.ExtraMarkers.icon({
    shape: 'star',
    markerColor: 'red',
});

var orangeMarker = L.ExtraMarkers.icon({
    shape: 'penta',
    markerColor: 'orange',
});

var nomGare = [];
var marqueur = [];

let config = {
  minZoom: 6,
  maxZoom: 17,
  zoomControl: false,
};
// magnification with which the map will start
const zoom = 6;
// co-ordinates

const lat = 46.266431;
const lng = 2.116396;

// coordinates limiting the map
function getBounds() {
  const southWest = new L.LatLng(51, -4.1426565);
  const northEast = new L.LatLng(53, 2.3667);
  return new L.LatLngBounds(southWest, northEast);
}

let recherche;
let map;
var layer;
let markersCluster;
const buttonClose = document.querySelector(".close-button");

function init() {
  map = L.map("map container-fluid py-4", config);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

  }).addTo(map);
  map.setView([lat, lng], zoom);

  map.setMaxBounds(map.getBounds());
  // zoom the map to the polyline
  map.fitBounds(getBounds(), { reset: true });
  map.setView([lat, lng], zoom);
  map.addControl(new L.Control.ZoomMin())
  // create the sidebar instance and add it to the map
//   var sidebar = L.control.sidebar('sidebar', { position: 'right' }).addTo(map);

  // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);

  // --------------------------------------------------------------

  $.ajax({
    type: "GET",
    url: "https://france-geojson.gregoiredavid.fr/repo/regions.geojson",
    success: function(retour) {
      retour.features.forEach(function(state) {
        layer = L.geoJSON(state).addTo(map);
        //myLayer = L.geoJSON();
        layer.addData(state);
      });
    }
  });

  $.ajax({
    type: "GET",
    url: "https://ressources.data.sncf.com//api/records/1.0/search/?dataset=referentiel-gares-voyageurs&q=&rows=3213&sort=gare_agencegc_libelle&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle",
    success: function(retour) {
      $.ajax({
        type: "GET",
        url: "https://ressources.data.sncf.com//api/records/1.0/search/?dataset=liste-des-chantiers&q=&rows=4147&facet=code_ligne",
        success: function(travaux) {
            var travauxGare;
             $.ajax({    //create an ajax request to display.php
            type: "POST",
            async: false,
            url: "../php/vueGare.php",   //expect html to be returned                
            success: function(response){
                travauxGare=response.split(",");
            }
       });
        //   var zone = retour.records[0].fields.gare_agencegc_libelle;
        //   console.log(zone);
          markersCluster = new L.MarkerClusterGroup({ disableClusteringAtZoom: 12, showCoverageOnHover: false});
          var text = "</br>La gare est en travaux";
          var estTravaux = false;
          
          for (let i = 0; i < retour.records.length; ++i) {
            //  console.log("on compare " + zone + " avec " + retour.records[i].gare_agencegc_libelle);
            // if (zone != retour.records[i].fields.gare_agencegc_libelle) {
              
            //   //markersCluster.addLayer(layer);
            //   map.addLayer(markersCluster);
            //   markersCluster.on("click", function (e) {
            //           if (e.layer instanceof L.Marker) {
            //             showSidebarWidthText(e);
            //           }
            //         });
            //   zone = retour.records[i].fields.gare_agencegc_libelle;
            //   markersCluster = new L.MarkerClusterGroup({ disableClusteringAtZoom: 12, showCoverageOnHover: false, name: zone});
              
            //}
            
            if (retour.records[i].fields.wgs_84 != null) {
                nomGare.push(retour.records[i].fields.alias_libelle_noncontraint);
              for (let j = 0; j < travaux.records.length; ++j) {
                if (travaux.records[j].fields.gare == retour.records[i].fields.alias_libelle_noncontraint) {
                  if (travauxGare.includes(travaux.records[j].fields.gare)) {
                      var marker = new L.marker([retour.records[i].fields.wgs_84[0], retour.records[i].fields.wgs_84[1]], {icon: orangeMarker,title: retour.records[i].fields.alias_libelle_noncontraint, travaux: true})
                      markersCluster.addLayer(marker);
                      estTravaux = true;
                  }else {
                          var marker = new L.marker([retour.records[i].fields.wgs_84[0], retour.records[i].fields.wgs_84[1]], {icon: redMarker,title: retour.records[i].fields.alias_libelle_noncontraint, travaux: true})
                          markersCluster.addLayer(marker);
                          estTravaux = true;
                  }
                  break;
                }
              }
              if (estTravaux == false) {
                var marker = new L.marker([retour.records[i].fields.wgs_84[0], retour.records[i].fields.wgs_84[1]], {icon: greenMarker, title: retour.records[i].fields.alias_libelle_noncontraint, travaux: false})
                markersCluster.addLayer(marker);
              }
              estTravaux = false;
            }
          }
          //markersCluster.addLayer(layer);
          map.addLayer(markersCluster);
          markersCluster.on("click", function (e) {
              if (e.layer instanceof L.Marker) {
                showSidebarWidthText(e.sourceTarget);
              }
            });
          L.Control.Search = L.Control.extend({
            options: {
              position: "topleft",
            },
            onAdd: function() {
              const container = L.DomUtil.create("div", "autocomplete-container");

              L.DomEvent.disableClickPropagation(container);

              container.insertAdjacentHTML(
                "beforeend",
                `<div class="auto-search-wrapper loupe">
                <input name="ville" id="ville" type="text" list="list-gare" placeholder="Entrer une gare" />
              </div>`
              );
              var list = "";
              for (var i = 0; i < nomGare.length; i++) {
                list += `<option>` + nomGare[i] + `</option>`;
              }
              container.insertAdjacentHTML(
                "beforeend",
                `<datalist id="list-gare">` +
                list +
                `</datalist>`
              );

              return container;
            },
          });

          recherche = new L.Control.Search().addTo(map);
          $("#ville")[0].addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
              //afficherSurCarte();
              var marker = getMarker($("#ville").val());
              // console.log(marker);
              showSidebarWidthText(marker);
            }
            event.stopPropagation();
          });
        }
      });

    }
  });



  //$("#ville").change(autocomplete($("#ville"),nomGare));

  // $("#ville").addEventListener("keydown", function(event) {
  //   if (event.key === "Enter") {
  //     afficherSurCarte();
  //   }
  //   event.stopPropagation();
  // });
  document.addEventListener("keydown", function (event) {
  // close sidebar when press esc
  if (event.key === "Escape") {
    closeSidebar();
  }
});

// close sidebar when click on close button
buttonClose.addEventListener("click", () => {
  // close sidebar when click on close button
  closeSidebar();
})

}


function showSidebarWidthText(id) {
    // console.log(id);
    $('#ville').hide();
    $(".leaflet-control-zoom").hide();
    document.body.classList.add("active-sidebar");
    addContentToSidebar(id);

}

function getMarker(ville) {
    var marker;
    markersCluster._featureGroup.eachLayer(function(x) {
        //console.log(x.getAllChildMarkers());
        x.getAllChildMarkers().forEach(i => {
            //console.log("on compare " + ville + " et " + i.options.title);
            if (i.options.title == ville) {
                marker = i;
                // console.log(marker);
                return marker;
            }
        });
        
    });
    return marker;
}

function afficherSurCarte() {


  ville = $("#ville").val();
  // console.log(ville);


  $.ajax({
    type: "GET",
    url: "https://ressources.data.sncf.com//api/records/1.0/search/?dataset=referentiel-gares-voyageurs&rows=3210&q=&sort=alias_libelle_noncontraint&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle",
    data: {
      q: $("#ville").val()
    },
    success: function(retour) {
      let coordonnees = [retour.records[0].geometry.coordinates[1], retour.records[0].geometry.coordinates[0]];
      map.flyTo(coordonnees, 13);

    }
  });
}

function closeSidebar() {
  // remove class active-sidebar
  document.body.classList.remove("active-sidebar");

  // bounds map to default
  boundsMap();
  $('#ville').show();
  $(".leaflet-control-zoom").show();
  map._handlers.forEach(function(handler) {
    handler.enable();

});
}

function addContentToSidebar(marker) {
   var reponse;
   // console.log(marker);
  var travaux = marker.options.travaux;
  //console.log(travaux);
  var title = marker.options.title;
  var coords = [marker._latlng.lat,marker._latlng.lng];
  if (travaux) {
      travaux = "Cette gare est en travaux"; 
      $.ajax({    //create an ajax request to display.php
        type: "POST",
        async: false,
        url: "../php/travaux.php",
        data: {'gare': title },
        dataType: "html",   //expect html to be returned                
        success: function(response){
            reponse = response;
            //$(".info-travaux").html(response);
            //$("#responsecontainer").html(response); 
            //alert(response);
        }
   });
  }
  else {
      travaux = "Cette gare n'est actuellement pas en travaux";
      
  }
  
  
  // create sidebar content
  const sidebarTemplate = `
    <article class="sidebar-content">
      <h1>${title}</h1>
      <div class="marker-id"></div>
      <div class="info-content">
        <div class="info-description">${travaux}</div>
        <div class="info-travaux"></div>
      </div>
      
    </article>
  `;

  const sidebar = document.querySelector(".sidebar");
  const sidebarContent = document.querySelector(".sidebar-content");

  // always remove content before adding new one
  sidebarContent?.remove();

  // add content to sidebar
  sidebar.insertAdjacentHTML("beforeend", sidebarTemplate);
  $(".info-travaux").html(reponse);
  
  $("#ouvrier").on("click", function() {
      attribuerOuv($("#choix"),title, marker,reponse);
  });
  

  // set bounds depending on marker coords
  boundsMap(coords);
}

function attribuerOuv(choix, gare,marker) {
    console.log(choix);
    console.log(gare);
    $.ajax({    //create an ajax request to display.php
        type: "POST",
        url: "../php/ouvrier.php",
        data: { 'ouvrier': choix.val(), 'gare': gare },
        success: function(response){
            console.log(response);
        }
    });
    $.ajax({    //create an ajax request to display.php
        type: "POST",
        url: "../php/vueGare.php",
        dataType: "html",   //expect html to be returned                
        success: function(response){
            console.log(response);
            if (response.split(",").includes(marker.options.title)) marker.setIcon(orangeMarker);
            else marker.setIcon(redMarker);
        }
   });
    
    closeSidebar();
}

function boundsMap(coords) {
  const sidebar = document.querySelector(".sidebar").offsetWidth;

  const marker = L.marker(coords);
  const group = L.featureGroup([marker]);

  // bounds depending on whether we have a marker or not
  const bounds = coords ? group.getBounds() : markersCluster.getBounds();

  // set bounds of map depending on sidebar
  // width and feature group bounds
  // zoom the map to the polyline
  
  map.fitBounds(bounds, {
    paddingTopLeft: [coords ? sidebar : 0, 10],
  });
  map._handlers.forEach(function(handler) {
    handler.disable();

});
}