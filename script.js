$(init);

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

let map;
var Layer;

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

  // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);

  // --------------------------------------------------------------

  $.ajax({
    type: "GET",
    url: "https://france-geojson.gregoiredavid.fr/repo/regions.geojson",
    success: function(retour) {
      retour.features.forEach(function(state) {
        layer = L.geoJSON(state);
        myLayer = L.geoJSON().addTo(map);
        myLayer.addData(state);
      });
    }
  });

  $.ajax({
    type: "GET",
    url: "https://ressources.data.sncf.com//api/records/1.0/search/?dataset=referentiel-gares-voyageurs&q=&rows=3213&sort=gare_regionsncf_libelle&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle",
    success: function(retour) {
      $.ajax({
        type: "GET",
        url: "https://ressources.data.sncf.com//api/records/1.0/search/?dataset=liste-des-chantiers&q=&rows=4147&facet=code_ligne",
        success: function(travaux) {
          var zone = retour.records[0].fields.gare_regionsncf_libelle;
          var markersCluster = new L.MarkerClusterGroup({ disableClusteringAtZoom: 12, showCoverageOnHover: false });
          var text = "</br>La gare est en travaux";
          var estTravaux = false;
          for (let i = 0; i < retour.records.length; ++i) {
            if (zone != retour.records[i].fields.gare_regionsncf_libelle) {
              console.log(zone);
              markersCluster.addLayer(layer);
              map.addLayer(markersCluster);
              markersCluster = new L.MarkerClusterGroup({ disableClusteringAtZoom: 12, showCoverageOnHover: false });
              zone = retour.records[i].fields.gare_regionsncf_libelle;
            }
            nomGare.push(retour.records[i].fields.gare_alias_libelle_noncontraint);
            if (retour.records[i].fields.wgs_84 != null) {
              for (let j = 0; j < travaux.records.length; ++j) {
                if (travaux.records[j].fields.gare == retour.records[i].fields.gare_alias_libelle_noncontraint) {
                  var marker = new L.marker([retour.records[i].fields.wgs_84[0], retour.records[i].fields.wgs_84[1]])
                    .bindPopup(retour.records[i].fields.gare_alias_libelle_noncontraint + text);
                  markersCluster.addLayer(marker);
                  estTravaux = true;
                  break;
                }
              }
              if (estTravaux == false) {
                var marker = new L.marker([retour.records[i].fields.wgs_84[0], retour.records[i].fields.wgs_84[1]])
                  .bindPopup(retour.records[i].fields.gare_alias_libelle_noncontraint);
                Layer = markersCluster.addLayer(marker);
              }
              estTravaux = false;
            }
          }
          markersCluster.addLayer(layer);
          map.addLayer(markersCluster);
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
                <input name="ville" id="ville" type="text" list="list-gare" placeholder="Entrer une ville" />
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

          new L.Control.Search().addTo(map);
        }
      });

    }
  });



  //$("#ville").change(autocomplete($("#ville"),nomGare));

  $('#ville').keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == 13) {
      afficherSurCarte();
    }
    event.stopPropagation();
  });

  $("#valider").on("click", afficherSurCarte);

}




function afficherSurCarte() {


  ville = $("#ville").val();
  console.log(ville);


  $.ajax({
    type: "GET",
    url: "https://ressources.data.sncf.com//api/records/1.0/search/?dataset=referentiel-gares-voyageurs&rows=3210&q=&sort=gare_alias_libelle_noncontraint&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle",
    data: {
      q: $("#ville").val()
    },
    success: function(retour) {
      console.log(retour);
      let coordonnees = [retour.records[0].geometry.coordinates[1], retour.records[0].geometry.coordinates[0]];
      map.flyTo(coordonnees, 13);
      map.openPopup(coordonnees);


    }
  });
}

