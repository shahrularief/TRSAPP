<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
  header("Content-Type: application/json; charset=utf-8");

  include "library/config.php";
  
  $postjson = json_decode(file_get_contents('php://input'), true);

  ////////ADD CUSTOMER's ORDER ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if($postjson['aksi']=='add'){
      date_default_timezone_set("Asia/Kuala_Lumpur");
     $today = date('Y-m-d H:i:s', time());
    $day = date('d');
    $month = date('m');
    $year = date('Y');
    $weeknow = date('W');
    
    // Indexed Array
    $resit_arr = $postjson['resit'];
    // echo $resit_arr;
    // Separate Array by " , "
    $resit_str = implode(" , ",$resit_arr);
    
    $data = array();
    $query = mysqli_query($mysqli, "INSERT INTO order_table SET
      tarikh_order = '$today',
  		nama_pelanggan = '$postjson[nama_pelanggan]',
  		alamat_pelanggan = '$postjson[alamat_pelanggan]',
  		poskod = '$postjson[poskod]',
  		bandar = '$postjson[bandar]',
  		negeri = '$postjson[negeri]',
  		negara = '$postjson[negara]',
      nombor_hp = '$postjson[nombor_hp]',
      namaakaun = '$postjson[namaakaun]',
      masaakaun = '$postjson[masaakaun]',
      akaun = '$postjson[akaun]',
      produk = '$postjson[produk]',
      prodCode = '$postjson[prodCode]',
      jumProduk = '$postjson[jumProduk]',
      jumlah_bayaran = '$postjson[jumlah_bayaran]',
      nota_tambahan = '$postjson[nota_tambahan]',
      sales = '$postjson[sales]',
      nickname = '$postjson[nickname]',
      sales_hp = '$postjson[sales_hp]',
      company = '$postjson[company]',
      emel = '$postjson[emel]',
      resit = '$resit_str',
      day = '$day',
      week = '$weeknow',
      month = '$month',
      year = '$year'
    ");

  	if($query) $result = json_encode(array('success'=>true,'msg'=>'success'));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result; 
  }

   /////ADD PRODUCT/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   elseif($postjson['aksi']=="addproduct"){
    $query = mysqli_query($mysqli, "INSERT INTO product_table SET
      prodName = '$postjson[prodName]',
      prodCode = '$postjson[prodCode]',
      kos_founder = '$postjson[kos_founder]',
      kos_company = '$postjson[kos_company]',
      stock_in = '$postjson[prodStock]',
      stock = '$postjson[prodStock]'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

   /////IN TX/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   elseif($postjson['aksi']=="intransaction"){
    date_default_timezone_set("Asia/Kuala_Lumpur");
    $today = date('Y-m-d H:i:s', time());
    $query = mysqli_query($mysqli, "INSERT INTO transaction_product SET
      txproduct = '$postjson[txproduct]',
      txtotal = '$postjson[txtotal]',
      txtype = '$postjson[txtype]',
      txname = '$postjson[txname]',
      created_at = '$today'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

   /////OUT TX/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   elseif($postjson['aksi']=="outtransaction"){
    date_default_timezone_set("Asia/Kuala_Lumpur");
    $today = date('Y-m-d H:i:s', time());
    $query = mysqli_query($mysqli, "INSERT INTO transaction_product SET
      txproduct = '$postjson[txproduct]',
      txtotal = '$postjson[txtotal]',
      txtype = '$postjson[txtype]',
      txname = '$postjson[txname]',
      created_at = '$today'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }
  
   /////ADD COMPANY/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   elseif($postjson['aksi']=="addcompany"){
    $startdate =date('Y-m-d');
    $enddate =date('Y-m-d', strtotime('+1 month'));
    echo $startdate;
    echo $enddate;

    $query = mysqli_query($mysqli, "INSERT INTO company_table SET
      compName	 = '$postjson[compname]',
      compReg	 = '$postjson[compreg]',
      compAddr	 = '$postjson[compaddr]',
      compCity	 = '$postjson[compcity]',
      compPostcode = '$postjson[comppostcode]',
      compState = '$postjson[compstate]',
      compHP = '$postjson[comphp]',
      compMonthS = '$startdate',
      compMonthE = '$enddate'
    ");

    if($query) $result = json_encode(array('success'=>true, 'msg'=>'Berjaya ditambah'));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }
  // get transaction///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='gettransactions'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM transaction_product ORDER BY created_at DESC ");
  
    while($row = mysqli_fetch_array($query)){
      $data[] = array(
        'txid' => $row['txid'],
        'txproduct' => $row['txproduct'],
        'txtotal' => $row['txtotal'],
        'txtype' => $row['txtype'],
        'txname' => $row['txname'],
        'created_at' => $row['created_at']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

    // get company///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    elseif($postjson['aksi']=='getcompany'){
      $data = array();
      $query = mysqli_query($mysqli, "SELECT * FROM company_table ORDER BY compName DESC ");
    
      while($row = mysqli_fetch_array($query)){
        $data[] = array(
          'compID' => $row['compID'],
          'compName' => $row['compName'],
          'compReg' => $row['compReg'],
          'compAddr' => $row['compAddr'],
          'compCity' => $row['compCity'],
          'compPostcode' => $row['compPostcode'],
          'compHP' => $row['compHP'],
          'compState' => $row['compState'],
          'compMonthS' => $row['compMonthS'],
          'compMonthE' => $row['compMonthE']
        );
      }
    
      if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
        else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    
        echo $result;
    
      }

      // get employee///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    elseif($postjson['aksi']=='getemployee'){
      $data = array();
      $query = mysqli_query($mysqli, "SELECT * FROM employee_table ORDER BY role ASC ");
    
      while($row = mysqli_fetch_array($query)){
       
        $data[] = array(
          'userID' => $row['userID'],
          'password' => $row['password'],
          'username' => $row['username'],
          'fullname' => $row['fullname'],
          'nickname' => $row['nickname'],
          'userhp' => $row['userhp'],
          'userEmail' => $row['userEmail'],
          'role' => $row['role'],
          'company' => $row['company']
        );
      }
    
      if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
        else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    
        echo $result;
    
      }
     
  ///// DISPLAY DATA UNVERIFIED///////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataunverified'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='pending' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){
  $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
    $data[] = array(
      'order_id' => $row['order_id'],
      'tarikh_order' => $newDate,
      'nama_pelanggan' => $row['nama_pelanggan'],
      'alamat_pelanggan' => $row['alamat_pelanggan'],
      'emel' => $row['emel'],
       'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
      'nombor_hp' => $row['nombor_hp'],
      'namaakaun' => $row['namaakaun'],
      'masaakaun' => $row['masaakaun'],
      'akaun' => $row['akaun'],
      'produk' => $row['produk'],
      'prodCode' => $row['prodCode'],
      'penghantaran' => $row['penghantaran'],
      'jumlah_bayaran' => $row['jumlah_bayaran'],
      'jumProduk' => $row['jumProduk'],
      'nota_tambahan' => $row['nota_tambahan'],
      'sales' => $row['sales'],
      'company' => $row['company'],
      'resit' => $resit_explode,
      'day' => $row['day'],
      'month' => $row['month'],
      'year' => $row['year'],
      'pengesahan' => $row['pengesahan'],
      'request' => $row['request']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }

// DISPLAY DATA VERIFIED///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getdataverified'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='sah' OR pengesahan='cod' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){

    $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));

   $tarikh_verify = $row['tarikh_verify'];
   $verifyDate = date("d-m-Y H:i:s", strtotime($tarikh_verify));

 

    $data[] = array(
      'order_id' => $row['order_id'],
      'tarikh_order' => $newDate,
      'tarikh_verify' => $verifyDate,
       'verified_by' => $row['verified_by'],
      'nama_pelanggan' => $row['nama_pelanggan'],
      'emel' => $row['emel'],
      'alamat_pelanggan' => $row['alamat_pelanggan'],
      'poskod' => $row['poskod'],
      'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
      'nombor_hp' => $row['nombor_hp'],
      'namaakaun' => $row['namaakaun'],
      'masaakaun' => $row['masaakaun'],
      'akaun' => $row['akaun'],
      'produk' => $row['produk'],
      'prodCode' => $row['prodCode'],
      'penghantaran' => $row['penghantaran'],
      'jumlah_bayaran' => $row['jumlah_bayaran'],
      'nota_tambahan' => $row['nota_tambahan'],
      'jumProduk' => $row['jumProduk'],
      'pengesahan' => $row['pengesahan'],
      'resit' => $row['resit'],
      'sales' => $row['sales'],
      'request' => $row['request'],
      'nickname' => $row['nickname'],
      'sales_hp' => $row['sales_hp'],
      'tracking' => $row['tracking'],
      'company' => $row['company'],
      'day' => $row['day'],
      'month' => $row['month'],
      'year' => $row['year']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }
// DISPLAY DATA VERIFIED///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getdataverifiedreport'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan NOT IN ('pending','codpending','cod') ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){

    $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));

   $tarikh_verify = $row['tarikh_verify'];
   $verifyDate = date("d-m-Y H:i:s", strtotime($tarikh_verify));

 

    $data[] = array(
      'order_id' => $row['order_id'],
      'tarikh_order' => $newDate,
      'tarikh_verify' => $verifyDate,
       'verified_by' => $row['verified_by'],
      'nama_pelanggan' => $row['nama_pelanggan'],
      'emel' => $row['emel'],
      'alamat_pelanggan' => $row['alamat_pelanggan'],
      'poskod' => $row['poskod'],
      'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
      'nombor_hp' => $row['nombor_hp'],
      'namaakaun' => $row['namaakaun'],
      'masaakaun' => $row['masaakaun'],
      'akaun' => $row['akaun'],
      'produk' => $row['produk'],
      'prodCode' => $row['prodCode'],
      'penghantaran' => $row['penghantaran'],
      'jumlah_bayaran' => $row['jumlah_bayaran'],
      'nota_tambahan' => $row['nota_tambahan'],
      'jumProduk' => $row['jumProduk'],
      'pengesahan' => $row['pengesahan'],
      'resit' => $row['resit'],
      'sales' => $row['sales'],
      'request' => $row['request'],
      'nickname' => $row['nickname'],
      'sales_hp' => $row['sales_hp'],
      'tracking' => $row['tracking'],
      'company' => $row['company'],
      'day' => $row['day'],
      'month' => $row['month'],
      'year' => $row['year']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }

  // DISPLAY DATA SHIPPED///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getdatashipped'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='shipping' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){
    $tarikh_order = $row['tarikh_order'];
    $orderDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
    $tarikh_verify = $row['tarikh_verify'];
    $verifyDate = date("d-m-Y H:i:s", strtotime($tarikh_verify));
    $tarikh_shipping = $row['tarikh_shipping'];
    $shippingDate = date("d-m-Y H:i:s", strtotime($tarikh_shipping));

    $data[] = array(
     'order_id' => $row['order_id'],
      'tarikh_order' => $orderDate,
      'tarikh_verify' => $verifyDate,
       'verified_by' => $row['verified_by'],
       'tarikh_shipping' => $shippingDate,
       'shipped_by' => $row['shipped_by'],
      'nama_pelanggan' => $row['nama_pelanggan'],
      'emel' => $row['emel'],
      'alamat_pelanggan' => $row['alamat_pelanggan'],
      'poskod' => $row['poskod'],
      'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
      'nombor_hp' => $row['nombor_hp'],
      'namaakaun' => $row['namaakaun'],
      'masaakaun' => $row['masaakaun'],
      'akaun' => $row['akaun'],
      'produk' => $row['produk'],
      'prodCode' => $row['prodCode'],
      'penghantaran' => $row['penghantaran'],
      'jumlah_bayaran' => $row['jumlah_bayaran'],
      'nota_tambahan' => $row['nota_tambahan'],
      'jumProduk' => $row['jumProduk'],
      'pengesahan' => $row['pengesahan'],
      'sales' => $row['sales'],
      'nickname' => $row['nickname'],
      'sales_hp' => $row['sales_hp'],
      'tracking' => $row['tracking'],
      'company' => $row['company'],
      'day' => $row['day'],
      'month' => $row['month'],
      'request' => $row['request'],
      'year' => $row['year']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }

   // DISPLAY DATA COD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getdatacod'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='cod' OR pengesahan='codpending' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){
    $tarikh_order = $row['tarikh_order'];
    $orderDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
    $tarikh_verify = $row['tarikh_verify'];
    $verifyDate = date("d-m-Y H:i:s", strtotime($tarikh_verify));
    $tarikh_shipping = $row['tarikh_shipping'];
    $shippingDate = date("d-m-Y H:i:s", strtotime($tarikh_shipping));

    $data[] = array(
     'order_id' => $row['order_id'],
      'tarikh_order' => $orderDate,
      'tarikh_verify' => $verifyDate,
       'verified_by' => $row['verified_by'],
       'tarikh_shipping' => $shippingDate,
       'shipped_by' => $row['shipped_by'],
      'nama_pelanggan' => $row['nama_pelanggan'],
      'emel' => $row['emel'],
      'alamat_pelanggan' => $row['alamat_pelanggan'],
      'poskod' => $row['poskod'],
      'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
      'nombor_hp' => $row['nombor_hp'],
      'namaakaun' => $row['namaakaun'],
      'masaakaun' => $row['masaakaun'],
      'akaun' => $row['akaun'],
      'produk' => $row['produk'],
      'prodCode' => $row['prodCode'],
      'penghantaran' => $row['penghantaran'],
      'jumlah_bayaran' => $row['jumlah_bayaran'],
      'nota_tambahan' => $row['nota_tambahan'],
      'jumProduk' => $row['jumProduk'],
      'pengesahan' => $row['pengesahan'],
      'sales' => $row['sales'],
      'nickname' => $row['nickname'],
      'sales_hp' => $row['sales_hp'],
      'tracking' => $row['tracking'],
      'company' => $row['company'],
      'day' => $row['day'],
      'month' => $row['month'],
      'request' => $row['request'],
      'year' => $row['year']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }
  // DISPLAY DATA ALL///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataall'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table ORDER BY pengesahan,order_id ASC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']); 
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'tracking' => $row['tracking'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'nickname' => $row['nickname'],
        'company' => $row['company'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }
// DISPLAY DATA ALL PENDING///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getdataallpending'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='pending' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){
        $resit = $row['resit'];
 $resit_explode = explode(" , ",$row['resit']); 
 $tarikh_order = $row['tarikh_order'];
 $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
    $data[] = array(
      'order_id' => $row['order_id'],
      'tarikh_order' => $newDate,
      'nama_pelanggan' => $row['nama_pelanggan'],
      'alamat_pelanggan' => $row['alamat_pelanggan'],
      'emel' => $row['emel'],
      'poskod' => $row['poskod'],
      'bandar' => $row['bandar'],
      'negeri' => $row['negeri'],
       'negara' => $row['negara'],
      'nombor_hp' => $row['nombor_hp'],
      'namaakaun' => $row['namaakaun'],
      'masaakaun' => $row['masaakaun'],
      'akaun' => $row['akaun'],
      'produk' => $row['produk'],
      'prodCode' => $row['prodCode'],
      'penghantaran' => $row['penghantaran'],
      'tracking' => $row['tracking'],
      'jumlah_bayaran' => $row['jumlah_bayaran'],
      'nota_tambahan' => $row['nota_tambahan'],
      'sales' => $row['sales'],
      'nickname' => $row['nickname'],
      'company' => $row['company'],
      'request' => $row['request'],
      'jumProduk' => $row['jumProduk'],
      'resit' => $resit_explode,
      'day' => $row['day'],
      'month' => $row['month'],
      'year' => $row['year'],
      'pengesahan' => $row['pengesahan']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;

  }

   
     // DISPLAY DATA ALL VERIFIED///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallverified'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='sah' ORDER BY order_id ASC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']); 
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'tracking' => $row['tracking'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'nickname' => $row['nickname'],
        'company' => $row['company'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

    // DISPLAY DATA ALL SHIPPING///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallshipping'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='shipping' ORDER BY order_id ASC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']); 
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'tracking' => $row['tracking'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'nickname' => $row['nickname'],
        'company' => $row['company'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

    // DISPLAY DATA ALL SHIPPING///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallcod'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='cod' ORDER BY order_id ASC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']); 
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'tracking' => $row['tracking'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'nickname' => $row['nickname'],
        'company' => $row['company'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

     
     

     // DISPLAY DATA username///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallrecord'){
    $username = $postjson['username'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE sales='$username' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
         $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'company' => $row['company'],
        'tracking' => $row['tracking'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

     // DISPLAY DATA username///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallrecordcod'){
    $username = $postjson['username'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE sales='$username' AND pengesahan='cod' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
         $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'company' => $row['company'],
        'tracking' => $row['tracking'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }
     // DISPLAY DATA username///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallrecordpending'){
    $username = $postjson['username'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE sales='$username' AND pengesahan='pending' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
         $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'company' => $row['company'],
        'tracking' => $row['tracking'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }
     // DISPLAY DATA username///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallrecordverified'){
    $username = $postjson['username'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE sales='$username' AND pengesahan='sah' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
         $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'company' => $row['company'],
        'tracking' => $row['tracking'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }
     // DISPLAY DATA username///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallrecordshipping'){
    $username = $postjson['username'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE sales='$username' AND pengesahan='shipping' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
         $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'emel' => $row['emel'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'company' => $row['company'],
        'tracking' => $row['tracking'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'request' => $row['request'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }
    
       // DISPLAY DATA company///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallceo'){
    $company = $postjson['company'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE company='$company' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
         'emel' => $row['emel'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan'],
        'request' => $row['request']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

      // DISPLAY DATA company pending///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallceopending'){
    $company = $postjson['company'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE company='$company' AND pengesahan='pending' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
         'emel' => $row['emel'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan'],
        'request' => $row['request']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

      // DISPLAY DATA company verified///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallceoverified'){
    $company = $postjson['company'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE company='$company' AND pengesahan='sah' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
         'emel' => $row['emel'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan'],
        'request' => $row['request']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }
      // DISPLAY DATA company shipping///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallceoshipping'){
    $company = $postjson['company'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE company='$company' AND pengesahan='shipping' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
         'emel' => $row['emel'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan'],
        'request' => $row['request']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

       // DISPLAY DATA company shipping///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallceocod'){
    $company = $postjson['company'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE company='$company' AND pengesahan='cod' ORDER BY order_id DESC ");
  
    while($row = mysqli_fetch_array($query)){
          $resit = $row['resit'];
   $resit_explode = explode(" , ",$row['resit']);  
   $tarikh_order = $row['tarikh_order'];
   $newDate = date("d-m-Y H:i:s", strtotime($tarikh_order));
  
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $newDate,
        'nama_pelanggan' => $row['nama_pelanggan'],
         'emel' => $row['emel'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'poskod' => $row['poskod'],
        'bandar' => $row['bandar'],
        'negeri' => $row['negeri'],
         'negara' => $row['negara'],
        'nombor_hp' => $row['nombor_hp'],
        'namaakaun' => $row['namaakaun'],
        'masaakaun' => $row['masaakaun'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'prodCode' => $row['prodCode'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $resit_explode,
        'day' => $row['day'],
        'month' => $row['month'],
        'year' => $row['year'],
        'pengesahan' => $row['pengesahan'],
        'request' => $row['request']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }


    // get products///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getproduct'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM product_table ORDER BY prodName ASC ");
  
    while($row = mysqli_fetch_array($query)){
      $data[] = array(
        'prodID' => $row['prodID'],
        'prodName' => $row['prodName'],
        'prodCode' => $row['prodCode'],
        'kos_founder' => $row['kos_founder'],
        'kos_company' => $row['kos_company'],
        'stock' => $row['stock'],
        'stock_in' => $row['stock_in'],
        'stock_out' => $row['stock_out']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }
    // get unverified account///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getunverify'){
    $data = array();
  	$query = mysqli_query($mysqli, "SELECT COUNT(*) AS mycount
    FROM order_table
    WHERE pengesahan = 'pending' OR pengesahan = 'cod' OR pengesahan = 'codpending'");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }

  // get all total sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsumall'){
    $year = date('Y');
    $data = array();
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table WHERE year=$year AND pengesahan NOT IN ('pending','codpending','cod')" );

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }

    // get all total sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    elseif($postjson['aksi']=='getsumceo'){
      $company = $postjson['company'];
      $year = date('Y');
      $data = array();
      $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
      FROM order_table WHERE year=$year AND company='$company' AND pengesahan NOT IN ('pending','codpending','cod')" );
  
      $countresult = mysqli_fetch_array($query); 
      $data[] = array(
        'sum' => $countresult['mycount']
      );
      if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
        else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
      echo $result;
    }
  // get total sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsum'){
    $year = date('Y');
    $data = array();
    $username =  $postjson['sales_username'];
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE sales = '$username'AND year=$year AND pengesahan NOT IN ('pending','codpending','cod') ");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }
  
  // get total sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsumpending'){
    $year = date('Y');
    $data = array();
    $username =  $postjson['sales_username'];
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE sales = '$username'AND year=$year AND pengesahan = 'pending' OR pengesahan = 'cod'");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }
  // get today sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
   elseif($postjson['aksi']=='getsumtoday'){
    date_default_timezone_set("Asia/Kuala_Lumpur");
     $today = date('Y-m-d H:i:s', time());
     $day = date('d');
    $month = date('m');
    $year = date('Y');
    $data = array();
    $username =  $postjson['sales_username'];
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE sales = '$username' AND day ='$day' AND year ='$year' AND month ='$month' AND pengesahan NOT IN ('pending','codpending','cod')");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }

   // get ceo today sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
   elseif($postjson['aksi']=='getsumceotoday'){
    date_default_timezone_set("Asia/Kuala_Lumpur");
    $company = $postjson['company'];
     $today = date('Y-m-d H:i:s', time());
     $day = date('d');
    $month = date('m');
    $year = date('Y');
    $data = array();
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE company = '$company' AND day ='$day' AND year ='$year' AND month ='$month' AND pengesahan NOT IN ('pending','codpending','cod')");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }

  // get all today sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsumalltoday'){
    date_default_timezone_set("Asia/Kuala_Lumpur");
     $today = date('Y-m-d H:i:s', time());
     $day = date('d');
    $month = date('m');
    $year = date('Y');
    $data = array();
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE day ='$day' AND year ='$year' AND month ='$month' AND  pengesahan NOT IN ('pending','codpending','cod')");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }

  // get month sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsumallmonth'){
    $data = array();
    $year = date('Y');
    $monthnow = date('m');
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE month ='$monthnow' AND year ='$year' AND pengesahan NOT IN ('pending','codpending','cod')");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }

  // get month sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsumceomonth'){
    $data = array();
    $company = $postjson['company'];
    $monthnow = date('m');
    $year = date('Y');
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE month ='$monthnow' AND year ='$year' AND company ='$company' AND pengesahan NOT IN ('pending','codpending','cod')");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }
   // get month sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   elseif($postjson['aksi']=='getsumsalesmonth'){
    $data = array();
    $username =  $postjson['username'];
    $monthnow = date('m');
    $year = date('Y');
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE month ='$monthnow' AND year ='$year' AND sales='$username' AND pengesahan NOT IN ('pending','codpending','cod') ");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }


   // graph month admin///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   elseif($postjson['aksi']=='getgraphmonth'){
    $data = array();
    $year = date('Y');
    $query = mysqli_query($mysqli, "SELECT jumlah_bayaran,month FROM order_table WHERE pengesahan NOT IN ('pending','codpending','cod') AND year='$year' ORDER BY month ASC");
  
    while($row = mysqli_fetch_array($query)){
      $data[] = array(
        'month' => $row['month'],
        'jumlah_bayaran' => $row['jumlah_bayaran']
      );
    }
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;

  }

  // graph month company sales ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getgraphmonthsales'){
    $data = array();
     $year = date('Y');
    $username =  $postjson['username'];
    $query = mysqli_query($mysqli, "SELECT jumlah_bayaran,month FROM order_table WHERE sales='$username' AND pengesahan NOT IN ('pending','codpending','cod') AND year='$year' ORDER BY month ASC");
  
    while($row = mysqli_fetch_array($query)){
      $data[] = array(
        'month' => $row['month'],
        'jumlah_bayaran' => $row['jumlah_bayaran']
      );
    }
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;

  }

   // graph month product admin///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   elseif($postjson['aksi']=='getgraphmonthbyproduct'){
    $data = array();
     $year = date('Y');
    $query = mysqli_query($mysqli, "SELECT jumlah_bayaran,month,produk FROM order_table  WHERE pengesahan NOT IN ('pending','codpending','cod') AND year='$year' ORDER BY produk ASC");
  
    while($row = mysqli_fetch_array($query)){
      $data[] = array(
        'month' => $row['month'],
        'produk' => $row['produk'],
        'jumlah_bayaran' => $row['jumlah_bayaran']
      );
    }
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;

  }
  
 // graph product sold SALES  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 elseif($postjson['aksi']=='getgraphproductsold'){
 date_default_timezone_set("Asia/Kuala_Lumpur");
    $month = date('m');
  $year = date('Y');
  $data = array();
  $username =  $postjson['username'];
  $query = mysqli_query($mysqli, "SELECT produk,jumProduk FROM order_table WHERE sales='$username' AND pengesahan NOT IN ('pending','codpending','cod')AND month='$month' AND year='$year'");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
        'produk' => $row['produk'],
      'jumProduk' => $row['jumProduk']
    );
  }
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  echo $result;

}
// graph product sold SALES  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

elseif($postjson['aksi']=='getgraphproductsoldall'){
  $data = array();
   $year = date('Y');
  $query = mysqli_query($mysqli, "SELECT jumProduk,month FROM order_table  WHERE pengesahan NOT IN ('pending','codpending','cod') AND year='$year' ORDER BY month ASC");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'month' => $row['month'],
      'jumProduk' => $row['jumProduk']
    );
  }
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  echo $result;

}

  // graph company admin///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getgraphmonthbycompany'){
    $data = array();
     $year = date('Y');
    $query = mysqli_query($mysqli, "SELECT jumlah_bayaran,month,company FROM order_table WHERE pengesahan NOT IN ('pending','codpending','cod') AND year='$year' ORDER BY company ASC");
  
    while($row = mysqli_fetch_array($query)){
      $data[] = array(
        'month' => $row['month'],
        'company' => $row['company'],
        'jumlah_bayaran' => $row['jumlah_bayaran']
      );
    }
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;

  }

 //get sum prod///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 elseif($postjson['aksi']=='getsumproduction'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
  FROM order_table
  WHERE pengesahan = 'sah' OR pengesahan = 'tracking'");

  $countresult = mysqli_fetch_array($query); 
  $data[] = array(
    'sum' => $countresult['mycount']
  );
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  echo $result;

}


//get sum ship///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

elseif($postjson['aksi']=='getsumship'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
  FROM order_table
  WHERE pengesahan = 'shipping'");

  $countresult = mysqli_fetch_array($query); 
  $data[] = array(
    'sum' => $countresult['mycount']
  );
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  echo $result;

}


   // get unverified prod///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   elseif($postjson['aksi']=='getunverifyproduction'){
    $data = array();
  	$query = mysqli_query($mysqli, "SELECT COUNT(*) AS mycount
    FROM order_table
    WHERE pengesahan='sah'OR pengesahan='tracking'");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }

 //get shipped count ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 elseif($postjson['aksi']=='getshippedcount'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT COUNT(*) AS mycount
  FROM order_table
  WHERE pengesahan = 'shipping'");

  $countresult = mysqli_fetch_array($query); 
  $data[] = array(
    'sum' => $countresult['mycount']
  );
  
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  echo $result;
}

  // UPDATE DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  elseif($postjson['aksi']=='update'){
      date_default_timezone_set("Asia/Kuala_Lumpur");
     $today = date('Y-m-d H:i:s', time());
    $day = date('d');
    $month = date('m');
    $year = date('Y');
    $weeknow = date('W');
    
    // Indexed Array
    $resit_arr = $postjson['resit'];
    echo $resit_arr;
    // Separate Array by " , "
    $resit_str = implode(" , ",$resit_arr);
    
    
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
      tarikh_order = '$today',
  		nama_pelanggan = '$postjson[nama_pelanggan]',
  		alamat_pelanggan = '$postjson[alamat_pelanggan]',
  		poskod = '$postjson[poskod]',
  		bandar = '$postjson[bandar]',
  		negara = '$postjson[negara]',
      nombor_hp = '$postjson[nombor_hp]',
      namaakaun = '$postjson[namaakaun]',
      masaakaun = '$postjson[masaakaun]',
      akaun = '$postjson[akaun]',
      produk = '$postjson[produk]',
      prodCode = '$postjson[prodCode]',
      jumProduk = '$postjson[jumProduk]',
      resit = '$resit_str',
      pengesahan = '$postjson[pengesahan]',
      emel = '$postjson[emel]',
      jumlah_bayaran = '$postjson[jumlah_bayaran]',
      nota_tambahan = '$postjson[nota_tambahan]' WHERE order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }
 // UPDATE ORDERTABLE ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 elseif($postjson['aksi']=='updateordertable'){
  $query = mysqli_query($mysqli, "UPDATE order_table SET
    sales = '$postjson[sales]',
    nickname = '$postjson[nickname]',
    sales_hp = '$postjson[saleshp]'
    WHERE sales='$postjson[initsales]' AND nickname = '$postjson[initnickname]' AND sales_hp = '$postjson[initsaleshp]'");

  if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  else $result = json_encode(array('success'=>false, 'result'=>'error'));

  echo $result;

}
  // UPDATE REQUEST ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  elseif($postjson['aksi']=='updatenota'){
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
      nota_tambahan = '$postjson[nota_tambahan]'
      WHERE order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

  // UPDATE REQUEST ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  elseif($postjson['aksi']=='updaterequest'){
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
      request = '$postjson[request]'
      WHERE order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }


  // UPDATE AVATAR ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  elseif($postjson['aksi']=='updateAvatar'){
  	$query = mysqli_query($mysqli, "UPDATE employee_table SET
      avatar = '$postjson[avatar]'
      WHERE userID='$postjson[userID]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

// EDIT PRODUCT ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


elseif($postjson['aksi']=='editproduct'){
  $query = mysqli_query($mysqli, "UPDATE product_table SET
    prodName = '$postjson[prodName]',
    prodCode = '$postjson[prodCode]',
    kos_founder = '$postjson[kos_founder]',
    kos_company = '$postjson[kos_company]'
    WHERE prodID='$postjson[prodID]'");

  if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  else $result = json_encode(array('success'=>false, 'result'=>'error'));

  echo $result;

}

   // UPDATE DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


   elseif($postjson['aksi']=='updatecompany'){
  	$query = mysqli_query($mysqli, "UPDATE company_table SET
      compName = '$postjson[compName]',
  		compReg = '$postjson[compReg]',
  		compAddr = '$postjson[compAddr]',
      compCity = '$postjson[compCity]',
      compPostcode = '$postjson[compPostcode]',
      compHP = '$postjson[compHP]',
      compMonthS = '$postjson[compMonthS]',
      compMonthE = '$postjson[compMonthE]'
      WHERE compID='$postjson[compID]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }
     // UPDATE employee///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='updateemployee'){
      $pass = md5($postjson['password']);
   $query = mysqli_query($mysqli, "UPDATE employee_table SET
          username = '$postjson[username]',
          fullname = '$postjson[fullname]',
          nickname = '$postjson[nickname]',
          userhp = '$postjson[userhp]',
          userEmail = '$postjson[userEmail]',
          role = '$postjson[role]',
          company = '$postjson[company]',
          password= '$pass'
          WHERE userID='$postjson[userID]'");

          if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
          else $result = json_encode(array('success'=>false, 'result'=>'error'));

          echo $result;

          }
           // UPDATE employee no pass///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      elseif($postjson['aksi']=='updateemployeenopassword'){
      $query = mysqli_query($mysqli, "UPDATE employee_table SET
      username = '$postjson[username]',
      fullname = '$postjson[fullname]',
      nickname = '$postjson[nickname]',
      userhp = '$postjson[userhp]',
      userEmail = '$postjson[userEmail]',
      role = '$postjson[role]',
      company = '$postjson[company]'
      WHERE userID='$postjson[userID]'");

      if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
      else $result = json_encode(array('success'=>false, 'result'=>$result));

      echo $result;

      }

 
  // update verification///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='updateverify'){
     date_default_timezone_set("Asia/Kuala_Lumpur");
     $datetime = date('Y-m-d H:i:s', time());
     $day = date('d');
    $month = date('m');
    $year = date('Y');
    $weeknow = date('W');
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
    pengesahan = '$postjson[pengesahan]',tarikh_verify = '$datetime',verified_by = '$postjson[verified_by]', day = '$day',
      week = '$weeknow',
      month = '$month',
      year = '$year' WHERE  order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

    // update delivery and tracking ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
   elseif($postjson['aksi']=='updateproduction'){
      date_default_timezone_set("Asia/Kuala_Lumpur");
     $today = date('Y-m-d H:i:s', time());
       
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
    tracking = '$postjson[tracking]',penghantaran = '$postjson[penghantaran]',
    pengesahan = '$postjson[pengesahan]',shipped_by='$postjson[shipped_by]',tarikh_shipping='$today' WHERE order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }
   
  // update stock ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='updatestock'){
  	$query = mysqli_query($mysqli, "UPDATE product_table SET
    stock = '$postjson[stock]' WHERE prodID='$postjson[prodID]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

 // UPDATE STOCK IN ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 elseif($postjson['aksi']=='updatestockin'){
  $query = mysqli_query($mysqli, "UPDATE product_table SET
    stock = stock + '$postjson[stock_in]',
    stock_in = stock_in + '$postjson[stock_in]'
    WHERE prodName='$postjson[prodName]'");

  if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  else $result = json_encode(array('success'=>false, 'result'=>'error'));

  echo $result;

}



  // UPDATE STOCK OUT ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  elseif($postjson['aksi']=='updatestockout'){
  	$query = mysqli_query($mysqli, "UPDATE product_table SET
      stock = stock - '$postjson[stock_out]',
      stock_out = stock_out + '$postjson[stock_out]'
      WHERE prodName='$postjson[prodName]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

 

  //DELETE ORDER DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='delete'){
  	$query = mysqli_query($mysqli, "DELETE FROM order_table WHERE order_id ='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

  elseif($postjson['aksi']=='deleteemployee'){
  	$query = mysqli_query($mysqli, "DELETE FROM employee_table WHERE userID ='$postjson[userID]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

  elseif($postjson['aksi']=='deletecompany'){
  	$query = mysqli_query($mysqli, "DELETE FROM company_table WHERE compID ='$postjson[compID]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }


   //DELETE PRODUCT DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   elseif($postjson['aksi']=='deleteProd'){
  	$query = mysqli_query($mysqli, "DELETE FROM product_table WHERE prodID ='$postjson[prodID]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

  //// LOGIN EMPLOYEE ///////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=="loginemployee"){
    $password = md5($postjson['password']);
    $query = mysqli_query($mysqli, "SELECT * FROM employee_table WHERE username='$postjson[username]' AND password='$password'");
    $check = mysqli_num_rows($query);

    if($check>0){
      $data = mysqli_fetch_array($query);
      $datauser = array(
        'userID' => $data['userID'],
        'username' => $data['username'],
        'password' => $data['password'],
        'role' => $data['role'],
        'fullname' => $data['fullname'],
        'nickname' => $data['nickname'],
        'userhp' => $data['userhp'],
        'userEmail' => $data['userEmail'],
        'company' => $data['company'],
        'created_at' => $data['created_at'],
        'status' => $data['status'],
        'avatar' => $data['avatar'],
      );

      if($data['status']=='y'){
        $result = json_encode(array('success'=>true, 'result'=>$datauser));
      }else{
        $result = json_encode(array('success'=>false, 'msg'=>'Account Inactive')); 
      }

    }else{
      $result = json_encode(array('success'=>false, 'msg'=>'Unregistered Account'));
    }

    echo $result;
  }

  ////REGISTRATION EMPLOYEE///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=="registeremployee"){
    $today = date('Y-m-d h:m:s');
    $password = md5($postjson['password']);
    $query = mysqli_query($mysqli, "INSERT INTO employee_table SET
      fullname = '$postjson[fullname]',
      nickname = '$postjson[nickname]',
      username = '$postjson[username]',
      userhp = '$postjson[userhp]',
      role = '$postjson[role]',
      userEmail = '$postjson[userEmail]',
      company = '$postjson[company]',
      password = '$password',
      created_at	= '$today',
      status   = 'y'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

 
///////////GET PRODUCT PRODUCTION/////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getchoosenproductProd'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT jumProduk,produk FROM order_table WHERE pengesahan = 'sah'");
  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'produk' => $row['produk'],
      'jumProduk' => $row['jumProduk']
    );
  }
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  echo $result;
}

///////////GET PRODUCT account/////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getchoosenproductAcc'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT jumProduk,produk FROM order_table WHERE pengesahan = 'pending'");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'produk' => $row['produk'],
      'jumProduk' => $row['jumProduk']
    );
  }
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  echo $result;
}

// get sales ranking///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getrankingsales'){
     date_default_timezone_set("Asia/Kuala_Lumpur");
     $today = date('Y-m-d H:i:s', time());
    $day = date('d');
    $month = date('m');
    $year = date('Y');
    $weeknow = date('W');
  $data = array();
  $company=$postjson['company'];
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE company='$company' AND month='$month' AND year='$year' AND pengesahan NOT IN ('pending','codpending','cod') ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'sales' => $row['sales'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;

  }
  
  // get sales ranking all///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getrankingall'){
  $data = array();
   $year = date('Y');
  $query = mysqli_query($mysqli, "SELECT company,jumlah_bayaran,jumProduk FROM order_table  WHERE pengesahan NOT IN ('pending','codpending','cod') AND year='$year' ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'company' => $row['company'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }
  
   // get sales ranking all///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getrankingsalesall'){
     date_default_timezone_set("Asia/Kuala_Lumpur");
     $today = date('Y-m-d H:i:s', time());
    $day = date('d');
    $month = date('m');
    $year = date('Y');
    $weeknow = date('W');
  $data = array();
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE pengesahan NOT IN ('pending','codpending','cod') AND month=$month ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'sales' => $row['sales'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }
// get sales ranking by company daily ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getrankingcompanydaily'){

  $month = date('m');
  $year = date('Y');
  $week = date('W');
  $datetoday = date('d');
  $data = array();
  $query = mysqli_query($mysqli, "SELECT company,jumlah_bayaran,jumProduk FROM order_table WHERE day='$datetoday' AND week='$week' AND month='$month' AND year='$year'  AND pengesahan NOT IN ('pending','codpending','cod') ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'company' => $row['company'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

  // get sales ranking by company weekly///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getrankingcompanyweekly'){
 
  $month = date('m');
  $year = date('Y');
  $weeknow = date('W');
  $data = array();
  $query = mysqli_query($mysqli, "SELECT company,jumlah_bayaran,jumProduk FROM order_table WHERE week='$weeknow' AND month='$month' AND year='$year' AND pengesahan NOT IN ('pending','codpending','cod') ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'company' => $row['company'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

   // get sales ranking by company MONTHLY///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getrankingcompanymonthly'){

  $year = date('Y');
  $monthnow = date('m');
  $data = array();
  $query = mysqli_query($mysqli, "SELECT company,jumlah_bayaran,jumProduk FROM order_table WHERE month='$monthnow' AND year='$year' AND pengesahan NOT IN ('pending','codpending','cod') ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'company' => $row['company'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

 // get sales ranking by members today ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 elseif($postjson['aksi']=='getrankingmemberstoday'){
  $day = date('d');
  $month = date('m');
  $year = date('Y');
  $week = date('W');
  $company = $postjson['company'];
  $data = array();
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE day='$day' AND week='$week' AND month='$month' AND year='$year' AND company='$company' AND pengesahan NOT IN ('pending','codpending','cod') ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'sales' => $row['sales'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

  // get sales ranking by members weekly ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 elseif($postjson['aksi']=='getrankingmembersweekly'){
  $month = date('m');
  $year = date('Y');
  $week = date('W');
  $company = $postjson['company'];
  $data = array();
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE week='$week' AND month='$month' AND year='$year' AND company='$company' AND pengesahan NOT IN ('pending','codpending','cod') ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'sales' => $row['sales'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

   // get sales ranking by members monthly ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 elseif($postjson['aksi']=='getrankingmembersmonthly'){
  $month = date('m');
  $year = date('Y');
  
  $company = $postjson['company'];
  $data = array();
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE month='$month' AND year='$year' AND company='$company'  AND pengesahan NOT IN ('pending','codpending','cod') ORDER BY sales DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'sales' => $row['sales'],
      'jumProduk' => $row['jumProduk'],
      'jumlah_bayaran' => $row['jumlah_bayaran']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

  // DISPLAY Shipping Dashboard///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getshippingdaily'){
  $day = date('d');
  $month = date('m');
  $year = date('Y');
  $week = date('W');
  $data = array();
  $query = mysqli_query($mysqli, "SELECT SUM(jumProduk) AS jumProduk, (COUNT(nama_pelanggan)) AS Total FROM order_table WHERE pengesahan='shipping' AND day='$day' AND week='$week' AND month='$month' AND year='$year' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'jumProduk' => $row['jumProduk'],
      'Total' => $row['Total']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }

  // DISPLAY Shipping Dashboard///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getshippingweekly'){
  $day = date('d');
  $month = date('m');
  $year = date('Y');
  $week = date('W');
  $data = array();
  $query = mysqli_query($mysqli, "SELECT SUM(jumProduk) AS jumProduk, (COUNT(nama_pelanggan)) AS Total FROM order_table WHERE pengesahan='shipping' AND week='$week' AND month='$month' AND year='$year' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'jumProduk' => $row['jumProduk'],
      'Total' => $row['Total']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }

  // DISPLAY Shipping Dashboard///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getshippingmonthly'){
  $day = date('d');
  $month = date('m');
  $year = date('Y');
  $week = date('W');
  $data = array();
  $query = mysqli_query($mysqli, "SELECT SUM(jumProduk) AS jumProduk, (COUNT(nama_pelanggan)) AS Total FROM order_table WHERE pengesahan='shipping' AND month='$month' AND year='$year' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'jumProduk' => $row['jumProduk'],
      'Total' => $row['Total']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }

  // DISPLAY Shipping Dashboard///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getshippingtotal'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT SUM(jumProduk) AS jumProduk, (COUNT(nama_pelanggan)) AS Total FROM order_table WHERE pengesahan='shipping' ORDER BY order_id DESC ");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'jumProduk' => $row['jumProduk'],
      'Total' => $row['Total']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }
?>