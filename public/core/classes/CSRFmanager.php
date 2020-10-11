<?php

class CSRFmanager{
  public static function regenerate(){
    //TODO: Research: Is this needed? can i generate a
    //token when it is requested and it doesnt exist without security problems?
    /* if(isset($_SESSION['CSRF'])){ */
    /*   throw new Exception('csrf token already generated'); */
    /*   return 0; */
    /* } */
    $_SESSION['CSRF'] = bin2hex(random_bytes(32));
  }

  public static function getToken(){
    if(!isset($_SESSION['CSRF'])){
      self::generate();
    }
    return $_SESSION['CSRF'];
  }

  public static function validate(string $token){
    if(!isset($_SESSION['CSRF'])){
      return false;
    }
    return hash_equals($_SESSION['CSRF'], $token);
  }
}

