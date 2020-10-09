<?php

function fetchPolicyIsValid($resourceType){
  //validate parameters
  if(!in_array($resourceType, ['publicPage', 'internalResource'])){
    throw new \Exception("invalid resource type");
    return true;
  }
  //accept requests that didn't send the sec-fetch-* header (ex. outdated browsers)
  if(!isset($_SERVER['HTTP_SEC_FETCH_SITE']) ||
     !isset($_SERVER['HTTP_SEC_FETCH_MODE']) ||
     !isset($_SERVER['HTTP_SEC_FETCH_DEST'])){
    return true;
  }
  $site = $_SERVER['HTTP_SEC_FETCH_SITE'];
  $mode = $_SERVER['HTTP_SEC_FETCH_MODE'];
  $dest = $_SERVER['HTTP_SEC_FETCH_DEST'];

  //handle the rules for internal resources
  if($resourceType == 'internalResource'){
    if($site == 'same-origin' && //allow only requests made from the same domain, no subdomains
       $mode == 'no-cors' && //resource request
       in_array($dest, ['font', 'image', 'script', 'style']) //allow only requests for these destination elements
    ){
      return true;
    }
  }
  //handle the rules for public pages
  if($resourceType == 'publicPage'){
    if(in_array($site, ['same-origin', 'none', 'same-site', 'cross-site']) && //allow only requests made from the same domain, or from user interactions
       $mode == 'navigate' && //top-level navigation
       in_array($dest, ['document']) //allow only requests for these destination elements
    ){
      return true;
    }
  }
  //DEBUG
  /* echo "site: $site \n<br> mode: $mode \n<br> destination: $dest"; */
  //reject everything else
  return false;
}

