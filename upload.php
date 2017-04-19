<?php
if (isset($_FILES["htmlFile"])) {
    $uploaddir = 'files/';

    $fileName = date('m-d-Y-H-i-s-').rand().".txt";
    $uploadfile = $uploaddir . $fileName;

    if (move_uploaded_file($_FILES['htmlFile']['tmp_name'], $uploadfile)) {
        echo $fileName;
    } else {
        echo "false";
    }
}

if (isset($_POST["delete"])) {
    unlink($_POST["delete"]);
    echo "ok";
}

?>
