angular.module('english',[])
.controller('randomwords', ['$scope', function($scope) {

    $scope.words = [];
    $scope.whatWord = "";
    $scope.allWordsStats = [];
    var saveWords = [];
    var saveWordsLoose = [];

    $scope.loadFile = function() {
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
                document.getElementById('whatWord').innerHTML = $scope.whatWord.english;
            }else {
                $scope.whatWord.loose = 'danger';
                saveWordsLoose.push($scope.whatWord);
                $scope.allWordsStats.push($scope.whatWord);
                finishWord();
            }
        }else {
            document.getElementById('whatWord').innerHTML = "Veuillez importer un nouveau fichier.";
        }
    }

    $scope.testWord = function() {
        if ($scope.whatWord) {
            if ($scope.wordTest == $scope.whatWord.french) {
                $scope.whatWord.loose = 'success';
                $scope.allWordsStats.push($scope.whatWord);
                $scope.wordTest = "";
                finishWord();
            }
        }
    }

    $scope.resetParty = function() {
        angular.copy(saveWords,$scope.words)
        $scope.allWordsStats = [];
    }

    $scope.resetWithLooseWords = function() {
        angular.copy(saveWordsLoose,$scope.words)
        $scope.allWordsStats = [];
    }

    finishWord = function() {
        var index = $scope.words.findIndex(x => x.english == $scope.whatWord.english,y => y.french == $scope.whatWord.french);
        $scope.words.splice(index,1);
        $scope.newWord(0);
    }

}]);
