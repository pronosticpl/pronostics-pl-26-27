const storageKey = "novaprono-v2";
const sessionUserStorageKey = "novaprono-current-user";
const apiKeyStorageKey = "novaprono-football-data-key";
const testModeStorageKey = "novaprono-test-mode";
const accessStorageKey = "novaprono-access-ok";
const sitePassword = "YNWA";
const competitionCode = "PL";
const seasonYear = 2026;
const adminName = "Norbert";
const autoSyncEveryMs = 2 * 60 * 1000;
const seasonBonusCategories = [
  { id: "champion", label: "Champion", points: 10 },
  { id: "bestAttack", label: "Meilleure attaque", points: 5 },
  { id: "bestDefense", label: "Meilleure défense", points: 5 },
  { id: "topScorer", label: "Meilleur buteur", points: 3 },
  { id: "bestAssister", label: "Meilleur passeur", points: 3 },
  { id: "goldenGloves", label: "Meilleur gardien", points: 3 },
  { id: "bestPlayer", label: "Meilleur joueur", points: 3 },
];
const individualBonusIds = new Set(["topScorer", "bestAssister", "goldenGloves", "bestPlayer"]);
const builtInPlayersRaw = {
  "Arsenal": [
    "Alexei Rojas",
    "Andre Harriman-Annous",
    "Ben White",
    "Brando Bailey-Joseph",
    "Bukayo Saka",
    "Ceadach O’Neill",
    "Christian Nørgaard",
    "Cristhian Mosquera",
    "David Raya",
    "Declan Rice",
    "Eberechi Eze",
    "Ethan Nwaneri",
    "Fábio Vieira",
    "Gabriel Jesus",
    "Gabriel Magalhães",
    "Gabriel Martinelli",
    "Harrison Dudziak",
    "Ife Ibrahim",
    "Illan Meslier",
    "Ismeal Kabia",
    "Jack Porter",
    "Jaden Dixon",
    "Josh Nichols",
    "Jurriën Timber",
    "Kai Havertz",
    "Karl Hein",
    "Kepa Arrizabalaga",
    "Khari Ranson",
    "Leandro Trossard",
    "Marli Salmon",
    "Martin Ødegaard",
    "Martín Zubimendi",
    "Max Dowman",
    "Mikel Merino",
    "Myles Lewis-Skelly",
    "Noni Madueke",
    "Piero Hincapié",
    "Reiss Nelson",
    "Riccardo Calafiori",
    "Tommy Setford",
    "Viktor Gyökeres",
    "William Saliba"
  ],
  "Aston Villa": [
    "Aidan Borland",
    "Alysson Edward",
    "Amadou Onana",
    "Andrés García",
    "Boubacar Kamara",
    "Bradley Burrowes",
    "Brian Madjo",
    "Donyell Malen",
    "Emiliano Buendía",
    "Emiliano Martínez",
    "Enzo Barrenechea",
    "Evann Guessand",
    "Ezri Konsa",
    "George Hemmings",
    "Ian Maatsen",
    "James Wright",
    "Joe Gauci",
    "Johan Manzambi",
    "John McGinn",
    "Kosta Nedeljkovic",
    "Lamare Bogarde",
    "Leon Bailey",
    "Leon Routh",
    "Lewis Dobbin",
    "Lucas Digne",
    "Marco Bizot",
    "Matty Cash",
    "Modou Cissé",
    "Mohamed Koné",
    "Morgan Rogers",
    "Oliwier Zych",
    "Ollie Watkins",
    "Pau Torres",
    "Rhys Oakley",
    "Ronnie Hollingshead",
    "Ross Barkley",
    "Sam Proctor",
    "Samuel Iling-Junior",
    "Tammy Abraham",
    "TJ Carroll",
    "Tyrone Mings",
    "Victor Lindelöf"
  ],
  "Bournemouth": [
    "Adam Smith",
    "Adrien Truffert",
    "Alex Paulsen",
    "Alex Scott",
    "Alex Tóth",
    "Amine Adli",
    "Bafodé Diakité",
    "Ben Gannon-Doak",
    "Ben Winterburn",
    "Charlie Stevens",
    "Christos Mandas",
    "Daniel Jebbison",
    "David Brooks",
    "Djordje Petrovic",
    "Enes Ünal",
    "Evanilson",
    "Fraser Forster",
    "Hamed Traoré",
    "James Hill",
    "Julio Soler",
    "Julián Araujo",
    "Junior Kroupi",
    "Justin Kluivert",
    "Lewis Cook",
    "Luis Sinisterra",
    "Malcom DaCosta",
    "Marcus Tavernier",
    "Matai Akinmboni",
    "Owen Bevan",
    "Rayan",
    "Remy Rees-Dottin",
    "Romain Faivre",
    "Ryan Christie",
    "Tyler Adams",
    "Veljko Milosavljevic",
    "Will Dennis",
    "Álex Jiménez",
    "Álvaro Rodríguez"
  ],
  "Brentford": [
    "Aaron Hickey",
    "Antoni Milambo",
    "Benjamin Arthur",
    "Benjamin Fredrick",
    "Callum Wilson",
    "Caoimhín Kelleher",
    "Conor McManus",
    "Dango Ouattara",
    "Ellery Balcombe",
    "Ethan Brierley",
    "Ethan Pinnock",
    "Fábio Carvalho",
    "Gustavo Nunes",
    "Hákon Valdimarsson",
    "Igor Thiago",
    "Jaidon Anthony",
    "Jannik Schuster",
    "Jayden Meghoma",
    "Jordan Henderson",
    "Josh Dasilva",
    "Joshua Stephenson",
    "Julian Eyestone",
    "Kaye Furo",
    "Keane Lewis-Potter",
    "Kevin Schade",
    "Kim Ji-Soo",
    "Kristoffer Ajer",
    "Luka Bentt",
    "Mathias Jensen",
    "Matthew Cox",
    "Michael Kayode",
    "Mikkel Damsgaard",
    "Nathan Collins",
    "Ollie Shield",
    "Rico Henry",
    "Riley Owen",
    "Romelle Donovan",
    "Ryan Trevitt",
    "Sepp van den Berg",
    "Vitaly Janelt",
    "Yehor Yarmoliuk",
    "Yunus Konak"
  ],
  "Brighton and Hove Albion": [
    "Adam Webster",
    "Amario Cozier-Duberry",
    "Bart Verbruggen",
    "Brajan Gruda",
    "Carl Rushworth",
    "Carlos Baleba",
    "Charalampos Kostoulas",
    "Charlie Tasker",
    "Costinha",
    "Danny Welbeck",
    "Diego Coppola",
    "Diego Gómez",
    "Eiran Cashin",
    "Evan Ferguson",
    "Facundo Buonanotte",
    "Ferdi Kadioglu",
    "Freddie Simmonds",
    "George Munday",
    "Georginio Rutter",
    "Harry Howell",
    "Ibrahim Osman",
    "Igor Julio",
    "Jack Hinshelwood",
    "James Beadle",
    "James Milner",
    "Jason Steele",
    "Jeremy Sarmiento",
    "Joël Veltman",
    "Kaoru Mitoma",
    "Lewis Dunk",
    "Luka Vuskovic",
    "Malick Yalcouyé",
    "Mark O'Mahony",
    "Mats Wieffer",
    "Matt O'Riley",
    "Maxim De Cuyper",
    "Michael Svoboda",
    "Nehemiah Oriola",
    "Nils Ramming",
    "Olivier Boscagli",
    "Pascal Groß",
    "Pascal Struijk",
    "Rodrigo Rêgo",
    "Solly March",
    "Stefanos Tzimas",
    "Tom McGill",
    "Tom Watson",
    "Yankuba Minteh",
    "Yasin Ayari",
    "Yoon Do-Young",
    "Zadok Yohanna"
  ],
  "Chelsea": [
    "Aaron Anselmino",
    "Alejandro Garnacho",
    "Axel Disasi",
    "Benoît Badiashile",
    "Charlie Holland",
    "Cole Palmer",
    "David Datro Fofana",
    "Dário Essugo",
    "Emmanuel Emegha",
    "Enzo Fernández",
    "Estêvão",
    "Filip Jörgensen",
    "Gaga Slonina",
    "Geovany Quenda",
    "Ishé Samuels-Smith",
    "Jamie Gittens",
    "Jesse Derry",
    "Jorrel Hato",
    "Josh Acheampong",
    "João Pedro",
    "Landon Emenalo",
    "Levi Colwill",
    "Liam Delap",
    "Malo Gusto",
    "Mamadou Sarr",
    "Marc Cucurella",
    "Marc Guiu",
    "Marco Palestra",
    "Mathis Eboué",
    "Max Merrick",
    "Mike Penders",
    "Moisés Caicedo",
    "Mykhailo Mudryk",
    "Nicolas Jackson",
    "Ollie Harrison",
    "Pedro Neto",
    "Reece James",
    "Reggie Walsh",
    "Robert Sánchez",
    "Roméo Lavia",
    "Ryan Kavuma-McQueen",
    "Shumaira Mheuka",
    "Teddy Sharman-Lowe",
    "Tosin Adarabioyo",
    "Trevoh Chalobah",
    "Wesley Fofana"
  ],
  "Coventry City": [
    "Aidan Dausch",
    "Aurèle Amenda",
    "Ben Wilson",
    "Bobby Thomas",
    "Bradley Collins",
    "Brandon Thomas-Asante",
    "Callum Perry",
    "Ellis Simms",
    "Ephron Mason-Clark",
    "Frank Onyeka",
    "George Shepherd",
    "Haji Wright",
    "Harvey Broad",
    "Jack Rudoni",
    "Jahnoah Markelo",
    "Jake Bidwell",
    "Jamie Allen",
    "Jay Dasilva",
    "Joel Latibeaudiere",
    "Josh Eccles",
    "Kai Andrews",
    "Kaine Kesler-Hayden",
    "Liam Kitching",
    "Loum Tchaouna",
    "Luke Woolfenden",
    "Matt Grimes",
    "Miguel Ángel Brau",
    "Milan van Ewijk",
    "Norman Bassette",
    "Oliver Dovin",
    "Oscar Varney",
    "Raphael Borges Rodrigues",
    "Tatsuhiro Sakamoto",
    "Victor Torp"
  ],
  "Crystal Palace": [
    "Adam Wharton",
    "Ben Casey",
    "Borna Sosa",
    "Brennan Johnson",
    "Caleb Kporha",
    "Chadi Riad",
    "Charlie Walker-Smith",
    "Cheick Doucouré",
    "Chris Richards",
    "Christantus Uche",
    "Daichi Kamada",
    "Daniel Muñoz",
    "Danny Imray",
    "David Ozoh",
    "Dean Benamar",
    "Dean Henderson",
    "Eddie Nketiah",
    "George King",
    "Ismaïla Sarr",
    "Jackson Izquierdo",
    "Jaydee Canvot",
    "Jean-Philippe Mateta",
    "Jefferson Lerma",
    "Jesurun Rak-Sakyi",
    "Joe Whitworth",
    "Joél Drakes-Thomas",
    "Justin Devenny",
    "Jørgen Strand Larsen",
    "Kaden Rodney",
    "Matheus França",
    "Maxence Lacroix",
    "Mofe Jemide",
    "Nathaniel Clyne",
    "Owen Goodman",
    "Remi Matthews",
    "Rio Cardines",
    "Romain Esse",
    "Tayo Adaramola",
    "Tyrick Mitchell",
    "Walter Benítez",
    "Will Hughes",
    "Yéremy Pino",
    "Zach Marsh",
    "Óscar Mingueza"
  ],
  "Everton": [
    "Adam Aznou",
    "Beto",
    "Braiden Graham",
    "Callum Bates",
    "Charly Alcaraz",
    "Dwight McNeil",
    "Harrison Armstrong",
    "Hayden Hackney",
    "Idrissa Gueye",
    "Iliman Ndiaye",
    "Jake O'Brien",
    "James Garner",
    "James Tarkowski",
    "Jarrad Branthwaite",
    "Jordan Pickford",
    "Kiernan Dewsbury-Hall",
    "Malik Olayiwola",
    "Mark Travers",
    "Martin Sherif",
    "Merlin Röhl",
    "Michael Keane",
    "Nathan Patterson",
    "Reece Welch",
    "Séamus Coleman",
    "Thierno Barry",
    "Tim Iroegbunam",
    "Tom King",
    "Tyler Dibling",
    "Tyler Onyango",
    "Tyrique George",
    "Vitalii Mykolenko"
  ],
  "Fulham": [
    "Alex Iwobi",
    "Alfie McNally",
    "Antonee Robinson",
    "Benjamin Lecomte",
    "Bernd Leno",
    "Calvin Bassey",
    "Emile Smith Rowe",
    "Harrison Reed",
    "Issa Diop",
    "Joachim Andersen",
    "Jonah Kusi-Asare",
    "Jorge Cuenca",
    "Josh King",
    "Kenny Tete",
    "Kevin",
    "Luke Harris",
    "Oscar Bobb",
    "Raúl Jiménez",
    "Rodrigo Muniz",
    "Ryan Sessegnon",
    "Sam Amissah",
    "Samuel Chukwueze",
    "Sander Berge",
    "Sasa Lukic",
    "Seth Ridgeon",
    "Steven Benda",
    "Timothy Castagne",
    "Tom Cairney"
  ],
  "Hull City": [
    "Abdülkadir Ömür",
    "Abu Kamara",
    "Akin Famewo",
    "Amir Hadziahmetovic",
    "Archie Howard",
    "Calvin Okike",
    "Cathal McCarthy",
    "Charlie Hughes",
    "Cody Drameh",
    "Darko Gyabi",
    "David Akintola",
    "Dillon Phillips",
    "Eliot Matazo",
    "Enis Destan",
    "Harry Vaughan",
    "Harvey Cartwright",
    "Hugh Parker",
    "Ivor Pandur",
    "Jack Butland",
    "James Debayo",
    "James Furlong",
    "John Egan",
    "John Lundstram",
    "Kasey Palmer",
    "Kieran Dowell",
    "Kyle Joseph",
    "Lewie Coyle",
    "Lewis Koumas",
    "Liam Millar",
    "Mason Burstow",
    "Matt Crooks",
    "Matty Jacob",
    "Mohamed Belloumi",
    "Nathan Tinsdale",
    "Oliver McBurnie",
    "Paddy McNair",
    "Pharrell Brown",
    "Regan Slater",
    "Ryan Giles",
    "Semi Ajayi",
    "Stanley Ashbee",
    "Thimothée Lo-Tutala",
    "Yu Hirakawa"
  ],
  "Ipswich Town": [
    "Alex Palmer",
    "Ali Al Hamadi",
    "Anis Mehmeti",
    "Arijanet Muric",
    "Ashley Young",
    "Azor Matusiwa",
    "Ben Johnson",
    "Cameron Humphreys",
    "Chiedozie Ogbene",
    "Christian Walton",
    "Chuba Akpom",
    "Cieran Slicker",
    "Conor Chaplin",
    "Conor Townsend",
    "Cédric Kipré",
    "Dan Neil",
    "Dara O'Shea",
    "Darnell Furlong",
    "David Button",
    "Elkan Baggott",
    "Emersonn",
    "Finley Barbrook",
    "George Hirst",
    "Harry Clarke",
    "Iván Azón",
    "Jack Clarke",
    "Jack Taylor",
    "Jacob Greaves",
    "Jaden Philogene",
    "Jens Cajuste",
    "Kasey McAteer",
    "Leif Davis",
    "Leon Ayinde",
    "Marcelino Núñez",
    "Sam Szmodics",
    "Sindre Egeli",
    "Somto Boniface",
    "Wes Burns"
  ],
  "Leeds United": [
    "Alex Cairns",
    "Alfie Cresswell",
    "Anton Stach",
    "Ao Tanaka",
    "Brenden Aaronson",
    "Charlie Crew",
    "Daniel James",
    "Dominic Calvert-Lewin",
    "Ethan Ampadu",
    "Gabriel Gudmundsson",
    "Harry Wilson",
    "Ilia Gruev",
    "Isaac Schmidt",
    "Jack Harrison",
    "Jaka Bijol",
    "James Justin",
    "Jayden Bogle",
    "Jayden Lienou",
    "Joe Gelhardt",
    "Joe Rodon",
    "Joël Piroe",
    "Largie Ramazani",
    "Lucas Perri",
    "Lukas Nmecha",
    "Mateo Joseph",
    "Max Wöber",
    "Noah Okafor",
    "Rhys Chadwick",
    "Sam Byram",
    "Sam Chambers",
    "Sean Longstaff",
    "Sebastiaan Bornauw",
    "Tarik Muharemovic",
    "Wilfried Gnonto"
  ],
  "Liverpool": [
    "Alexander Isak",
    "Alexis Mac Allister",
    "Alisson Becker",
    "Amara Nallo",
    "Calvin Ramsay",
    "Carter Pinnington",
    "Cody Gakpo",
    "Conor Bradley",
    "Curtis Jones",
    "Dominik Szoboszlai",
    "Federico Chiesa",
    "Florian Wirtz",
    "Freddie Woodman",
    "Giorgi Mamardashvili",
    "Giovanni Leoni",
    "Harvey Davies",
    "Harvey Elliott",
    "Hugo Ekitiké",
    "Ibrahima Konaté",
    "James McConnell",
    "Jayden Danns",
    "Jeremie Frimpong",
    "Joe Gomez",
    "Jérémy Jacquet",
    "Kaide Gordon",
    "Keyrol Figueroa",
    "Kieran Morrison",
    "Kornel Misciur",
    "Kostas Tsimikas",
    "Michael Laffey",
    "Milos Kerkez",
    "Mohamed Salah",
    "Rhys Williams",
    "Rio Ngumoha",
    "Ryan Gravenberch",
    "Stefan Bajcetic",
    "Talla Ndiaye",
    "Tommy Pilling",
    "Trey Nyoni",
    "Virgil van Dijk",
    "Víctor Muñoz",
    "Vítezslav Jaros",
    "Wataru Endo",
    "Wellity Lucky",
    "Will Wright",
    "Ármin Pécsi"
  ],
  "Manchester City": [
    "Abdukodir Khusanov",
    "Antoine Semenyo",
    "Bernardo Silva",
    "Charlie Gray",
    "Claudio Echeverri",
    "Elliot Anderson",
    "Erling Haaland",
    "Finley Burns",
    "Floyd Samba",
    "Gianluigi Donnarumma",
    "Issa Kaboré",
    "Jack Grealish",
    "James Trafford",
    "Jeremy Monga",
    "John Stones",
    "Josh Wilson-Esbrand",
    "Josko Gvardiol",
    "Jérémy Doku",
    "Kaden Braithwaite",
    "Kalvin Phillips",
    "Kian Noble",
    "Manuel Akanji",
    "Marc Guéhi",
    "Marcus Bettinelli",
    "Mateo Kovacic",
    "Matheus Nunes",
    "Max Alleyne",
    "Nathan Aké",
    "Nico González",
    "Nico O'Reilly",
    "Omar Marmoush",
    "Phil Foden",
    "Pierce Charles",
    "Rayan Aït-Nouri",
    "Rayan Cherki",
    "Reigan Heskey",
    "Rico Lewis",
    "Rodri",
    "Ryan McAidoo",
    "Rúben Dias",
    "Savinho",
    "Stephen Mfuni",
    "Sverre Nypan",
    "Tijjani Reijnders",
    "Tyrone Samba",
    "Vitor Reis"
  ],
  "Manchester United": [
    "Altay Bayindir",
    "Amad Diallo",
    "Andrey Santos",
    "André Onana",
    "Ayden Heaven",
    "Bendito Mantato",
    "Benjamin Sesko",
    "Bruno Fernandes",
    "Bryan Mbeumo",
    "Casemiro",
    "Chido Obi",
    "Daniel Armer",
    "Daniel Gore",
    "Dermot Mee",
    "Diego León",
    "Diogo Dalot",
    "Enzo Kana Biyik",
    "Ethan Wheatley",
    "Godwill Kukonki",
    "Harry Amass",
    "Harry Maguire",
    "Jack Fletcher",
    "Jack Moorhouse",
    "Jacob Devaney",
    "Jadon Sancho",
    "Jaydan Kamason",
    "Jim Thwaites",
    "Joshua Zirkzee",
    "Karl Darlow",
    "Kobbie Mainoo",
    "Leny Yoro",
    "Lisandro Martínez",
    "Luke Shaw",
    "Manuel Ugarte",
    "Marcus Rashford",
    "Mason Mount",
    "Matheus Cunha",
    "Matthijs de Ligt",
    "Noussair Mazraoui",
    "Patrick Dorgu",
    "Rasmus Højlund",
    "Senne Lammens",
    "Shea Lacey",
    "Toby Collyer",
    "Tom Heaton",
    "Tyler Fletcher",
    "Tyler Fredricson",
    "Tyrell Malacia",
    "Youri Tielemans"
  ],
  "Newcastle United": [
    "Aaron Ramsdale",
    "Adam Harrison",
    "Aidan Harris",
    "Alex Murphy",
    "Anthony Elanga",
    "Anthony Gordon",
    "Antoñito Cordero",
    "Bazoumana Touré",
    "Bruno Guimarães",
    "Dan Burn",
    "Emil Krafth",
    "Ewen Jaouen",
    "Fabian Schär",
    "Harrison Ashby",
    "Harvey Barnes",
    "Jacob Murphy",
    "Jacob Ramsey",
    "Joe White",
    "Joe Willock",
    "Joelinton",
    "John Ruddy",
    "Kieran Trippier",
    "Leo Shahar",
    "Lewis Hall",
    "Lewis Miley",
    "Malick Thiaw",
    "Mark Gillespie",
    "Matt Targett",
    "Max Thompson",
    "Nick Pope",
    "Nick Woltemade",
    "Odysseas Vlachodimos",
    "Park Seung-Soo",
    "Sam Alabi",
    "Sean Neave",
    "Sean Steur",
    "Sven Botman",
    "Tino Livramento",
    "Trevan Sanusi",
    "William Osula",
    "Yoane Wissa"
  ],
  "Nottingham Forest": [
    "Aaron Bott",
    "Angus Gunn",
    "Archie Whitehall",
    "Arnaud Kalimuendo",
    "Ben Hammond",
    "Callum Hudson-Odoi",
    "Chris Wood",
    "Dan Ndoye",
    "Dilane Bakwa",
    "Douglas Luiz",
    "Eric da Silva Moreira",
    "Ibrahim Sangaré",
    "Igor Jesus",
    "Jack Thompson",
    "Jair Cunha",
    "James McAtee",
    "Jimmy Sinclair",
    "John Victor",
    "Jota Silva",
    "Justin Hanks",
    "Keehan Willows",
    "Lamin Sillah",
    "Lorenzo Lucca",
    "Luca Netz",
    "Matz Sels",
    "Morato",
    "Morgan Gibbs-White",
    "Murillo",
    "Neco Williams",
    "Nicolás Domínguez",
    "Nicolò Savona",
    "Nikola Milenkovic",
    "Ola Aina",
    "Omar Richards",
    "Omari Hutchinson",
    "Ryan Yates",
    "Stefan Ortega",
    "Taiwo Awoniyi",
    "Tyler Bindon",
    "Willy Boly",
    "Zach Abbott",
    "Zyan Blake"
  ],
  "Sunderland": [
    "Abdoullah Ba",
    "Ahmed Abdullahi",
    "Aji Alese",
    "Alan Browne",
    "Anthony Patterson",
    "Arthur Masuaku",
    "Bertrand Traoré",
    "Brian Brobbey",
    "Chemsdine Talbi",
    "Chris Rigg",
    "Dan Ballard",
    "Dennis Cirkin",
    "Djiamgone Jocelin Ta Bi",
    "Eliezer Mayenda",
    "Enzo Le Fée",
    "Finn Geragusyan",
    "Granit Xhaka",
    "Habib Diarra",
    "Harrison Jones",
    "Jack Whittaker",
    "Jaydon Jones",
    "Jenson Jones",
    "Jenson Seelt",
    "Leo Hjelde",
    "Luke O'Nien",
    "Lutsharel Geertruida",
    "Luís Semedo",
    "Melker Ellborg",
    "Milan Aleksic",
    "Nazariy Rusyn",
    "Niall Huggins",
    "Nilson Angulo",
    "Noah Sadiki",
    "Nordi Mukiele",
    "Omar Alderete",
    "Reinildo Mandava",
    "Robin Roefs",
    "Romaine Mundle",
    "Simon Adingra",
    "Simon Moore",
    "Thomas Meunier",
    "Timothée Pembélé",
    "Trai Hume",
    "Trey Ogunsuyi",
    "Wilson Isidor",
    "Zak Johnson"
  ],
  "Tottenham Hotspur": [
    "Alejo Veliz",
    "Alfie Devine",
    "Andy Robertson",
    "Antonín Kinsky",
    "Archie Gray",
    "Ashley Phillips",
    "Ben Davies",
    "Brandon Austin",
    "Callum Olusesi",
    "Conor Gallagher",
    "Cristian Romero",
    "Dane Scarlett",
    "Dejan Kulusevski",
    "Destiny Udogie",
    "Djed Spence",
    "Dominic Solanke",
    "George Abbott",
    "Guglielmo Vicario",
    "James Maddison",
    "James Rowswell",
    "James Wilson",
    "Jamie Donley",
    "Jan Paul van Hecke",
    "João Palhinha",
    "Jun'ai Byfield",
    "Kevin Danso",
    "Kota Takai",
    "Luca Gunter",
    "Lucas Bergvall",
    "Lucá Williams-Barnett",
    "Malachi Hardy",
    "Manor Solomon",
    "Marcos Senesi",
    "Martin Dúbravka",
    "Mateus Fernandes",
    "Mathys Tel",
    "Micky van de Ven",
    "Mikey Moore",
    "Mohammed Kudus",
    "Pape Matar Sarr",
    "Pedro Porro",
    "Radu Dragusin",
    "Randal Kolo Muani",
    "Richarlison",
    "Rio Kyerematen",
    "Rodrigo Bentancur",
    "Sandro Tonali",
    "Souza",
    "Tye Hall",
    "Tynan Thompson",
    "Will Lankshear",
    "Wilson Odobert",
    "Xavi Simons",
    "Yang Min-Hyeok",
    "Yves Bissouma"
  ]
};
const builtInPlayersByTeam = normalizePlayersByTeam(builtInPlayersRaw);

const defaultState = {
  users: [],
  matches: [],
  playersByTeam: {},
  seasonBonus: { official: {}, predictions: {} },
  deletedUsers: { ids: {}, names: {} },
  currentUserId: null,
  matchdayFilter: "all",
  lastSync: null,
  testMode: false,
};

let state = migrateState(loadState());
let autoSyncTimer = null;
let currentUserId = localStorage.getItem(sessionUserStorageKey);
let remoteSaveTimer = null;
let remoteRefreshTimer = null;
let countdownTimer = null;
let lastLocalChangeAt = 0;
if (removeDemoMatches()) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

const els = {
  accessGate: document.querySelector("#accessGate"),
  accessForm: document.querySelector("#accessForm"),
  accessPassword: document.querySelector("#accessPassword"),
  accessError: document.querySelector("#accessError"),
  appShell: document.querySelector("#appShell"),
  signupForm: document.querySelector("#signupForm"),
  signupName: document.querySelector("#signupName"),
  signupPin: document.querySelector("#signupPin"),
  signupAvatar: document.querySelector("#signupAvatar"),
  loginForm: document.querySelector("#loginForm"),
  loginUser: document.querySelector("#loginUser"),
  loginPin: document.querySelector("#loginPin"),
  logoutBtn: document.querySelector("#logoutBtn"),
  avatarPanel: document.querySelector("#avatarPanel"),
  avatarPreview: document.querySelector("#avatarPreview"),
  avatarInput: document.querySelector("#avatarInput"),
  friendList: document.querySelector("#friendList"),
  friendCount: document.querySelector("#friendCount"),
  sessionLabel: document.querySelector("#sessionLabel"),
  refreshStateBtn: document.querySelector("#refreshStateBtn"),
  remoteStatus: document.querySelector("#remoteStatus"),
  matchForm: document.querySelector("#matchForm"),
  teamA: document.querySelector("#teamA"),
  teamB: document.querySelector("#teamB"),
  matchDate: document.querySelector("#matchDate"),
  matchday: document.querySelector("#matchday"),
  matchdayFilter: document.querySelector("#matchdayFilter"),
  matchList: document.querySelector("#matchList"),
  matchCount: document.querySelector("#matchCount"),
  leaderboard: document.querySelector("#leaderboard"),
  resetBtn: document.querySelector("#resetBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  importInput: document.querySelector("#importInput"),
  apiKey: document.querySelector("#apiKey"),
  saveKeyBtn: document.querySelector("#saveKeyBtn"),
  importLeagueBtn: document.querySelector("#importLeagueBtn"),
  syncBtn: document.querySelector("#syncBtn"),
  testModeBtn: document.querySelector("#testModeBtn"),
  syncStatus: document.querySelector("#syncStatus"),
  seasonBonusList: document.querySelector("#seasonBonusList"),
  seasonBonusTotal: document.querySelector("#seasonBonusTotal"),
  playerStats: document.querySelector("#playerStats"),
  overallStats: document.querySelector("#overallStats"),
  statsCount: document.querySelector("#statsCount"),
  nextMatchLabel: document.querySelector("#nextMatchLabel"),
  nextMatchTeams: document.querySelector("#nextMatchTeams"),
  matchTemplate: document.querySelector("#matchTemplate"),
  adminOnly: document.querySelectorAll(".admin-only"),
  mobileTabs: document.querySelectorAll("[data-mobile-tab]"),
  mobilePanels: document.querySelectorAll("[data-mobile-panel]"),
};

setupAccessGate();
setupMobileTabs();

els.apiKey.value = localStorage.getItem(apiKeyStorageKey) ?? "";

function setupAccessGate() {
  const unlocked = localStorage.getItem(accessStorageKey) === "true";
  if (unlocked) {
    els.accessGate.hidden = true;
    els.appShell.hidden = false;
    return;
  }

  els.accessGate.hidden = false;
  els.appShell.hidden = true;
  els.accessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = els.accessPassword.value.trim().toUpperCase();
    if (value !== sitePassword) {
      els.accessError.hidden = false;
      els.accessPassword.select();
      return;
    }
    localStorage.setItem(accessStorageKey, "true");
    els.accessGate.hidden = true;
    els.appShell.hidden = false;
  });
}

function setupMobileTabs() {
  els.mobileTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setMobileTab(tab.dataset.mobileTab);
    });
  });
  setMobileTab("matches");
}

function setMobileTab(tabName) {
  document.body.dataset.mobileTab = tabName;
  els.mobileTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.mobileTab === tabName);
  });
  els.mobilePanels.forEach((panel) => {
    panel.classList.toggle("is-mobile-active", panel.dataset.mobilePanel === tabName);
  });
}

els.signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = clean(els.signupName.value);
  const pin = els.signupPin.value.trim();
  if (!name || !pin) return;
  if (state.users.some((user) => same(user.name, name))) {
    alert("Ce pseudo existe déjà.");
    return;
  }
  let avatar = "";
  try {
    avatar = await avatarFromFile(els.signupAvatar.files[0]);
  } catch {
    alert("La photo n'a pas pu être ajoutée. Le joueur est inscrit sans avatar.");
  }
  const user = { id: crypto.randomUUID(), name, pin, avatar, createdAt: Date.now() };
  state.users.push(user);
  setCurrentUser(user.id);
  els.signupForm.reset();
  persist();
});

els.avatarInput.addEventListener("change", async () => {
  const user = currentUser();
  if (!user) return;
  try {
    user.avatar = await avatarFromFile(els.avatarInput.files[0]);
    els.avatarInput.value = "";
    persist();
  } catch {
    alert("Impossible d'ajouter cette photo.");
  }
});

els.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = state.users.find((item) => item.id === els.loginUser.value);
  if (!user || user.pin !== els.loginPin.value.trim()) {
    alert("Pseudo ou PIN incorrect.");
    return;
  }
  setCurrentUser(user.id);
  els.loginPin.value = "";
  persist();
});

els.logoutBtn.addEventListener("click", () => {
  setCurrentUser(null);
  persist();
});

els.matchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireAdmin()) return;
  const teamA = clean(els.teamA.value);
  const teamB = clean(els.teamB.value);
  if (!teamA || !teamB) return;

  upsertMatch({
    id: crypto.randomUUID(),
    externalId: null,
    teamA,
    teamB,
    date: els.matchDate.value,
    matchday: Number(els.matchday.value) || null,
    status: "SCHEDULED",
    result: { a: "", b: "" },
    predictions: {},
  });

  els.matchForm.reset();
  persist();
});

els.matchdayFilter.addEventListener("change", () => {
  state.matchdayFilter = els.matchdayFilter.value;
  persist();
});

els.refreshStateBtn.addEventListener("click", async () => {
  await forceRemoteSync();
});

els.seasonBonusList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-bonus-id]");
  if (!input) return;
  refreshBonusPlayerSelect(input);
  const value = bonusValueFromControls(input);

  if (input.dataset.role === "official") {
    if (!isAdmin()) return;
    state.seasonBonus.official[input.dataset.bonusId] = value;
  } else {
    if (isSeasonLocked() && !state.testMode) {
      alert("Les bonus saison sont verrouillés après le début du championnat.");
      render();
      return;
    }
    const user = currentUser();
    if (!user) return;
    state.seasonBonus.predictions[user.id] = state.seasonBonus.predictions[user.id] ?? {};
    state.seasonBonus.predictions[user.id][input.dataset.bonusId] = value;
  }

  persist();
});

els.saveKeyBtn.addEventListener("click", async () => {
  if (!requireAdmin()) return;
  await saveApiKey();
});

els.importLeagueBtn.addEventListener("click", () => syncPremierLeague());
els.syncBtn.addEventListener("click", () => syncPremierLeague());
els.testModeBtn.addEventListener("click", () => applyTestMode());

els.resetBtn.addEventListener("click", () => {
  if (!requireAdmin()) return;
  if (!confirm("Tout effacer ?")) return;
  localStorage.removeItem(testModeStorageKey);
  state = structuredClone(defaultState);
  persist();
});

els.exportBtn.addEventListener("click", () => {
  if (!requireAdmin()) return;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "novaprono.json";
  link.click();
  URL.revokeObjectURL(url);
});

els.importInput.addEventListener("change", async (event) => {
  if (!requireAdmin()) {
    event.target.value = "";
    return;
  }
  const [file] = event.target.files;
  if (!file) return;

  try {
    const imported = migrateState(JSON.parse(await file.text()));
    if (!Array.isArray(imported.users) || !Array.isArray(imported.matches)) {
      throw new Error("Format invalide");
    }
    state = imported;
    persist();
  } catch {
    alert("Impossible d'importer ce fichier.");
  } finally {
    event.target.value = "";
  }
});

window.addEventListener("storage", (event) => {
  if (event.key !== storageKey || !event.newValue) return;
  try {
    state = migrateState(JSON.parse(event.newValue));
    render();
  } catch (error) {
    console.error(error);
  }
});

async function syncPremierLeague(silent = false) {
  if (location.protocol === "file:") {
    setStatus("Ouvre NovaProno avec le serveur local pour importer les vrais matchs.");
    if (!silent) alert("L'import API ne marche pas en ouvrant le fichier directement. Lance le serveur local NovaProno, puis ouvre http://localhost:5173");
    return;
  }

  setStatus("Synchronisation en cours...");
  try {
    const url = `/api/premier-league?season=${seasonYear}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur API ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.matches)) throw new Error("Réponse API invalide");
    data.matches.forEach((match) => upsertMatch(fromApiMatch(match)));
    const playerCount = await syncPlayers(true);
    state.lastSync = new Date().toISOString();
    persist();
    setStatus(`${data.matches.length} matchs et ${playerCount} joueurs Premier League synchronisés.`);
  } catch (error) {
    setStatus("Synchronisation impossible depuis ce navigateur. Vérifie la clé API ou le blocage CORS.");
    if (!silent) alert("La synchronisation n'a pas fonctionné. Vérifie la clé API.");
    console.error(error);
  }
}

async function syncPlayers(silent = false) {
  try {
    const response = await fetch(`/api/players?season=${seasonYear}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Erreur API ${response.status}`);
    const data = await response.json();
    const importedPlayers = mergePlayersByTeam(normalizePlayersByTeam(data.playersByTeam), builtInPlayersByTeam);
    const playerCount = Object.values(importedPlayers).reduce((sum, players) => sum + players.length, 0);
    if (playerCount > 0) state.playersByTeam = importedPlayers;
    if (playerCount === 0 && !silent) setStatus("Aucun joueur reçu. Tu peux écrire le nom à la main.");
    return playerCount;
  } catch (error) {
    if (playersCount(builtInPlayersByTeam) > 0) {
      state.playersByTeam = mergePlayersByTeam(state.playersByTeam, builtInPlayersByTeam);
      return playersCount(state.playersByTeam);
    }
    if (!silent) setStatus("Impossible d'importer la liste des joueurs.");
    console.error(error);
    return 0;
  }
}

async function ensurePlayersLoaded() {
  if (playersCount() === 0 && playersCount(builtInPlayersByTeam) > 0) {
    state.playersByTeam = mergePlayersByTeam(state.playersByTeam, builtInPlayersByTeam);
    persistLocalOnly();
    render();
  }
  if (location.protocol === "file:" || playersCount() > 0) return;
  const playerCount = await syncPlayers(true);
  if (playerCount > 0) {
    persistLocalOnly();
    render();
  }
}

async function saveApiKey() {
  const key = els.apiKey.value.trim();
  if (!key) {
    alert("Ajoute une clé avant de l'enregistrer.");
    return;
  }

  localStorage.setItem(apiKeyStorageKey, key);

  if (location.protocol === "file:") {
    setStatus("Clé gardée dans ce navigateur. Lance le serveur local pour l'import automatique.");
    return;
  }

  try {
    const response = await fetch("/api/key", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    setStatus("Clé gardée dans le serveur local. Synchronisation automatique active.");
    ensureAutoSync();
    await syncPremierLeague(true);
  } catch (error) {
    setStatus("Impossible d'enregistrer la clé dans le serveur local.");
    console.error(error);
  }
}

function fromApiMatch(match) {
  const fullTime = match.score?.fullTime ?? {};
  const hasFullTime = Number.isInteger(fullTime.home) && Number.isInteger(fullTime.away);
  return {
    id: `fd-${match.id}`,
    externalId: String(match.id),
    teamA: match.homeTeam?.shortName || match.homeTeam?.name || "Domicile",
    teamB: match.awayTeam?.shortName || match.awayTeam?.name || "Extérieur",
    date: match.utcDate ? toInputDate(new Date(match.utcDate)) : "",
    matchday: match.matchday ?? null,
    status: match.status ?? "SCHEDULED",
    result: {
      a: hasFullTime ? String(fullTime.home) : "",
      b: hasFullTime ? String(fullTime.away) : "",
    },
    predictions: {},
  };
}

function removeDemoMatches() {
  const before = state.matches.length;
  state.matches = state.matches.filter((match) => {
    const externalId = String(match.externalId ?? "");
    const id = String(match.id ?? "");
    return !externalId.startsWith("demo-") && !externalId.startsWith("sample-") && !id.startsWith("demo-");
  });
  return state.matches.length !== before;
}

function render() {
  renderUsers();
  renderMatchdayFilter();
  renderMatches();
  renderSeasonBonus();
  renderLeaderboard();
  renderPlayerStats();
  renderHeaderStats();
  renderSession();
  renderAdminControls();
}

function renderUsers() {
  els.friendCount.textContent = state.users.length;
  els.loginUser.innerHTML = "";

  if (state.users.length === 0) {
    els.loginUser.innerHTML = '<option value="">Aucun inscrit</option>';
    els.friendList.innerHTML = '<li class="empty-state">Inscris le premier joueur.</li>';
    return;
  }

  state.users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    els.loginUser.append(option);
  });

  els.friendList.innerHTML = "";
  state.users.forEach((user) => {
    const item = document.createElement("li");
    const identity = document.createElement("span");
    const name = document.createElement("span");
    const button = document.createElement("button");
    identity.className = "user-identity";
    name.textContent = user.name;
    button.type = "button";
    button.textContent = "×";
    button.title = `Retirer ${user.name}`;
    button.addEventListener("click", () => removeUser(user.id));
    identity.append(avatarNode(user), name);
    item.append(identity, button);
    els.friendList.append(item);
  });
}

function renderSession() {
  const user = currentUser();
  els.sessionLabel.textContent = user ? `Connecté: ${user.name}${isAdmin() ? " · admin" : ""}` : "Non connecté";
  renderAvatarPanel(user);
}

function renderSeasonBonus() {
  const user = currentUser();
  const locked = isSeasonLocked();
  const predictionLocked = locked && !state.testMode;
  els.seasonBonusList.innerHTML = "";
  els.seasonBonusTotal.textContent = user ? `${seasonBonusPointsFor(user.id)} pts` : "0";

  if (!user) {
    els.seasonBonusList.innerHTML = '<p class="empty-state">Connecte-toi pour remplir tes bonus saison.</p>';
    return;
  }

  const userBonus = state.seasonBonus.predictions[user.id] ?? {};
  seasonBonusCategories.forEach((category) => {
    const row = document.createElement("div");
    row.className = `bonus-row${locked ? " is-locked" : ""}`;
    row.innerHTML = `
      <div>
        <strong>${category.label}</strong>
        <span>${category.points} pts</span>
      </div>
      <label>
        Ton choix
        ${bonusControlsHtml(category, "prediction")}
      </label>
      <label class="admin-only">
        Réponse officielle
        ${bonusControlsHtml(category, "official")}
      </label>
      <b>${seasonBonusCategoryPoints(user.id, category)} pts</b>
    `;

    setBonusControlsValue(row, category, "prediction", userBonus[category.id] ?? "");
    row.querySelectorAll('[data-role="prediction"]').forEach((input) => {
      input.disabled = predictionLocked;
      input.title = predictionLocked ? "Bonus verrouillé après le début du championnat" : "";
    });
    const officialLabel = row.querySelector(".admin-only");
    officialLabel.hidden = false;
    setBonusControlsValue(row, category, "official", state.seasonBonus.official[category.id] ?? "");
    row.querySelectorAll('[data-role="official"]').forEach((input) => {
      input.disabled = !isAdmin() && input.tagName === "SELECT";
      input.readOnly = !isAdmin() && input.tagName !== "SELECT";
      input.title = isAdmin() ? "" : "Réponse officielle modifiable uniquement par l'admin";
    });
    els.seasonBonusList.append(row);
  });

  if (locked) {
    els.seasonBonusList.append(renderPublicSeasonBonus());
  }
}

function bonusControlsHtml(category, role) {
  if (!individualBonusIds.has(category.id)) {
    return `
      <select data-role="${role}" data-bonus-id="${category.id}">
        ${teamSelectOptionsHtml("")}
      </select>
    `;
  }

  return `
    <span class="bonus-choice">
      <select data-role="${role}" data-bonus-id="${category.id}" data-bonus-part="team">
        ${teamSelectOptionsHtml("")}
      </select>
      <select data-role="${role}" data-bonus-id="${category.id}" data-bonus-part="player">
        ${playerSelectOptionsHtml("", "")}
      </select>
    </span>
  `;
}

function teamOptionsHtml() {
  const teams = bonusTeamChoices();
  const options = ['<option value="">Choisir équipe</option>'];
  teams.forEach((team) => {
    options.push(`<option value="${escapeHtml(team)}"></option>`);
  });
  return options.join("");
}

function teamSelectOptionsHtml(selected = "") {
  const options = ['<option value="">Choisir équipe</option>'];
  bonusTeamChoices().forEach((team) => {
    options.push(`<option value="${escapeHtml(team)}"${same(team, selected) ? " selected" : ""}>${escapeHtml(team)}</option>`);
  });
  return options.join("");
}

function bonusTeamChoices() {
  const playerTeams = Object.keys(builtInPlayersByTeam).length ? Object.keys(builtInPlayersByTeam) : Object.keys(state.playersByTeam || {});
  const matchTeams = Object.keys(builtInPlayersByTeam).length ? [] : state.matches.flatMap((match) => [match.teamA, match.teamB]).filter(Boolean);
  return [...new Set([...playerTeams, ...matchTeams])]
    .filter((team) => playersForTeam(team).length > 0)
    .sort((a, b) => a.localeCompare(b, "fr"));
}

function playerOptionsHtml(team, selected = "") {
  const players = playersForTeam(team);
  const options = [];
  players.forEach((player) => {
    options.push(`<option value="${escapeHtml(player)}"></option>`);
  });
  if (selected && !players.includes(selected)) {
    options.push(`<option value="${escapeHtml(selected)}"></option>`);
  }
  return options.join("");
}

function playerSelectOptionsHtml(team, selected = "") {
  const players = playersForTeam(team);
  const options = ['<option value="">Choisir joueur</option>'];
  players.forEach((player) => {
    options.push(`<option value="${escapeHtml(player)}"${same(player, selected) ? " selected" : ""}>${escapeHtml(player)}</option>`);
  });
  return options.join("");
}

function playersForTeam(team) {
  if (!team) {
    return [...new Set(Object.values(state.playersByTeam || {}).flat())]
      .sort((a, b) => a.localeCompare(b, "fr"));
  }
  const keys = teamLookupKeys(team);
  const players = keys.flatMap((key) => state.playersByTeam?.[key] || []);
  return [...new Set(players)].sort((a, b) => a.localeCompare(b, "fr"));
}

function playersCount(playersByTeam = state.playersByTeam) {
  return Object.values(playersByTeam || {}).reduce((sum, players) => sum + players.length, 0);
}

function teamLookupKeys(team) {
  const aliases = {
    Arsenal: ["Arsenal FC"],
    "Arsenal FC": ["Arsenal"],
    Bournemouth: ["AFC Bournemouth"],
    "AFC Bournemouth": ["Bournemouth"],
    Brighton: ["Brighton & Hove Albion", "Brighton and Hove Albion", "Brighton Hove"],
    "Brighton Hove": ["Brighton", "Brighton & Hove Albion", "Brighton and Hove Albion"],
    "Brighton & Hove Albion": ["Brighton"],
    "Brighton and Hove Albion": ["Brighton", "Brighton Hove", "Brighton & Hove Albion"],
    Ipswich: ["Ipswich Town"],
    "Ipswich Town": ["Ipswich"],
    Leeds: ["Leeds United"],
    "Leeds United": ["Leeds"],
    Liverpool: ["Liverpool FC"],
    "Liverpool FC": ["Liverpool"],
    "Man City": ["Manchester City"],
    "Manchester City": ["Man City"],
    "Man United": ["Manchester United"],
    "Manchester United": ["Man United"],
    Newcastle: ["Newcastle United"],
    "Newcastle United": ["Newcastle"],
    Nottingham: ["Nottingham Forest"],
    "Nottingham Forest": ["Nottingham"],
    Tottenham: ["Tottenham Hotspur"],
    "Tottenham Hotspur": ["Tottenham"],
  };
  const keys = new Set([team]);
  if (aliases[team]) aliases[team].forEach((alias) => keys.add(alias));
  if (team) {
    keys.add(team.replace(/\s+FC$/i, "").replace(/^AFC\s+/i, "").trim());
  }
  return [...keys].filter(Boolean);
}

function bonusPlayerListId(role, bonusId) {
  return `players-${role}-${bonusId}`;
}

function bonusTeamListId(role, bonusId) {
  return `teams-${role}-${bonusId}`;
}

function setBonusControlsValue(row, category, role, value) {
  const directInput = row.querySelector(`[data-role="${role}"][data-bonus-id="${category.id}"]:not([data-bonus-part])`);
  if (directInput) {
    if (directInput.tagName === "SELECT") {
      directInput.innerHTML = teamSelectOptionsHtml(value);
      setSelectValue(directInput, value);
    } else {
      directInput.value = value;
    }
    return;
  }

  if (!individualBonusIds.has(category.id)) {
    row.querySelector(`[data-role="${role}"][data-bonus-id="${category.id}"]`).value = value;
    return;
  }

  const { team, player } = splitBonusIndividualValue(value);
  const teamInput = row.querySelector(`[data-role="${role}"][data-bonus-id="${category.id}"][data-bonus-part="team"]`);
  const playerSelect = row.querySelector(`[data-role="${role}"][data-bonus-id="${category.id}"][data-bonus-part="player"]`);
  teamInput.innerHTML = teamSelectOptionsHtml(team);
  setSelectValue(teamInput, team);
  playerSelect.innerHTML = playerSelectOptionsHtml(team, player);
  setSelectValue(playerSelect, player);
}

function bonusValueFromControls(input) {
  const row = input.closest(".bonus-row");
  const { role, bonusId } = input.dataset;
  if (!input.dataset.bonusPart) return clean(input.value);
  if (!individualBonusIds.has(bonusId)) return clean(input.value);

  const team = clean(row.querySelector(`[data-role="${role}"][data-bonus-id="${bonusId}"][data-bonus-part="team"]`)?.value ?? "");
  const player = clean(row.querySelector(`[data-role="${role}"][data-bonus-id="${bonusId}"][data-bonus-part="player"]`)?.value ?? "");
  if (!team && !player) return "";
  if (!team) return player;
  return player ? `${team} - ${player}` : team;
}

function splitBonusIndividualValue(value = "") {
  const mainValue = String(value).split("|")[0].split(" / ")[0];
  const parts = mainValue.split(" - ");
  if (parts.length >= 2) return { team: clean(parts.shift()), player: clean(parts.join(" - ")) };
  if (bonusTeamChoices().some((team) => same(team, clean(mainValue)))) {
    return { team: clean(mainValue), player: "" };
  }
  return { team: "", player: clean(mainValue) };
}

function refreshBonusPlayerSelect(input) {
  if (input.dataset.bonusPart !== "team" || !individualBonusIds.has(input.dataset.bonusId)) return;
  const row = input.closest(".bonus-row");
  const select = row.querySelector(`[data-role="${input.dataset.role}"][data-bonus-id="${input.dataset.bonusId}"][data-bonus-part="player"]`);
  select.innerHTML = playerSelectOptionsHtml(input.value);
  select.value = "";
}

function setSelectValue(select, value) {
  if (!select || !value) return;
  const option = [...select.options].find((item) => same(item.value, value));
  select.value = option ? option.value : "";
}

function renderAdminControls() {
  const visible = isAdmin();
  els.adminOnly.forEach((element) => {
    element.hidden = !visible;
  });
  ensureAutoSync();
}

function ensureAutoSync() {
  const canSync = location.protocol !== "file:";

  if (!canSync) {
    if (autoSyncTimer) {
      clearInterval(autoSyncTimer);
      autoSyncTimer = null;
    }
    return;
  }

  if (autoSyncTimer) return;
  setTimeout(() => syncPremierLeague(true), 800);
  autoSyncTimer = setInterval(() => syncPremierLeague(true), autoSyncEveryMs);
}

function renderMatchdayFilter() {
  const days = [...new Set(state.matches.map((match) => match.matchday).filter(Boolean))].sort((a, b) => a - b);
  const current = state.matchdayFilter ?? "all";
  els.matchdayFilter.innerHTML = '<option value="all">Toutes</option>';
  days.forEach((day) => {
    const option = document.createElement("option");
    option.value = String(day);
    option.textContent = `Journée ${day}`;
    els.matchdayFilter.append(option);
  });
  els.matchdayFilter.value = days.includes(Number(current)) ? current : "all";
  state.matchdayFilter = els.matchdayFilter.value;
}

function renderMatches() {
  els.matchCount.textContent = state.matches.length;
  els.matchList.innerHTML = "";
  const matches = filteredMatches();

  if (matches.length === 0) {
    els.matchList.innerHTML = '<p class="empty-state">Aucun vrai match importé. Mets ta clé API puis clique sur Importer PL.</p>';
    return;
  }

  matches.forEach((match) => {
    const node = els.matchTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector("h4").textContent = `${match.teamA} - ${match.teamB}`;
    node.querySelector(".match-date").textContent = matchMeta(match);
    node.querySelector(".official-score").textContent = officialScoreLabel(match);

    const removeButton = node.querySelector(".remove-match");
    removeButton.hidden = !isAdmin();
    removeButton.addEventListener("click", () => removeMatch(match.id));
    renderPredictions(node.querySelector(".prediction-list"), match);
    els.matchList.append(node);
  });
}

function renderPredictions(container, match) {
  container.innerHTML = "";
  if (state.users.length === 0) {
    container.innerHTML = '<p class="empty-state">Inscris au moins un joueur.</p>';
    return;
  }

  const user = currentUser();
  if (!user) {
    container.innerHTML = '<p class="empty-state">Connecte-toi pour saisir ton prono.</p>';
    return;
  }

  const locked = isMatchLocked(match);
  const isTestMatch = state.testMode && match.status === "TEST";
  const inputsLocked = locked && !isTestMatch;
  const showPublicPredictions = locked || isTestMatch;
  const prediction = match.predictions[user.id] ?? { a: "", b: "" };
  const row = document.createElement("div");
  row.className = "prediction-row";

  const name = document.createElement("span");
  name.className = "friend-name user-identity";
  name.append(avatarNode(user), document.createTextNode(`Prono de ${user.name}`));

  const inputs = document.createElement("span");
  inputs.className = "score-inputs";
  const inputA = scoreInput(prediction.a);
  const dash = document.createElement("b");
  const inputB = scoreInput(prediction.b);
  dash.textContent = "-";
  inputA.disabled = inputsLocked;
  inputB.disabled = inputsLocked;
  if (inputsLocked) {
    row.classList.add("is-locked");
    inputA.title = "Prono verrouillé après le début du match";
    inputB.title = "Prono verrouillé après le début du match";
  }
  inputA.addEventListener("change", () => {
    updatePrediction(match.id, user.id, "a", inputA.value);
    refreshTestPredictionPoints(match, user.id, points);
  });
  inputB.addEventListener("change", () => {
    updatePrediction(match.id, user.id, "b", inputB.value);
    refreshTestPredictionPoints(match, user.id, points);
  });
  inputs.append(inputA, dash, inputB);

  const points = document.createElement("span");
  points.className = "prediction-points";
  points.innerHTML = `<strong>${pointsFor(match, user.id)}</strong> pts`;

  if (inputsLocked) {
    const lock = document.createElement("span");
    lock.className = "lock-label";
    lock.textContent = "Verrouillé";
    row.append(name, inputs, points, lock);
  } else {
    row.append(name, inputs, points);
  }
  container.append(row);

  if (showPublicPredictions) {
    container.append(renderPublicMatchPredictions(match));
  }
}

function renderPublicMatchPredictions(match) {
  const box = document.createElement("div");
  box.className = "public-predictions";
  box.innerHTML = "<strong>Pronostics des joueurs</strong>";

  state.users.forEach((user) => {
    const prediction = match.predictions[user.id];
    const item = document.createElement("p");
    const identity = document.createElement("span");
    const score = hasScore(prediction) ? `${prediction.a} - ${prediction.b}` : "Aucun prono";
    const points = pointsFor(match, user.id);
    const cards = matchdayCardDetailFor(user.id, match.matchday);
    const result = document.createElement("b");
    identity.className = "user-identity";
    identity.append(avatarNode(user), document.createTextNode(user.name));
    item.append(identity);
    result.className = "public-prediction-result";
    result.insertAdjacentHTML("beforeend", `<span>${score}</span><small>${points} pts</small>`);
    if (cards.missedPredictions > 0) {
      const penalties = document.createElement("span");
      penalties.className = "prediction-card-detail";
      if (cards.yellowCards) penalties.append(cardBadge("yellow", cards.yellowCards));
      if (cards.redCards) {
        penalties.append(cardBadge("red", cards.redCards));
        penalties.insertAdjacentHTML("beforeend", `<small>-${cards.penaltyPoints} pts</small>`);
      }
      result.append(penalties);
    }
    item.append(result);
    box.append(item);
  });

  return box;
}

function refreshTestPredictionPoints(match, userId, pointsElement) {
  if (!(state.testMode && match.status === "TEST")) return;
  pointsElement.innerHTML = `<strong>${pointsFor(match, userId)}</strong> pts`;
  const publicPredictions = pointsElement.closest(".prediction-list")?.querySelector(".public-predictions");
  if (publicPredictions) publicPredictions.replaceWith(renderPublicMatchPredictions(match));
  renderLeaderboard();
}

function renderPublicSeasonBonus() {
  const box = document.createElement("div");
  box.className = "public-bonus";
  box.innerHTML = "<strong>Pronostics bonus des joueurs</strong>";

  state.users.forEach((user) => {
    const userBonus = state.seasonBonus.predictions[user.id] ?? {};
    const card = document.createElement("article");
    card.innerHTML = `<h4></h4>`;
    card.querySelector("h4").textContent = user.name;

    seasonBonusCategories.forEach((category) => {
      const item = document.createElement("p");
      item.innerHTML = `<span></span><b></b>`;
      item.querySelector("span").textContent = category.label;
      item.querySelector("b").textContent = userBonus[category.id] || "Aucun prono";
      card.append(item);
    });

    box.append(card);
  });

  return box;
}

function renderLeaderboard() {
  const rows = standings();
  els.leaderboard.innerHTML = "";

  if (rows.length === 0) {
    els.leaderboard.innerHTML = '<p class="empty-state">Classement vide.</p>';
    return;
  }

  const days = leaderboardDays();
  const table = document.createElement("table");
  table.className = "leader-table";
  const header = document.createElement("thead");
  header.innerHTML = `
    <tr>
      <th>Joueur</th>
      <th>Total</th>
      <th>Bonus</th>
    </tr>
  `;
  const headerRow = header.querySelector("tr");
  days.forEach((day) => {
    const th = document.createElement("th");
    th.textContent = `J${day}`;
    headerRow.append(th);
  });

  const body = document.createElement("tbody");
  rows.forEach((user, index) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.className = "leader-player";
    nameCell.innerHTML = `<span class="rank-badge">${index + 1}</span>`;
    nameCell.append(avatarNode(user), document.createElement("strong"));
    nameCell.querySelector("strong").textContent = user.name;
    nameCell.append(cardBadgesFor(user.id));

    const totalCell = document.createElement("td");
    totalCell.className = "leader-total";
    totalCell.textContent = `${user.points} pts`;

    const bonus = seasonBonusDetailsFor(user.id);
    const bonusCell = document.createElement("td");
    bonusCell.textContent = bonus.available ? `${bonus.points} pts` : "-";

    row.append(nameCell, totalCell, bonusCell);
    days.forEach((day) => {
      const detail = matchdayDetailFor(user.id, day);
      const cell = document.createElement("td");
      cell.innerHTML = detail.html;
      if (detail.winner) cell.className = "day-winner";
      row.append(cell);
    });
    body.append(row);
  });

  table.append(header, body);
  els.leaderboard.append(table);
}

function renderPlayerStats() {
  els.playerStats.innerHTML = "";
  els.overallStats.innerHTML = "";
  els.statsCount.textContent = state.users.length;

  if (state.users.length === 0) {
    els.playerStats.innerHTML = '<p class="empty-state">Aucun joueur inscrit.</p>';
    return;
  }

  renderOverallStats();

  standings().forEach((user) => {
    const stats = playerStatsFor(user.id);
    const card = document.createElement("article");
    card.className = "stat-card";
    card.innerHTML = `
      <div class="stat-title">
        <div class="user-identity"><h4></h4></div>
        <strong>${stats.total} pts</strong>
      </div>
      <div class="stat-grid">
        <span><b>${stats.predictions}</b> pronos</span>
        <span><b>${stats.exactScores}</b> scores exacts</span>
        <span><b>${stats.goodResults}</b> bons résultats</span>
        <span><b>${stats.dayWins}</b> journées gagnées</span>
        <span><b>${stats.missedPredictions}</b> oublis</span>
        <span><b>${stats.yellowCards}</b> jaunes</span>
        <span><b>${stats.redCards}</b> rouges</span>
        <span><b>${stats.penaltyPoints ? `-${stats.penaltyPoints}` : "0"}</b> pts pénalité</span>
        <span><b>${stats.matchPoints}</b> pts matchs</span>
        <span><b>${stats.seasonBonus}</b> pts bonus</span>
        <span><b>${stats.average}</b> pts/prono</span>
      </div>
    `;
    card.querySelector(".user-identity").prepend(avatarNode(user));
    card.querySelector("h4").textContent = user.name;
    card.querySelector(".user-identity").append(cardBadgesFor(user.id));
    els.playerStats.append(card);
  });
}

function renderOverallStats() {
  const rows = state.users.map((user) => ({ user, stats: playerStatsFor(user.id) }));
  const items = [
    { label: "Scores exacts", value: (row) => row.stats.exactScores, suffix: "scores" },
    { label: "Bons résultats", value: (row) => row.stats.goodResults, suffix: "résultats" },
    { label: "Journées gagnées", value: (row) => row.stats.dayWins, suffix: "journées" },
    { label: "Meilleure moyenne", value: (row) => Number(row.stats.average), suffix: "pts/prono", decimals: 1 },
    { label: "Moins d'oublis", value: (row) => row.stats.missedPredictions, suffix: "oublis", lowest: true },
    { label: "Plus de pénalités", value: (row) => row.stats.penaltyPoints, suffix: "pts", penalty: true },
  ];

  const table = document.createElement("table");
  table.className = "leader-table overall-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Stat</th>
        <th>Leader</th>
        <th>Valeur</th>
      </tr>
    </thead>
  `;
  const body = document.createElement("tbody");

  items.forEach((item) => {
    const value = item.lowest
      ? Math.min(...rows.map(item.value))
      : Math.max(...rows.map(item.value));
    const leaders = rows.filter((row) => item.value(row) === value);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.label}</td>
      <td><strong></strong></td>
      <td class="${item.penalty && value ? "penalty-value" : "leader-total"}"></td>
    `;
    row.querySelector("strong").textContent = leaders.map((leader) => leader.user.name).join(", ");
    row.lastElementChild.textContent = `${item.penalty && value ? `-${value}` : formatStatValue(value, item.decimals)} ${item.suffix}`;
    body.append(row);
  });

  table.append(body);
  els.overallStats.append(table);
}

function formatStatValue(value, decimals = 0) {
  return decimals ? Number(value).toFixed(decimals) : String(value);
}

function renderHeaderStats() {
  const firstMatch = sortedMatches().find((match) => match.date && match.status !== "TEST");
  if (!firstMatch) {
    els.nextMatchLabel.textContent = "Début du championnat";
    els.nextMatchTeams.textContent = "Importe la saison 26-27";
    return;
  }

  const kickoff = new Date(firstMatch.date);
  els.nextMatchLabel.textContent = "Début du championnat";
  els.nextMatchTeams.textContent = countdownLabel(kickoff);
}

function countdownLabel(targetDate) {
  const diff = targetDate.getTime() - Date.now();
  if (Number.isNaN(targetDate.getTime())) return "Date à confirmer";
  if (diff <= 0) return "Championnat commencé";

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days} j ${hours} h ${minutes} min ${seconds} s`;
}

function startCountdown() {
  if (countdownTimer) return;
  countdownTimer = setInterval(renderHeaderStats, 1000);
}

function standings() {
  const baseRows = state.users.map((user) => ({
    ...user,
    points: playerStatsFor(user.id).total,
  }));

  return baseRows.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

function bonusByUser() {
  const bonus = new Map();
  const days = [...new Set(state.matches.map((match) => match.matchday).filter(Boolean))];
  days.forEach((day) => {
    const matches = state.matches.filter((match) => match.matchday === day && hasResult(match));
    if (matches.length === 0) return;
    const scores = state.users.map((user) => ({
      id: user.id,
      points: matches.reduce((sum, match) => sum + pointsFor(match, user.id), 0),
    }));
    const best = Math.max(...scores.map((row) => row.points));
    if (best <= 0) return;
    scores.filter((row) => row.points === best).forEach((row) => {
      bonus.set(row.id, (bonus.get(row.id) ?? 0) + 3);
    });
  });
  return bonus;
}

function leaderboardDays() {
  return [...new Set(state.matches.filter(isMatchdayVisible).map((match) => match.matchday).filter(Boolean))].sort((a, b) => b - a);
}

function isMatchdayVisible(match) {
  if (!match.matchday) return false;
  if (state.testMode && match.status === "TEST") return hasResult(match);
  return isMatchLocked(match);
}

function matchdayDetailFor(userId, day) {
  const matches = state.matches.filter((match) => match.matchday === day && hasResult(match));
  const points = matches.reduce((sum, match) => sum + pointsFor(match, userId), 0);
  const allScores = state.users.map((user) => matches.reduce((sum, match) => sum + pointsFor(match, user.id), 0));
  const best = allScores.length ? Math.max(...allScores) : 0;
  const winner = best > 0 && points === best;
  const winnerBonus = winner ? 3 : 0;
  const cards = matchdayCardDetailFor(userId, day);
  const total = points + winnerBonus - cards.penaltyPoints;
  const detailParts = [`${points}+${winnerBonus}`];
  if (cards.penaltyPoints) detailParts.push(`-${cards.penaltyPoints}`);
  return {
    day,
    points,
    winner,
    winnerBonus,
    ...cards,
    total,
    html: total !== 0 || cards.missedPredictions ? `<strong>${total} pts</strong><span>${detailParts.join("")}</span>` : "-",
  };
}

function matchdayDetailsFor(userId) {
  return leaderboardDays().map((day) => matchdayDetailFor(userId, day)).filter((detail) => detail.points > 0 || detail.winner);
}

function seasonBonusDetailsFor(userId) {
  const available = seasonBonusCategories.some((category) => Boolean(state.seasonBonus.official[category.id]));
  return { available, points: seasonBonusPointsFor(userId) };
}

function playerStatsFor(userId) {
  const resultMatches = state.matches.filter((match) => hasResult(match));
  const predictedMatches = resultMatches.filter((match) => hasScore(match.predictions[userId]));
  const matchPoints = resultMatches.reduce((sum, match) => sum + pointsFor(match, userId), 0);
  const dayWins = matchdayDetailsFor(userId).filter((detail) => detail.winner).length;
  const seasonBonus = seasonBonusPointsFor(userId);
  const cards = cardSummaryFor(userId);
  const exactScores = predictedMatches.filter((match) => {
    const prediction = match.predictions[userId];
    return Number(match.result.a) === Number(prediction.a) && Number(match.result.b) === Number(prediction.b);
  }).length;
  const goodResults = predictedMatches.filter((match) => {
    const prediction = match.predictions[userId];
    return outcome(Number(match.result.a), Number(match.result.b)) === outcome(Number(prediction.a), Number(prediction.b));
  }).length;

  return {
    predictions: predictedMatches.length,
    exactScores,
    goodResults,
    dayWins,
    ...cards,
    matchPoints,
    seasonBonus,
    total: matchPoints + seasonBonus + dayWins * 3 - cards.penaltyPoints,
    average: predictedMatches.length ? (matchPoints / predictedMatches.length).toFixed(1) : "0.0",
  };
}

function cardSummaryFor(userId) {
  return cardStateFor(userId).summary;
}

function matchdayCardDetailFor(userId, day) {
  return cardStateFor(userId).days.get(day) || emptyCardDetail();
}

function cardStateFor(userId) {
  const days = new Map();
  const summary = { missedPredictions: 0, yellowCards: 0, redCards: 0, penaltyPoints: 0 };
  let pendingYellow = 0;

  cardDays().forEach((day) => {
    const countableMatches = state.matches.filter((match) => match.matchday === day && isCardCountableMatch(match));
    const missedPredictions = countableMatches.filter((match) => !hasScore(match.predictions[userId])).length;
    const availableYellows = pendingYellow + missedPredictions;
    const redCards = Math.min(1, Math.floor(availableYellows / 2));
    pendingYellow = Math.min(1, Math.max(0, availableYellows - redCards * 2));
    const detail = {
      missedPredictions,
      yellowCards: pendingYellow,
      redCards,
      penaltyPoints: redCards * 2,
    };
    days.set(day, detail);
    summary.missedPredictions += detail.missedPredictions;
    summary.redCards += detail.redCards;
    summary.penaltyPoints += detail.penaltyPoints;
  });

  summary.yellowCards = pendingYellow;
  return { days, summary };
}

function cardDays() {
  return [...new Set(state.matches.filter(isMatchdayVisible).map((match) => match.matchday).filter(Boolean))]
    .sort((a, b) => a - b);
}

function isCardCountableMatch(match) {
  if (state.testMode && match.status === "TEST") return hasResult(match);
  return isMatchLocked(match);
}

function emptyCardDetail() {
  return { missedPredictions: 0, yellowCards: 0, redCards: 0, penaltyPoints: 0 };
}

function cardBadgesFor(userId) {
  const cards = cardSummaryFor(userId);
  const box = document.createElement("span");
  box.className = "card-badges";
  if (cards.yellowCards) box.append(cardBadge("yellow", cards.yellowCards));
  if (cards.redCards) box.append(cardBadge("red", cards.redCards));
  return box;
}

function cardBadge(type, count) {
  const badge = document.createElement("span");
  badge.className = `card-badge ${type}`;
  badge.title = type === "red" ? `${count} carton rouge` : `${count} carton jaune`;
  badge.textContent = count > 1 ? String(count) : "";
  return badge;
}

function seasonBonusPointsFor(userId) {
  return seasonBonusCategories.reduce((sum, category) => sum + seasonBonusCategoryPoints(userId, category), 0);
}

function seasonBonusCategoryPoints(userId, category) {
  const prediction = state.seasonBonus.predictions[userId]?.[category.id] ?? "";
  const official = state.seasonBonus.official[category.id] ?? "";
  if (!prediction || !official) return 0;
  if (individualBonusIds.has(category.id)) {
    return individualBonusMatchesOfficial(prediction, official) ? category.points : 0;
  }
  return same(prediction, official) ? category.points : 0;
}

function individualBonusMatchesOfficial(prediction, official) {
  const { player } = splitBonusIndividualValue(prediction);
  const officialParts = splitBonusIndividualValue(official);
  const officialPlayer = officialParts.player || official;
  return Boolean(player && (same(player, officialPlayer) || same(player, official)));
}

function pointsFor(match, userId) {
  if (!hasResult(match)) return 0;
  const prediction = match.predictions[userId];
  if (!hasScore(prediction)) return 0;

  const resultA = Number(match.result.a);
  const resultB = Number(match.result.b);
  const predA = Number(prediction.a);
  const predB = Number(prediction.b);
  const exactScore = resultA === predA && resultB === predB;
  const sameOutcome = outcome(resultA, resultB) === outcome(predA, predB);
  const sameDiff = resultA - resultB === predA - predB;

  if (exactScore) return 6;

  let points = 0;
  if (resultA === predA) points += 1;
  if (resultB === predB) points += 1;
  if (sameOutcome) points += 2;
  if (sameDiff) points += 2;
  return points;
}

function updatePrediction(matchId, userId, side, value) {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) return;
  if (isMatchLocked(match) && !(state.testMode && match.status === "TEST")) {
    alert("Les pronostics sont verrouillés après le début du match.");
    render();
    return;
  }
  match.predictions[userId] = match.predictions[userId] ?? { a: "", b: "" };
  match.predictions[userId][side] = value;
  match.predictions[userId][`${side}UpdatedAt`] = Date.now();
  setRemoteStatus("Prono modifié...");
  persist();
}

function removeUser(userId) {
  if (!requireAdmin()) return;
  const user = state.users.find((item) => item.id === userId);
  markDeletedUser(user);
  state.users = state.users.filter((user) => user.id !== userId);
  state.matches.forEach((match) => delete match.predictions[userId]);
  delete state.seasonBonus.predictions[userId];
  if (currentUserId === userId) setCurrentUser(null);
  persist();
}

function removeMatch(matchId) {
  if (!requireAdmin()) return;
  state.matches = state.matches.filter((match) => match.id !== matchId);
  persist();
}

async function applyTestMode() {
  if (!currentUser()) {
    alert("Connecte-toi pour lancer le mode test.");
    return;
  }
  const matches = await ensureTestMatches();

  if (matches.length === 0) {
    alert("Aucun match de test disponible depuis l'API.");
    return;
  }

  const fakeScores = [
    { a: "1", b: "1" },
    { a: "0", b: "2" },
    { a: "3", b: "2" },
    { a: "2", b: "0" },
    { a: "1", b: "2" },
  ];

  matches.forEach((match, index) => {
    if (String(match.externalId ?? "").startsWith("test-")) {
      const testDate = new Date(Date.now() + (index + 1) * 60 * 60 * 1000);
      match.date = testDate.toISOString();
    }
    if (!hasScore(match.result)) match.result = fakeScores[index] ?? { a: "1", b: "0" };
    match.status = "TEST";
  });

  applyTestSeasonBonus();
  state.testMode = true;
  localStorage.setItem(testModeStorageKey, "true");
  const hasApiFinal = matches.some((match) => match.externalId === "test-world-cup-final-2022");
  setStatus(hasApiFinal
    ? "Mode test activé : finale Coupe du monde chargée depuis l'API."
    : "Mode test activé, mais la finale Coupe du monde n'a pas été fournie par l'API.");
  persist();
}

function applyTestSeasonBonus() {
  const official = {
    champion: "Arsenal",
    bestAttack: "Manchester City",
    bestDefense: "Liverpool",
    topScorer: "Erling Haaland",
    bestAssister: "Kevin De Bruyne",
    goldenGloves: "Alisson",
    bestPlayer: "Bukayo Saka",
  };
  const alternatives = {
    champion: "Liverpool",
    bestAttack: "Arsenal",
    bestDefense: "Chelsea",
    topScorer: "Mohamed Salah",
    bestAssister: "Bruno Fernandes",
    goldenGloves: "David Raya",
    bestPlayer: "Cole Palmer",
  };

  state.seasonBonus.official = { ...state.seasonBonus.official, ...official };
  state.users.forEach((user, userIndex) => {
    state.seasonBonus.predictions[user.id] = state.seasonBonus.predictions[user.id] ?? {};
    seasonBonusCategories.forEach((category, categoryIndex) => {
      if (!state.seasonBonus.predictions[user.id][category.id]) {
        state.seasonBonus.predictions[user.id][category.id] =
          (userIndex + categoryIndex) % 2 === 0 ? official[category.id] : alternatives[category.id];
      }
    });
  });
}

async function ensureTestMatches() {
  const existing = state.matches.filter((match) => match.status === "TEST");
  if (existing.length >= 6 && existing.some((match) => match.externalId === "test-world-cup-final-2022")) {
    return existing.slice(0, 6);
  }
  const previous = new Map(existing.map((match) => [match.externalId, match]));
  state.matches = state.matches.filter((match) => match.status !== "TEST");
  const matches = await createTestMatches();
  matches.forEach((match) => {
    const oldMatch = previous.get(match.externalId);
    if (oldMatch) match.predictions = oldMatch.predictions ?? {};
  });
  return matches;
}

async function createTestMatches() {
  const kickoff = new Date(Date.now() + 60 * 60 * 1000);
  const apiFinal = await fetchWorldCupFinalTestMatch();
  const teams = [
    ["Chelsea", "Manchester United"],
    ["Tottenham", "Manchester City"],
    ["Everton", "Newcastle"],
    ["Aston Villa", "West Ham"],
    ["Brighton", "Fulham"],
  ];

  const matches = teams.map(([teamA, teamB], index) => ({
    id: crypto.randomUUID(),
    externalId: `test-${index + 2}`,
    teamA,
    teamB,
    date: new Date(kickoff.getTime() + (index + 1) * 60 * 60 * 1000).toISOString(),
    matchday: index < 2 ? 1 : 2,
    status: "TEST",
    result: { a: "", b: "" },
    predictions: {},
  }));

  if (apiFinal) matches.unshift(apiFinal);
  state.matches.push(...matches);
  return matches;
}

async function fetchWorldCupFinalTestMatch() {
  if (location.protocol === "file:") return null;
  try {
    setStatus("Récupération finale Coupe du monde depuis l'API...");
    const response = await fetch("/api/test-match?competition=WC&season=2022&stage=FINAL", { cache: "no-store" });
    if (!response.ok) throw new Error(`Erreur API ${response.status}`);
    const data = await response.json();
    const match = data.match;
    if (!match) throw new Error("Aucun match API");
    const testMatch = fromApiMatch({ ...match, matchday: 1 });
    return {
      ...testMatch,
      id: "test-world-cup-final-2022",
      externalId: "test-world-cup-final-2022",
      status: "TEST",
      date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      predictions: testMatch.predictions ?? {},
    };
  } catch (error) {
    console.error(error);
    setStatus("Finale Coupe du monde indisponible via l'API. Vérifie l'accès football-data WC.");
    return null;
  }
}

function firstMatchday() {
  const days = state.matches.map((match) => match.matchday).filter((day) => day !== null && day !== undefined);
  return days.length ? Math.min(...days) : null;
}

function upsertMatch(nextMatch) {
  const existing = state.matches.find((match) => {
    return (nextMatch.externalId && match.externalId === nextMatch.externalId) || match.id === nextMatch.id;
  });

  if (!existing) {
    state.matches.push(nextMatch);
    return;
  }

  Object.assign(existing, nextMatch, {
    predictions: existing.predictions ?? {},
  });
}

function filteredMatches() {
  const filter = state.matchdayFilter ?? "all";
  return sortedMatches().filter((match) => filter === "all" || String(match.matchday) === filter);
}

function sortedMatches() {
  return [...state.matches].sort((a, b) => {
    if ((a.matchday ?? 999) !== (b.matchday ?? 999)) return (a.matchday ?? 999) - (b.matchday ?? 999);
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });
}

function matchMeta(match) {
  const parts = [];
  if (match.matchday) parts.push(`Journée ${match.matchday}`);
  parts.push(formatDate(match.date));
  if (match.status) parts.push(match.status);
  return parts.join(" · ");
}

function officialScoreLabel(match) {
  if (!hasResult(match)) return "En attente API";
  return `${match.result.a} - ${match.result.b}`;
}

function isMatchLocked(match) {
  if (!match.date) return false;
  const kickoff = new Date(match.date);
  if (Number.isNaN(kickoff.getTime())) return false;
  return Date.now() >= kickoff.getTime();
}

function isSeasonLocked() {
  const firstMatch = sortedMatches().find((match) => match.date);
  return firstMatch ? isMatchLocked(firstMatch) : false;
}

function currentUser() {
  return state.users.find((user) => user.id === currentUserId) ?? null;
}

function setCurrentUser(userId) {
  currentUserId = userId;
  if (userId) {
    localStorage.setItem(sessionUserStorageKey, userId);
  } else {
    localStorage.removeItem(sessionUserStorageKey);
  }
}

function renderAvatarPanel(user) {
  els.avatarPanel.hidden = !user;
  els.avatarPreview.innerHTML = "";
  if (user) els.avatarPreview.append(avatarNode(user, "large"));
}

function avatarNode(user, size = "") {
  const avatar = document.createElement(user?.avatar ? "img" : "span");
  avatar.className = `avatar ${size}`.trim();
  if (user?.avatar) {
    avatar.src = user.avatar;
    avatar.alt = `Photo de ${user.name}`;
  } else {
    avatar.textContent = initials(user?.name);
    avatar.setAttribute("aria-hidden", "true");
  }
  return avatar;
}

function initials(name = "") {
  const cleaned = clean(name);
  return cleaned ? cleaned.slice(0, 2).toLocaleUpperCase("fr") : "?";
}

function avatarFromFile(file) {
  if (!file) return Promise.resolve("");
  if (!file.type.startsWith("image/")) return Promise.reject(new Error("Format image invalide"));
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      image.onload = () => {
        const size = 160;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = Math.max(0, Math.round((image.naturalWidth - sourceSize) / 2));
        const sourceY = Math.max(0, Math.round((image.naturalHeight - sourceSize) / 2));
        canvas.width = size;
        canvas.height = size;
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isAdmin() {
  const user = currentUser();
  return Boolean(user && same(user.name, adminName));
}

function requireAdmin() {
  if (isAdmin()) return true;
  alert("Action réservée à Norbert.");
  return false;
}

function hasResult(match) {
  return hasScore(match?.result);
}

function hasScore(score) {
  return score && score.a !== "" && score.b !== "" && score.a !== null && score.b !== null;
}

function persist() {
  lastLocalChangeAt = Date.now();
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();
  queueRemoteSave();
}

function persistLocalOnly() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();
}

function queueRemoteSave() {
  if (location.protocol === "file:") return;
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = setTimeout(() => saveRemoteState(), 250);
}

async function saveRemoteState() {
  try {
    setRemoteStatus("Envoi...");
    const response = await fetch("/api/state", {
      method: "PUT",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: stateForRemote() }),
    });
    if (!response.ok) {
      setRemoteStatus(await errorLabel(response));
      return;
    }
    const payload = await response.json();
    if (!payload.state) {
      setRemoteStatus("Serveur vide");
      return;
    }
    state = mergeClientStates(state, migrateState(payload.state));
    localStorage.setItem(storageKey, JSON.stringify(state));
    render();
    setRemoteStatus(`Synchro OK · ${state.users.length} joueur${state.users.length > 1 ? "s" : ""}`);
  } catch (error) {
    setRemoteStatus("Erreur synchro");
    console.error(error);
  }
}

async function loadRemoteState(force = false) {
  if (location.protocol === "file:") return;
  if (!force && Date.now() - lastLocalChangeAt < 2000) return;
  if (!force && isEditingField()) return;
  try {
    setRemoteStatus("Lecture...");
    const response = await fetch(`/api/state?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      setRemoteStatus(await errorLabel(response));
      return;
    }
    const payload = await response.json();
    if (!payload.state) {
      await saveRemoteState();
      return;
    }
    const wasTesting = state.testMode || localStorage.getItem(testModeStorageKey) === "true";
    const testMatches = state.matches.filter((match) => match.status === "TEST");
    state = mergeClientStates(state, migrateState(payload.state));
    if (wasTesting) {
      state.testMode = true;
      const existingIds = new Set(state.matches.map((match) => match.externalId || match.id));
      testMatches.forEach((match) => {
        const key = match.externalId || match.id;
        if (!existingIds.has(key)) state.matches.push(match);
      });
    }
    localStorage.setItem(storageKey, JSON.stringify(state));
    render();
    setRemoteStatus(`Synchro OK · ${state.users.length} joueur${state.users.length > 1 ? "s" : ""}`);
  } catch (error) {
    setRemoteStatus("Erreur synchro");
    console.error(error);
  }
}

async function forceRemoteSync() {
  if (location.protocol === "file:") {
    setRemoteStatus("Serveur requis");
    return;
  }
  await loadRemoteState(true);
  await saveRemoteState();
}

function startRemoteRefresh() {
  if (location.protocol === "file:" || remoteRefreshTimer) return;
  remoteRefreshTimer = setInterval(() => loadRemoteState(), 5000);
  window.addEventListener("focus", () => loadRemoteState(true));
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) loadRemoteState(true);
  });
}

function isEditingField() {
  return ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName);
}

function stateForRemote() {
  const copy = structuredClone(state);
  delete copy.currentUserId;
  return copy;
}

function mergeClientStates(localState, remoteState) {
  const deletedUsers = mergeClientDeletedUsers(remoteState.deletedUsers, localState.deletedUsers);
  const userMerge = mergeClientUsers(remoteState.users, localState.users, deletedUsers);
  if (currentUserId && userMerge.aliases[currentUserId]) setCurrentUser(userMerge.aliases[currentUserId]);
  if (currentUserId && userMerge.aliases[currentUserId] === null) setCurrentUser(null);
  return {
    ...remoteState,
    ...localState,
    deletedUsers,
    users: userMerge.users,
    matches: mergeClientMatches(remoteState.matches, localState.matches, userMerge.aliases, deletedUsers),
    playersByTeam: mergePlayersByTeam(remoteState.playersByTeam, localState.playersByTeam),
    seasonBonus: mergeClientSeasonBonus(remoteState.seasonBonus, localState.seasonBonus, userMerge.aliases, deletedUsers),
  };
}

function mergePlayersByTeam(remotePlayers = {}, localPlayers = {}) {
  return normalizePlayersByTeam({ ...(remotePlayers || {}), ...(localPlayers || {}) });
}

function mergeClientUsers(remoteUsers = [], localUsers = [], deletedUsers = {}) {
  const usersById = new Map();
  const idByName = new Map();
  const aliases = {};
  [...remoteUsers, ...localUsers].forEach((user) => {
    if (!user?.id) return;
    const nameKey = normalizeName(user.name);
    if (isDeletedUser(user, deletedUsers)) {
      aliases[user.id] = null;
      return;
    }
    const canonicalId = nameKey ? idByName.get(nameKey) : null;
    if (canonicalId) {
      aliases[user.id] = canonicalId;
      usersById.set(canonicalId, { ...(usersById.get(canonicalId) || {}), ...user, id: canonicalId });
      return;
    }
    if (nameKey) idByName.set(nameKey, user.id);
    usersById.set(user.id, { ...(usersById.get(user.id) || {}), ...user });
  });
  return { users: [...usersById.values()], aliases };
}

function mergeClientMatches(remoteMatches = [], localMatches = [], aliases = {}, deletedUsers = {}) {
  const matches = new Map();
  [...remoteMatches, ...localMatches].forEach((match) => {
    const key = match?.externalId || match?.id;
    if (!key) return;
    const previous = matches.get(key) || {};
    matches.set(key, {
      ...previous,
      ...match,
      predictions: mergeClientPredictions(previous.predictions, match.predictions, aliases, deletedUsers),
    });
  });
  return [...matches.values()];
}

function mergeClientPredictions(previousPredictions = {}, nextPredictions = {}, aliases = {}, deletedUsers = {}) {
  const predictions = {};
  [previousPredictions, nextPredictions].forEach((source) => {
    Object.entries(source || {}).forEach(([userId, prediction]) => {
      addClientPrediction(predictions, userId, prediction, aliases, deletedUsers);
    });
  });
  return predictions;
}

function addClientPrediction(predictions, userId, prediction, aliases = {}, deletedUsers = {}) {
    if (aliases[userId] === null || deletedUsers?.ids?.[userId]) return;
    const canonicalId = aliases[userId] || userId;
    if (deletedUsers?.ids?.[canonicalId]) return;
    const previous = predictions[canonicalId] || predictions[userId] || {};
    predictions[canonicalId] = {
      ...previous,
      ...prediction,
      a: newestPredictionValue(previous, prediction, "a"),
      b: newestPredictionValue(previous, prediction, "b"),
      aUpdatedAt: Math.max(Number(previous.aUpdatedAt) || 0, Number(prediction?.aUpdatedAt) || 0),
      bUpdatedAt: Math.max(Number(previous.bUpdatedAt) || 0, Number(prediction?.bUpdatedAt) || 0),
    };
    if (canonicalId !== userId) delete predictions[userId];
}

function newestPredictionValue(previous = {}, prediction = {}, side) {
  const nextValue = prediction?.[side];
  if (nextValue === "" || nextValue === undefined) return previous[side] ?? "";
  const previousValue = previous?.[side];
  if (previousValue === "" || previousValue === undefined) return nextValue;
  const previousTime = Number(previous?.[`${side}UpdatedAt`]) || 0;
  const nextTime = Number(prediction?.[`${side}UpdatedAt`]) || 0;
  if (!previousTime && !nextTime) return previousValue;
  return nextTime >= previousTime ? nextValue : previousValue;
}

function mergeClientSeasonBonus(remoteBonus = {}, localBonus = {}, aliases = {}, deletedUsers = {}) {
  return {
    official: {
      ...(remoteBonus.official || {}),
      ...(localBonus.official || {}),
    },
    predictions: mergeClientBonusPredictions(remoteBonus.predictions, localBonus.predictions, aliases, deletedUsers),
  };
}

function mergeClientBonusPredictions(remotePredictions = {}, localPredictions = {}, aliases = {}, deletedUsers = {}) {
  const predictions = {};
  [remotePredictions, localPredictions].forEach((source) => {
    Object.entries(source || {}).forEach(([userId, bonus]) => {
      if (aliases[userId] === null || deletedUsers?.ids?.[userId]) return;
      const canonicalId = aliases[userId] || userId;
      if (deletedUsers?.ids?.[canonicalId]) return;
      predictions[canonicalId] = { ...(predictions[canonicalId] || {}), ...bonus };
    });
  });
  return predictions;
}

function markDeletedUser(user) {
  if (!user?.id) return;
  state.deletedUsers = normalizeDeletedUsers(state.deletedUsers);
  state.deletedUsers.ids[user.id] = Date.now();
  const nameKey = normalizeName(user.name);
  if (nameKey) state.deletedUsers.names[nameKey] = Date.now();
}

function mergeClientDeletedUsers(remoteDeleted = {}, localDeleted = {}) {
  const remote = normalizeDeletedUsers(remoteDeleted);
  const local = normalizeDeletedUsers(localDeleted);
  return {
    ids: mergeTimestampMaps(remote.ids, local.ids),
    names: mergeTimestampMaps(remote.names, local.names),
  };
}

function normalizeDeletedUsers(deletedUsers = {}) {
  return {
    ids: { ...(deletedUsers.ids || {}) },
    names: { ...(deletedUsers.names || {}) },
  };
}

function mergeTimestampMaps(a = {}, b = {}) {
  const result = { ...a };
  Object.entries(b).forEach(([key, value]) => {
    result[key] = Math.max(Number(result[key]) || 0, Number(value) || 0);
  });
  return result;
}

function isDeletedUser(user, deletedUsers = {}) {
  const deletedByNameAt = Number(deletedUsers.names?.[normalizeName(user.name)]) || 0;
  const createdAt = Number(user.createdAt) || 0;
  return Boolean(deletedUsers.ids?.[user.id] || (deletedByNameAt && (!createdAt || createdAt <= deletedByNameAt)));
}

function normalizeName(name = "") {
  return String(name).trim().toLocaleLowerCase("fr");
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored) return stored;
  } catch {
    localStorage.removeItem(storageKey);
  }
  return structuredClone(defaultState);
}

function migrateState(raw) {
  const next = structuredClone(defaultState);
  if (Array.isArray(raw.users)) next.users = raw.users;
  if (Array.isArray(raw.friends)) {
    next.users = raw.friends.map((friend) => ({ ...friend, pin: friend.pin ?? "1234" }));
  }
  if (Array.isArray(raw.matches)) next.matches = raw.matches.map((match) => ({
    id: match.id ?? crypto.randomUUID(),
    externalId: match.externalId ?? null,
    teamA: match.teamA,
    teamB: match.teamB,
    date: match.date ?? "",
    matchday: match.matchday ?? null,
    status: match.status ?? "SCHEDULED",
    result: match.result ?? { a: "", b: "" },
    predictions: match.predictions ?? {},
  }));
  next.seasonBonus = {
    official: raw.seasonBonus?.official ?? {},
    predictions: raw.seasonBonus?.predictions ?? {},
  };
  next.deletedUsers = normalizeDeletedUsers(raw.deletedUsers);
  next.playersByTeam = normalizePlayersByTeam(raw.playersByTeam);
  next.currentUserId = raw.currentUserId ?? null;
  next.matchdayFilter = raw.matchdayFilter ?? "all";
  next.lastSync = raw.lastSync ?? null;
  next.testMode = Boolean(raw.testMode) || localStorage.getItem(testModeStorageKey) === "true";
  return next;
}

function normalizePlayersByTeam(playersByTeam = {}) {
  const normalized = {};
  Object.entries(playersByTeam || {}).forEach(([team, players]) => {
    if (!team) return;
    normalized[team] = [...new Set((Array.isArray(players) ? players : []).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "fr"));
  });
  return normalized;
}

function scoreInput(value) {
  const select = document.createElement("select");
  select.className = "score-select";
  select.setAttribute("aria-label", "Score");

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "-";
  select.append(emptyOption);

  for (let score = 0; score <= 10; score += 1) {
    const option = document.createElement("option");
    option.value = String(score);
    option.textContent = String(score);
    select.append(option);
  }

  select.value = value ?? "";
  return select;
}

function formatDate(value) {
  if (!value) return "Date à définir";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toInputDate(date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function outcome(a, b) {
  if (a === b) return "draw";
  return a > b ? "home" : "away";
}

function clean(value) {
  return value.trim().replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function same(a, b) {
  return a.localeCompare(b, "fr", { sensitivity: "base" }) === 0;
}

function setStatus(message) {
  els.syncStatus.textContent = message;
}

function setRemoteStatus(message) {
  if (els.remoteStatus) els.remoteStatus.textContent = message;
}

async function errorLabel(response) {
  try {
    const payload = await response.json();
    const detail = payload.detail ? ` · ${payload.detail}` : "";
    return shorten(`Erreur ${response.status}: ${payload.error || "synchro"}${detail}`, 260);
  } catch {
    return `Erreur ${response.status}: synchro`;
  }
}

function shorten(text, maxLength) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  });
}

render();
startCountdown();
ensurePlayersLoaded();
ensureAutoSync();
loadRemoteState();
startRemoteRefresh();
