<?php

/* $config = require dirname(__FILE__).'/../config/config.php'; */

$nonce = bin2hex(random_bytes(32));

//a similar but weaker(*) csp policy should be included by apache before this one
//(*): multile csps headers are not prioritized by order, they are merged. stricter proprties overwrite the others
header("Content-Security-Policy: block-all-mixed-content; default-src 'none'; connect-src 'self'; script-src 'unsafe-inline' 'strict-dynamic' 'nonce-$nonce'; style-src 'unsafe-inline' 'self'; font-src 'self'; img-src 'self' data:; frame-ancestors 'none'; navigate-to 'self'; form-action 'self'; script-src-attr 'none'; style-src-attr 'none'; worker-src 'none';");

class SecurityHeaders{
  public static function getNonce(){
    global $nonce;
    return $nonce;
  }
}
