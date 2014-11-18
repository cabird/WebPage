<?php
// Declare our variables
$name			= $_POST['name'];
$email		= $_POST['email'];
$subject	= $_POST['subject'];
$message	= nl2br($_POST['message']);

// Set a title for the message
$body			= "From $name, \n\n <br/> $message";
$headers	= '';
$headers	.= 'From: '.$email.'' . "\r\n" .'';
$headers	.= 'Reply-To: '.$email.'' . "\r\n" .'';
$headers	.= 'Content-type: text/html; charset=utf-8' . "\r\n" .'';
$headers	.= 'X-Mailer: PHP/' . phpversion();

// Put your email address here
if ( mail("YOUR_EMAIL@YOUR_DOMAIN", $subject, $body, $headers) ) {
	// Display a thank you message in the callback
	$msg= '';
	$msg.= '<h5>Thank you, '.$name.'!</h5>';
	$msg.= '<p>This is a test for you can see the contact form working.</p>';

	// BEGIN NEW CODE ----------------------------------------------
	// Send and email to your customer too
	$thanks= "From YOUR_NAME, \n\n <br/>I receive your e-mail and try reply as soon as possible. Thank you!";
	$headers= 'From: YOUR_EMAIL@YOUR_DOMAIN' . "\r\n" .
	'Reply-To: YOUR_EMAIL@YOUR_DOMAIN' . "\r\n" .
	'Content-type: text/html; charset=utf-8' . "\r\n" .
	'X-Mailer: PHP/' . phpversion();
	mail($email, $subject, $thanks, $headers);
// END NEW CODE ----------------------------------------------
} else {
	// Display an error message in the callback
	$msg  = '';
	$msg  .= '<h5>Ops...</h5>';
	$msg  .= '<p>We can\'t receive your messagem.</p>';
	$msg  .= '<p>Please, try again. Thank you!</p>';
}

echo $msg;
?>