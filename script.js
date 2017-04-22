angular.module('english',[])
.controller('randomwords', ['$scope', function($scope) {

    $scope.words = [];
    $scope.whatWord = "";
    $scope.allWordsStats = [];
    var saveWords = [];
    var saveWordsLoose = [];
    var lang = 0;
    var randomLang = 0;

    $scope.loadFile = function() {
            notification("info", "Fichier en cours d'importation.")

            var xhr, form,resTopScore;

            var file = document.getElementById('file').files[0];

            xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php');

            form = new FormData();
            form.append('htmlFile',file);

            function handleLoad(evt)
            {
                resTopScore = evt;
                $scope.readTextFile("files/"+resTopScore.srcElement.responseText);
                deleteFile("files/"+resTopScore.srcElement.responseText);
                notification("info", "Fichier importé avec succés.")
            }

            function handleError(evt) {
            }

            xhr.addEventListener('load', handleLoad);
            xhr.addEventListener('error', handleError);
            xhr.send(form);
        }

        function deleteFile(fileName) {
            var xhr, form,resTopScore;

            xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php');

            form = new FormData();
            form.append('delete',fileName);

            function handleLoad(evt)
            {
                console.log(resTopScore);
            }

            function handleError(evt) {
            }

            xhr.addEventListener('load', handleLoad);
            xhr.addEventListener('error', handleError);
            xhr.send(form);
        }

        $scope.readTextFile = function(file)
        {
            var rawFile = new XMLHttpRequest();

            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function (){
                if(rawFile.readyState === 4){
                    if(rawFile.status === 200 || rawFile.status == 0){
                        var allText = rawFile.responseText;
                        $scope.words = JSON.parse(allText);
                        saveWords = JSON.parse(allText);
                        $scope.allWordsStats = [];
                        $('.langRadio' + lang).removeClass("active");
                        $('.langRadio').addClass("disabled");
                        $scope.newWord(0);
                    }
                }
            }
            rawFile.send(null);
        }

        $scope.newWord = function(pass) {
            if ($scope.words.length != 0) {
                if (pass == 0) {
                    $scope.whatWord = $scope.words[Math.floor(Math.random()*$scope.words.length)];
                    if (lang == 0) {
                        document.getElementById('whatWord').innerHTML = $scope.whatWord.english;
                    }

                    if (lang == 1) {
                        document.getElementById('whatWord').innerHTML = $scope.whatWord.french;
                    }

                    if (lang == 2) {
                        getRandomLang();
                        if (randomLang == 0) {
                            document.getElementById('whatWord').innerHTML = $scope.whatWord.french;
                        }else {
                            document.getElementById('whatWord').innerHTML = $scope.whatWord.english;
                        }
                    }
                }else {
                    notification("danger", "Mot passé : " + $scope.whatWord.french + " -> " + $scope.whatWord.english)
                    $scope.whatWord.loose = 'danger';
                    saveWordsLoose.push($scope.whatWord);
                    $scope.allWordsStats.push($scope.whatWord);
                    finishWord();
                }
            }else {
                $('.langRadio').removeClass("disabled");
                $('.langRadio' + lang).addClass("active");
                document.getElementById('whatWord').innerHTML = "Veuillez importer un nouveau fichier.";
            }
        }

        $scope.testWord = function() {
            if ($scope.whatWord) {
                var successWord = 0;
                if (lang == 0) {
                    if ($scope.wordTest == $scope.whatWord.french) {
                        successWord = 1;
                    }
                }

                if (lang == 1) {
                    if ($scope.wordTest == $scope.whatWord.english) {
                        successWord = 1;
                    }
                }

                if (lang == 2) {
                    if (randomLang == 0) {
                        if ($scope.wordTest == $scope.whatWord.french) {
                            successWord = 1;
                        }
                    }else {
                        if ($scope.wordTest == $scope.whatWord.english) {
                            successWord = 1;
                        }
                    }
                }
                if (successWord == 1) {
                    notification("success", "Mot trouvé : " + $scope.whatWord.french + " -> " + $scope.whatWord.english)
                    $scope.whatWord.loose = 'success';
                    $scope.allWordsStats.push($scope.whatWord);
                    finishWord();
                }
            }
        }

        $scope.resetParty = function() {
            angular.copy(saveWords,$scope.words)
            $scope.allWordsStats = [];
            $('.langRadio' + lang).removeClass("active");
            $('.langRadio').addClass("disabled");
            $scope.newWord(0);
        }

        $scope.resetWithLooseWords = function() {
            angular.copy(saveWordsLoose,$scope.words)
            $scope.allWordsStats = [];
            saveWordsLoose = [];
            $('.langRadio' + lang).removeClass("active");
            $('.langRadio').addClass("disabled");
            $scope.newWord(0);
        }

        $scope.changeLangWord = function(t) {
            lang = t;
        }

        finishWord = function() {
            var index = $scope.words.findIndex(x => x.english == $scope.whatWord.english,y => y.french == $scope.whatWord.french);
            $scope.words.splice(index,1);
            $scope.newWord(0);
            $scope.wordTest = "";
        }

        function notification(type,message) {
            $.notify({
                // options
                icon: 'glyphicon glyphicon-' + type + '-sign',
                message: message,
            },{
                // settings
                element: 'body',
                position: null,
                type: type,
                allow_dismiss: true,
                newest_on_top: false,
                showProgressbar: false,
                placement: {
                    from: "top",
                    align: "right"
                }});
        }

        function getRandomLang(){
            randomLang = Math.floor(Math.random() * 2);
        }

    }]);
