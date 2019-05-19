angular.module('english',[])
.controller('randomwords', ['$scope', '$log', function($scope, $log) {
    $scope.words = [];
    $scope.whatWord = "";
    $scope.allWordsStats = [];
    $scope.lang = 0;
    $scope.randomLang = 0;
    var saveWords = [];
    var saveWordsLoose = [];

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
                        try {
                            $scope.words = JSON.parse(allText);
                            $scope.countWords = $scope.words.length;
                            saveWords = JSON.parse(allText);
                            $scope.allWordsStats = [];
                            $('.langRadio' + $scope.lang).removeClass("active");
                            $('.langRadio').addClass("disabled");
                            $scope.newWord(0);
                            notification("success", "Fichier importé avec succés.")
                        }
                        catch (e) {
                            notification("danger", "Problème avec le fichier, veuillez suivre les instructions.")
                        }
                    }
                }
            }

            rawFile.send(null);
        }

        $scope.newWord = function(pass) {
            if ($scope.words.length != 0) {
                if (pass == 0) {
                    $scope.whatWord = $scope.words[Math.floor(Math.random()*$scope.words.length)];
                    if ($scope.lang == 0) {
                        document.getElementById('whatWord').innerHTML = $scope.whatWord.english;
                    }

                    if ($scope.lang == 1) {
                        document.getElementById('whatWord').innerHTML = $scope.whatWord.french;
                    }

                    if ($scope.lang == 2) {
                        getRandomLang();
                        if ($scope.randomLang == 0) {
                            document.getElementById('whatWord').innerHTML = $scope.whatWord.french;
                        }else {
                            document.getElementById('whatWord').innerHTML = $scope.whatWord.english;
                        }
                    }
                }else {
                    // notification("danger", "Mot passé : " + $scope.whatWord.french + " -> " + $scope.whatWord.english)
                    $scope.whatWord.loose = 'danger';
                    saveWordsLoose.push($scope.whatWord);
                    $scope.allWordsStats.push($scope.whatWord);
                    finishWord();
                }
            }else {
                $('.langRadio').removeClass("disabled");
                $('.langRadio' + $scope.lang).addClass("active");
                document.getElementById('whatWord').innerHTML = "Veuillez importer un nouveau fichier.";
            }
        }

        $scope.testWord = function() {
            if ($scope.whatWord) {
                var successWord = 0;
                if ($scope.lang == 0) {
                    if ($scope.wordTest == $scope.whatWord.french) {
                        successWord = 1;
                    }
                }

                if ($scope.lang == 1) {
                    if ($scope.wordTest == $scope.whatWord.english) {
                        successWord = 1;
                    }
                }

                if ($scope.lang == 2) {
                    if ($scope.randomLang == 0) {
                        if ($scope.wordTest == $scope.whatWord.english) {
                            successWord = 1;
                        }
                    }else {
                        if ($scope.wordTest == $scope.whatWord.french) {
                            successWord = 1;
                        }
                    }
                }
                if (successWord == 1) {
                    // notification("success", "Mot trouvé : " + $scope.whatWord.french + " -> " + $scope.whatWord.english)
                    $scope.whatWord.loose = 'success';
                    $scope.allWordsStats.push($scope.whatWord);
                    finishWord();
                }
            }
        }

        $scope.resetParty = function() {
            angular.copy(saveWords,$scope.words)
            $scope.allWordsStats = [];
            $('.langRadio' + $scope.lang).removeClass("active");
            $('.langRadio').addClass("disabled");
            $scope.newWord(0);
        }

        $scope.resetWithLooseWords = function() {
            angular.copy(saveWordsLoose,$scope.words)
            $scope.allWordsStats = [];
            saveWordsLoose = [];
            $('.langRadio' + $scope.lang).removeClass("active");
            $('.langRadio').addClass("disabled");
            $scope.newWord(0);
        }

        $scope.changeLangWord = function(t) {
            $scope.lang = t;
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
            $scope.randomLang = Math.floor(Math.random() * 2);
        }

    }]);
