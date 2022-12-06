$(init);

var villes = [
  {
    nom: "Paris",
    resume: "Capitale de France",
    population: 200000,
    coordonnees: [48.855845, 2.330496]
  },
  {
    nom: "Madrid",
    resume: "Capitale d'Espagne",
    population: 200000,
    coordonnees: [40.447015, -3.691561]
  },
  {
    nom: "Alger",
    resume: "Capitale d'Algérie",
    population: 200000,
    coordonnees: [36.737836, 3.115976]
  },
  {
    nom: "Berlin",
    resume: "Capitale d'Allemagne",
    population: 200000,
    coordonnees: [52.580009, 13.372520]
  },
  {
    nom: "Tokyo",
    resume: "Capitale du Japon",
    population: 200000,
    coordonnees: [35.727334, 139.483583]
  }
]

function init() {
  
  $("#valider").on("click", afficherSurCarte);
  map = L.map('map').setView([48.84169080236788, 2.2686434551720724], 1);
  var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
  minZoom: 5,
	attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
  // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);

  for (var i = 0; i < villes.length; i++) {
    $('<option>').html(villes[i].nom).val(villes[i].nom).appendTo('select');
  }

  $("select").change(afficherSurCarte);
  $.ajax({
    type: "GET",
    url: "https://ressources.data.sncf.com//api/records/1.0/search/?dataset=referentiel-gares-voyageurs&q=&rows=3210&q=&sort=gare_alias_libelle_noncontraint&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle",
    success: function(retour) {
      $.ajax({
    type: "GET",
    url: "https://ressources.data.sncf.com//api/records/1.0/search/?dataset=liste-des-chantiers&q=&rows=4147&facet=code_ligne",
    success: function(travaux) {
      var markersCluster = new L.MarkerClusterGroup({ disableClusteringAtZoom: 12 });
      var text = "</br>La gare est en travaux";
      var estTravaux = false;
      for (let i = 0; i < retour.records.length; ++i) {
        if(retour.records[i].fields.wgs_84 != null){
          for (let j = 0; j < travaux.records.length; ++j) {
            if (travaux.records[j].fields.gare == retour.records[i].fields.gare_alias_libelle_noncontraint) {
              var marker = new L.marker([retour.records[i].fields.wgs_84[0],retour.records[i].fields.wgs_84[1]])
              .bindPopup(retour.records[i].fields.gare_alias_libelle_noncontraint + text);
              markersCluster.addLayer(marker);
              estTravaux=true;
              break;
            }
          }
          if (estTravaux == false) {
            var marker = new L.marker([retour.records[i].fields.wgs_84[0],retour.records[i].fields.wgs_84[1]])
              .bindPopup(retour.records[i].fields.gare_alias_libelle_noncontraint);
              markersCluster.addLayer(marker);
          }
          estTravaux = false;
        }
      }
      map.addLayer(markersCluster);

    }
  });
    }
  });
}


function afficherSurCarte() {
  

  ville = $("#cp").val();
  console.log(ville);


  $.ajax({
    type: "GET",
    url: "https://nominatim.openstreetmap.org/search.php",
    data: {
      city: ville,
      format: "jsonv2",
      polygon_geojson: 1
    },
    success: function(retour) {
      //bounding[retour[0].geojson.coordinates[0].length()];
      console.log(retour);
      let coordonnees = [retour[0].lat, retour[0].lon];
      map.flyTo(coordonnees, 12);
      // L.marker(coordonnees).addTo(map)  
      //   .bindPopup(retour[0].display_name + "<br/> Coordonnees : " + retour[0].lat + " " + retour[0].lon)
      //   .openPopup();
      // retour[0].boundingbox.forEach(element => bounding.append(element));
      // console.log(retour[0].geojson.coordinates[0])
      // L.geoJSON(retour[0].geojson.coordinates[0]).bindPopup('I am a polygon.').addTo(map);
    }
  });
}

