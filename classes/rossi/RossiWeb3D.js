/* Oggetto html DIV che conterrà il DOM document rilasciato dal THREE.Renderer */
var container;

/* Oggetti primari utilizzati per comporre, visualizzare e interagire con la scena 3D */
var camera, controls, renderer, scene;

/* Luci */
var ambient, keyLight, fillLight, backLight;

/* Spatial data per gli oggetti della scena */
riduttorePositionX = 0;
riduttorePositionY = 0;
riduttorePositionZ = 0;
riduttoreRotationX = 0;
riduttoreRotationY = 0;
riduttoreRotationZ = 0;

sensoAlbLentoOrientation = 'v';
sensoAlbLentoDirection = 'right';
sensoAlbLentoPositionX = 0;
sensoAlbLentoPositionY = 0;
sensoAlbLentoPositionZ = 0;
sensoAlbLentoRotationX = 0;
sensoAlbLentoRotationY = 0;
sensoAlbLentoRotationZ = 0;

sensoMotoreOrientation = 'v';
sensoMotoreDirection = 'right';
sensoMotorePositionX = 0;
sensoMotorePositionY = 0;
sensoMotorePositionZ = 0;
sensoMotoreRotationX = 0;
sensoMotoreRotationY = 0;
sensoMotoreRotationZ = 0;

/* Oggetto utilizzato per referenziare in maniera globale il modello 3D caricato */
var modelPath = "";
var riduttore = new THREE.Group();

/* Variabile utilizzata per referenziare in maniera globale l'oggetto 3D del piano di riferimento */
var plane = new THREE.Mesh();
/* Variabile utilizzata per referenziare in maniera globale il materiale del piano di riferimento */
var matPlane = new THREE.MeshLambertMaterial();

/* Variabili utilizzate per referenziare in maniera globale gli oggetti 3D dei sensi di rotazione */
var cylMot, cylRid;
var cylMotRotValue = 0.05;
var cylRidRotValue = 0.01;

/* Setting proprietà del canvas di rendering */
var sceneCanvasWidth = 600;
var sceneCanvasHeight = 600;
var canvasContainer = '3dtd';

/* Setting proprietà camera */
var cameraFOV = 30;
var cameraAspectRatio = sceneCanvasWidth / sceneCanvasHeight;
var cameraNearestPoint = 1;
var cameraFarestPoint = 3000;
var cameraPositionX = -200;
var cameraPositionY = -300;
var cameraPositionZ = 100;
var cameraLookAtElev = 0;

/* Setting luci */
var ambientLightColor = 0xdfebff;
var ambientLightIntensity = 0.2;

var keyLightColor = 0xdfebff;
var keyLightIntensity = 0.8;
var keyLightPositionX = -200;
var keyLightPositionY = -100;
var keyLightPositionZ = 100;

var fillLightColor = 0xdfebff;
var fillLightIntensity = 0.5;
var fillLightPositionX = 200;
var fillLightPositionY = -200;
var fillLightPositionZ = 200;

var backLightColor = 0xdfebff;
var backLightIntensity = 0.4;
var backLightPositionX = 0;
var backLightPositionY = 400;
var backLightPositionZ = 0;

/* Setting proprietà piano di riferimento */
var planeColor = 0xffffff;
var planeWidth = 200;
var planeHeight = 200;
var planeDepth = 10;
var planeRotationX = Math.PI / 2;
var planeRotationY = 0;
var planeRotationZ = 0;
var planePositionX = 0;
var planePositionY = 0;
var planePositionZ = -35;

function init() {
	var returnValue = true;
	var spaceDataFilename = '';
	try
	{
		if (getParameterByName("catalogue") == null || getParameterByName("catalogue") == '') { console.error('init():ERROR:Missing catalogue parameter.'); returnValue = false; }
		if (getParameterByName("machine") == null || getParameterByName("machine") == '') { console.error('init():ERROR:Missing machine parameter.'); returnValue = false; }
		if (getParameterByName("trainOfGears") == null || getParameterByName("trainOfGears") == '') { console.error('init():ERROR:Missing trainOfGears parameter.'); returnValue = false; }
		if (getParameterByName("size") == null || getParameterByName("size") == '') { console.error('init():ERROR:Missing size parameter.'); returnValue = false; }
		if (getParameterByName("design") == null || getParameterByName("design") == '') { console.error('init():ERROR:Missing design parameter.'); returnValue = false; }
		if (getParameterByName("mountingPosition") == null || getParameterByName("mountingPosition") == '') { console.error('init():ERROR:Missing mountingPosition parameter.'); returnValue = false; }
		if (returnValue) {
			spaceDataFilename = './space-data/'
							+ getParameterByName("catalogue")
							+ getParameterByName("machine")
							+ getParameterByName("trainOfGears")
							+ getParameterByName("size")
							+ getParameterByName("design")
							+ getParameterByName("mountingPosition")
							+ '.xml';
			if (window.XMLHttpRequest)
			{// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp=new XMLHttpRequest();
			}
			else
			{// code for IE6, IE5
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onload = function() {
				var xmlDoc = new DOMParser().parseFromString(xmlhttp.responseText,'text/xml');
				var x=xmlDoc.getElementsByTagName("sd");

				modelPath = x[0].getElementsByTagName("modelPath")[0].childNodes[0].nodeValue;
				
				cameraFOV = x[0].getElementsByTagName("camera")[0].getElementsByTagName("fov")[0].childNodes[0].nodeValue;
				cameraPositionX = x[0].getElementsByTagName("camera")[0].getElementsByTagName("posX")[0].childNodes[0].nodeValue;
				cameraPositionY = x[0].getElementsByTagName("camera")[0].getElementsByTagName("posY")[0].childNodes[0].nodeValue;
				cameraPositionZ = x[0].getElementsByTagName("camera")[0].getElementsByTagName("posZ")[0].childNodes[0].nodeValue;
				cameraLookAtElev = x[0].getElementsByTagName("camera")[0].getElementsByTagName("lookAtElev")[0].childNodes[0].nodeValue;

				riduttorePositionX = x[0].getElementsByTagName("riduttore")[0].getElementsByTagName("posX")[0].childNodes[0].nodeValue;
				riduttorePositionY = x[0].getElementsByTagName("riduttore")[0].getElementsByTagName("posY")[0].childNodes[0].nodeValue;
				riduttorePositionZ = x[0].getElementsByTagName("riduttore")[0].getElementsByTagName("posZ")[0].childNodes[0].nodeValue;
				riduttoreRotationX = x[0].getElementsByTagName("riduttore")[0].getElementsByTagName("rotX")[0].childNodes[0].nodeValue;
				riduttoreRotationY = x[0].getElementsByTagName("riduttore")[0].getElementsByTagName("rotY")[0].childNodes[0].nodeValue;
				riduttoreRotationZ = x[0].getElementsByTagName("riduttore")[0].getElementsByTagName("rotZ")[0].childNodes[0].nodeValue;

				sensoMotoreOrientation = x[0].getElementsByTagName("sensoMotore")[0].getElementsByTagName("orientation")[0].childNodes[0].nodeValue;
				sensoMotoreDirection = x[0].getElementsByTagName("sensoMotore")[0].getElementsByTagName("direction")[0].childNodes[0].nodeValue;
				sensoMotorePositionX = x[0].getElementsByTagName("sensoMotore")[0].getElementsByTagName("posX")[0].childNodes[0].nodeValue;
				sensoMotorePositionY = x[0].getElementsByTagName("sensoMotore")[0].getElementsByTagName("posY")[0].childNodes[0].nodeValue;
				sensoMotorePositionZ = x[0].getElementsByTagName("sensoMotore")[0].getElementsByTagName("posZ")[0].childNodes[0].nodeValue;
				sensoMotoreRotationX = x[0].getElementsByTagName("sensoMotore")[0].getElementsByTagName("rotX")[0].childNodes[0].nodeValue;
				sensoMotoreRotationY = x[0].getElementsByTagName("sensoMotore")[0].getElementsByTagName("rotY")[0].childNodes[0].nodeValue;
				sensoMotoreRotationZ = x[0].getElementsByTagName("sensoMotore")[0].getElementsByTagName("rotZ")[0].childNodes[0].nodeValue;

				sensoAlbLentoOrientation = x[0].getElementsByTagName("sensoAlbLento")[0].getElementsByTagName("orientation")[0].childNodes[0].nodeValue;
				sensoAlbLentoDirection = x[0].getElementsByTagName("sensoAlbLento")[0].getElementsByTagName("direction")[0].childNodes[0].nodeValue;
				sensoAlbLentoPositionX = x[0].getElementsByTagName("sensoAlbLento")[0].getElementsByTagName("posX")[0].childNodes[0].nodeValue;
				sensoAlbLentoPositionY = x[0].getElementsByTagName("sensoAlbLento")[0].getElementsByTagName("posY")[0].childNodes[0].nodeValue;
				sensoAlbLentoPositionZ = x[0].getElementsByTagName("sensoAlbLento")[0].getElementsByTagName("posZ")[0].childNodes[0].nodeValue;
				sensoAlbLentoRotationX = x[0].getElementsByTagName("sensoAlbLento")[0].getElementsByTagName("rotX")[0].childNodes[0].nodeValue;
				sensoAlbLentoRotationY = x[0].getElementsByTagName("sensoAlbLento")[0].getElementsByTagName("rotY")[0].childNodes[0].nodeValue;
				sensoAlbLentoRotationZ = x[0].getElementsByTagName("sensoAlbLento")[0].getElementsByTagName("rotZ")[0].childNodes[0].nodeValue;

				planePositionX = x[0].getElementsByTagName("plane")[0].getElementsByTagName("posX")[0].childNodes[0].nodeValue;
				planePositionY = x[0].getElementsByTagName("plane")[0].getElementsByTagName("posY")[0].childNodes[0].nodeValue;
				planePositionZ = x[0].getElementsByTagName("plane")[0].getElementsByTagName("posZ")[0].childNodes[0].nodeValue;
				planeRotationX = x[0].getElementsByTagName("plane")[0].getElementsByTagName("rotX")[0].childNodes[0].nodeValue;
				planeRotationY = x[0].getElementsByTagName("plane")[0].getElementsByTagName("rotY")[0].childNodes[0].nodeValue;
				planeRotationZ = x[0].getElementsByTagName("plane")[0].getElementsByTagName("rotZ")[0].childNodes[0].nodeValue;
				
			}
			xmlhttp.open("GET",spaceDataFilename,false);
			xmlhttp.send();
		}
		return returnValue;
	}
	catch (ex)
	{
		console.error('init():ERROR:' + ex.message);
		return false;
	}
}

function initRossi3DScene() {
	container = document.createElement('div');
	document.getElementById(canvasContainer).appendChild(container);

	/* Inizializzazione camera */
	camera = new THREE.PerspectiveCamera(cameraFOV, cameraAspectRatio, cameraNearestPoint, cameraFarestPoint);
	camera.position.x = cameraPositionX;
	camera.position.y = cameraPositionY;
	camera.position.z = cameraPositionZ;
	camera.up.set( 0, 0, 1 );

	/* Inizializzazione scena */
	scene = new THREE.Scene();
	
	/* Inizializzazione luce ambiente */
	ambient = new THREE.AmbientLight(ambientLightColor, ambientLightIntensity);
	scene.add(ambient);

	/* Inizializzazione luce principale */
	keyLight = new THREE.SpotLight(keyLightColor, keyLightIntensity);
	keyLight.position.set(keyLightPositionX, keyLightPositionY, keyLightPositionZ);
	keyLight.castShadow = true;
	keyLight.shadowMapWidth = 1024;
	keyLight.shadowMapHeight = 1024;
	keyLight.shadow.bias = 0.00001;
	scene.add(keyLight);
	
	/* Inizializzazione luce fill */
	fillLight = new THREE.SpotLight(fillLightColor, fillLightIntensity);
	fillLight.position.set(fillLightPositionX, fillLightPositionY, fillLightPositionZ);
	fillLight.castShadow = true;
	fillLight.shadowMapWidth = 1024;
	fillLight.shadowMapHeight = 1024;
	fillLight.shadow.bias = 0.00001;
	scene.add(fillLight);
	
	/* Inizializzazione luce posteriore */
	backLight = new THREE.SpotLight(backLightColor, backLightIntensity);
	backLight.position.set(backLightPositionX, backLightPositionY, backLightPositionZ);
	backLight.castShadow = true;
	backLight.shadowMapWidth = 1024;
	backLight.shadowMapHeight = 1024;
	backLight.shadow.bias = 0.00001;
	scene.add(backLight);
	
	/* Creazione oggetto 3D piano di riferimento + materiale */
	// Create an array of materials to be used in a cube, one for each side
	var planeMaterialArray = [];
	// order to add materials: x+,x-,y+,y-,z+,z-
	planeMaterialArray.push( new THREE.MeshPhongMaterial( { color: planeColor } ) );
	planeMaterialArray.push( new THREE.MeshPhongMaterial( { color: planeColor } ) );
	planeMaterialArray.push( new THREE.MeshPhongMaterial( { color: planeColor } ) );
	planeMaterialArray.push( new THREE.MeshPhongMaterial( { color: planeColor } ) );
	planeMaterialArray.push( new THREE.MeshPhongMaterial( { color: planeColor, map: THREE.ImageUtils.loadTexture('textures/rossi-logo.jpg'), emissive: 0xffffff, emissiveIntensity: 0.1 } ) );
	planeMaterialArray.push( new THREE.MeshPhongMaterial( { color: planeColor } ) );
	var planeMaterials = new THREE.MeshFaceMaterial( planeMaterialArray );
	var planeGeometry = new THREE.CubeGeometry( planeWidth, planeHeight, planeDepth, 1, 1, 1 );
	var plane = new THREE.Mesh( planeGeometry, planeMaterials );
	plane.receiveShadow = true;
	plane.position.x = planePositionX;
	plane.position.y = planePositionY;
	plane.position.z = planePositionZ;
	plane.rotation.x = planeRotationX;
	plane.rotation.y = planeRotationY;
	plane.rotation.z = planeRotationZ;
	/* Aggiunta del piano alla scena */
	scene.add(plane);
				
	/* Renderer */
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMapEnabled = true;
	renderer.setSize(sceneCanvasWidth, sceneCanvasHeight);
	container.appendChild(renderer.domElement);

	/* Controls */
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;
	controls.target.set( 0, 0, parseFloat(cameraLookAtElev) );
	controls.update();
	camera.updateProjectionMatrix();
}

function loadModel() {
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( modelPath, function ( collada ) {
		riduttore = collada.scene;
		riduttore.scale.x = riduttore.scale.y = riduttore.scale.z = 0.2
		riduttore.position.x = riduttorePositionX;
		riduttore.position.y = riduttorePositionY;
		riduttore.position.z = riduttorePositionZ;
		riduttore.rotation.x = riduttoreRotationX;
		riduttore.rotation.y = riduttoreRotationY;
		riduttore.rotation.z = riduttoreRotationZ;
		for(var i=0; i<riduttore.children.length; i++) {
			riduttore.children[i].children[0].castShadow = true;
		}
		scene.add(riduttore);
	});
	createRotationArrows();
}

function createRotationArrows() {
	/* senso rotazione motore */
	
	var cylMaterials = [];
	var textureMap = THREE.ImageUtils.loadTexture( './textures/arrow.png' );
	cylMaterials.push(new THREE.MeshBasicMaterial( { map: textureMap, transparent: true, opacity: 1, color: 0xFF0000, side: THREE.DoubleSide }));
	cylMaterials.push(new THREE.MeshBasicMaterial( { transparent: true, opacity: 0 }));
	cylMaterials.push(new THREE.MeshBasicMaterial( { transparent: true, opacity: 0 }));
	var cylFaceMat = new THREE.MeshFaceMaterial(cylMaterials);

	var geoMot = new THREE.CylinderGeometry( 10, 10, 10, 20, cylMaterials );
	cylMot = new THREE.Mesh( geoMot, cylFaceMat );

	cylMot.position.x = sensoMotorePositionX;
	cylMot.position.y = sensoMotorePositionY;
	cylMot.position.z = sensoMotorePositionZ;
	cylMot.rotation.x = sensoMotoreRotationX;
	cylMot.rotation.y = sensoMotoreRotationY;
	cylMot.rotation.z = sensoMotoreRotationZ;	

	if (sensoMotoreDirection == 'right') {
		cylMot.scale.x = -1;
		cylMotRotValue = -0.05;
	} else {
		cylMot.scale.x = 1;
		cylMotRotValue = 0.05;
	}
	
	cylMot.castShadow = true;
	cylMot.receiveShadow = true;

	scene.add( cylMot );

	/* senso rotazione riduttore */
	
	var geoRid = new THREE.CylinderGeometry( 10, 10, 10, 20, cylMaterials );
	cylRid = new THREE.Mesh( geoRid, cylFaceMat );

	cylRid.position.x = sensoAlbLentoPositionX;
	cylRid.position.y = sensoAlbLentoPositionY;
	cylRid.position.z = sensoAlbLentoPositionZ;
	cylRid.rotation.x = sensoAlbLentoRotationX;
	cylRid.rotation.y = sensoAlbLentoRotationY;
	cylRid.rotation.z = sensoAlbLentoRotationZ;
	cylRid.castShadow = true;
	cylRid.receiveShadow = true;

	if (sensoAlbLentoDirection == 'right') {
		cylRid.scale.x = -1;
		cylRidRotValue = -0.01;
	} else {
		cylRid.scale.x = 1;
		cylRidRotValue = 0.01;
	}

	scene.add( cylRid );

	var rotateCyls = function() {
		requestAnimationFrame(rotateCyls);
		if (sensoMotoreOrientation == 'v') {
			cylMot.rotation.x = parseFloat(cylMot.rotation.x) - parseFloat(cylMotRotValue);
		} else {
			cylMot.rotation.y = parseFloat(cylMot.rotation.y) + parseFloat(cylMotRotValue);
		}
		cylRid.rotation.y = parseFloat(cylRid.rotation.y) + parseFloat(cylRidRotValue);
	};
	rotateCyls();
}

function switchWireframe(wireframeMode /* Y, N */){
	var transparency = false;
	var materialOpacity = 0;
	var activateEdges = false;
	var edgeLineObject = false;
	
	switch (wireframeMode) {
		case 'Y':
			transparency = true;
			materialOpacity = 0.5;
			activateEdges = true;
			break;
		case 'N':
			transparency = false;
			materialOpacity = 1;
			activateEdges = false;
			break;
	}
	
	for (var ob = 0; ob < riduttore.children.length; ob++) {
		if (riduttore.children[ob] instanceof THREE.Object3D) {
			for (var me = 0; me < riduttore.children[ob].children.length; me++) {
				if (typeof riduttore.children[ob].children[me].material.materials != 'undefined') {
					for (var ma = 0; ma < riduttore.children[ob].children[me].material.materials.length; ma++) {
						riduttore.children[ob].children[me].material.materials[ma].transparent = transparency;
						riduttore.children[ob].children[me].material.materials[ma].opacity = materialOpacity;
					}
				} else {
					riduttore.children[ob].children[me].material.transparent = transparency;
					riduttore.children[ob].children[me].material.opacity = materialOpacity;
				}
				if (activateEdges) {
					edgeLineObject = false;
					if (riduttore.children[ob].children[me].children.length) {
						for (var ls = 0; ls < riduttore.children[ob].children[me].children.length; ls++) {
							if (riduttore.children[ob].children[me].children[ls] instanceof THREE.LineSegments) {
								riduttore.children[ob].children[me].children[ls].visible = true;
								edgeLineObject = true;
							}
						}
					}
					if (!edgeLineObject) {
						var eGeometry = new THREE.EdgesGeometry( riduttore.children[ob].children[me].geometry );
						var eMaterial = new THREE.LineBasicMaterial( { color: 0xcccccc, linewidth: 2 } );
						var edges = new THREE.LineSegments( eGeometry, eMaterial );
						riduttore.children[ob].children[me].add( edges );
					}
				} else {
					for (var ls = 0; ls < riduttore.children[ob].children[me].children.length; ls++) {
						riduttore.children[ob].children[me].children[ls].visible = false;
					}
				}
			}
		}
	}
	
	riduttore.updateMatrix();
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	render();
}

function render() {
	renderer.render(scene, camera);
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function UrlExists(url)
{
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	http.send();
	return http.status!=404;
}