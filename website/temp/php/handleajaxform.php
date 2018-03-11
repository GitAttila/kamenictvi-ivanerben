<?php

header("Content-Type: application/json");

$result = array(
    "errors" => array(),
);

// provedu validaci
// posbiram chyby
if (strlen($_REQUEST["contact-name"]) == 0) {
    $result["errors"]["contact-name"] = "Must be filled out!";
}
if (!empty($_REQUEST["contact-phone"])) {
    if (!preg_match("/^\s*(?:\+?([-. (]*(\d{1,3})[-. )]*))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4}))\s*$/",$_REQUEST["contact-phone"])) {
        $result["errors"]["contact-phone"] = "Invalid phone number!";
    }
}
if (strlen($_REQUEST["contact-email"]) == 0) {
    $result["errors"]["contact-email"] = "Must be filled out!";
}else {
    if (!preg_match("/^.*@.*\\..*$/", $_REQUEST["contact-email"])) {
        $result["errors"]["contact-email"] = "Neplatný email";
    }
}
if (strlen($_REQUEST["contact-message"]) == 0) {
    $result["errors"]["contact-message"] = "Must be filled out!";
}

if (strlen($_REQUEST["contact-message"]) > 1000) {
    $result["errors"]["contact-message"] = "Your message has exceeded maximum allowed number of 1000 characters!";
}


if (count($result["errors"]) == 0) {
    $userFormHistory = array();
    if (file_exists("userFormHistory.json")) {
        $userFormHistory = json_decode(file_get_contents("userFormHistory.json"), true);
    }

    $ip = $_SERVER["REMOTE_ADDR"];
    if (!array_key_exists($ip, $userFormHistory)) {
        $userFormHistory[$ip] = array();
    }
    $userFormHistory[$ip][] = time();

    // ulozime
    file_put_contents("userFormHistory.json", json_encode($userFormHistory));

    // zvalidujem
    $sendCount = 0;
    foreach ($userFormHistory[$ip] as $timestamp) {
        if ($timestamp > time() - 24*3600) {
            $sendCount++;
        }
    }

    if ($sendCount > 3) {
        $result["errors"]["contact-message"] = "It is not allowed to send more than 3 messages from within 24 hours.";
    }else {
        // form ok
        require 'PHPMailer/PHPMailerAutoload.php';

        $mail = new PHPMailer();

        //$mail->isSMTP();
        $mail->Host =''; // 'mail.primakurzy.cz';
        $mail->SMTPAuth ='';// true;
        $mail->Username ='';// 'student@primakurzy.cz';
        $mail->Password =''; // 'student';
        $mail->port=''; //25;
        $mail->setFrom($_REQUEST["contact-email"], $_REQUEST["contact-name"]);
        $mail->addAddress('info@kamenictvi-erben.cz'); //info@kamenictvi-erben.cz'
        $mail->isHTML(true);
        $mail->Subject = 'MESSAGE FROM WWW.KAMENICTVI-ERBEN.CZ'; //MESSAGE FROM WWW.KAMENICTVI-ERBEN.CZ
        $mail->Body    = sprintf("
            <table>
                <tr>
                    <th style='vertical-align:top'>Name:</th> <td>%s</td>
                </tr>
                <tr>
                    <th style='vertical-align:top'>Phone:</th> <td>%s</td>
                </tr>
                <tr>
                    <th style='vertical-align:top'>Email:</th> <td>%s</td>
                </tr>
                <tr>
                    <th style='vertical-align:top'>Message:</th> <td>%s</td>
                </tr>
            </table>
            ",
                $_REQUEST["contact-name"],
                $_REQUEST["contact-phone"],
                $_REQUEST["contact-email"],
                $_REQUEST["contact-message"]
        );

        $ok = $mail->send();
        if(!$ok) {
            $result["errors"]["contact-message"] = "Email could not be sent.";
        }
    }
}

// vypisu vysledek
echo json_encode($result);

?>
