<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
  header("Content-Type: application/json; charset=utf-8");

  include "library/config.php";
  
  $postjson = json_decode(file_get_contents('php://input'), true);

  ////////ADD CUSTOMER/ORDER ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if($postjson['aksi']=='add'){
    $today = date('Y-m-d h:m:s');
    echo $today;
    $data = array();
		$datenowxx = date('Y-m-d_H_i_s'); // remove duplicate name image 
		$entry = base64_decode($postjson['images']);
		$img = imagecreatefromstring($entry);

		$directory = "images/img_user".$datenowxx.".jpg"; // save gambar to folder sever 
		imagejpeg($img, $directory);
		imagedestroy($img);

    $query = mysqli_query($mysqli, "INSERT INTO order_table SET
      tarikh_order = '$today',
  		nama_pelanggan = '$postjson[nama_pelanggan]',
  		alamat_pelanggan = '$postjson[alamat_pelanggan]',
      nombor_hp = '$postjson[nombor_hp]',
      akaun = '$postjson[akaun]',
      produk = '$postjson[produk]',
      jumProduk = '$postjson[jumProduk]',
      jumlah_bayaran = '$postjson[jumlah_bayaran]',
      nota_tambahan = '$postjson[nota_tambahan]',
      sales = '$postjson[sales]',
      sales_team = '$postjson[sales_team]',
      fail_lampiran = '$directory',
      resit = '$postjson[resit]'
    ");

  	if($query) $result = json_encode(array('success'=>true,'msg'=>'success'));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result; 
  }

  ///// DISPLAY DATA UNVERIFIED///////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataunverified'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='belum disahkan' ORDER BY order_id DESC LIMIT $postjson[start],$postjson[limit]");

  while($row = mysqli_fetch_array($query)){


    $data[] = array(
      'order_id' => $row['order_id'],
      'tarikh_order' => $row['tarikh_order'],
      'nama_pelanggan' => $row['nama_pelanggan'],
      'alamat_pelanggan' => $row['alamat_pelanggan'],
      'nombor_hp' => $row['nombor_hp'],
      'akaun' => $row['akaun'],
      'produk' => $row['produk'],
      'penghantaran' => $row['penghantaran'],
      'jumlah_bayaran' => $row['jumlah_bayaran'],
      'jumProduk' => $row['jumProduk'],
      'nota_tambahan' => $row['nota_tambahan'],
      'sales' => $row['sales'],
      'sales_team' => $row['sales_team'],
      'fail_lampiran' => $row['fail_lampiran'],
      'resit' => $row['resit'],
      'pengesahan' => $row['pengesahan']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }

// DISPLAY DATA VERIFIED///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getdataverified'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='sah'OR pengesahan='tracking' ORDER BY order_id DESC LIMIT $postjson[start],$postjson[limit]");

  while($row = mysqli_fetch_array($query)){
    $data[] = array(
      'order_id' => $row['order_id'],
      'tarikh_order' => $row['tarikh_order'],
      'nama_pelanggan' => $row['nama_pelanggan'],
      'alamat_pelanggan' => $row['alamat_pelanggan'],
      'nombor_hp' => $row['nombor_hp'],
      'akaun' => $row['akaun'],
      'produk' => $row['produk'],
      'penghantaran' => $row['penghantaran'],
      'jumlah_bayaran' => $row['jumlah_bayaran'],
      'nota_tambahan' => $row['nota_tambahan'],
      'jumProduk' => $row['jumProduk'],
      'pengesahan' => $row['pengesahan'],
      'sales' => $row['sales'],
      'tracking' => $row['tracking'],
      'sales_team' => $row['sales_team']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }
  // DISPLAY DATA ALL///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataall'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table ORDER BY order_id DESC LIMIT $postjson[start],$postjson[limit]");
  
    while($row = mysqli_fetch_array($query)){
      $data[] = array(
        'order_id' => $row['order_id'],
        'tarikh_order' => $row['tarikh_order'],
        'nama_pelanggan' => $row['nama_pelanggan'],
        'alamat_pelanggan' => $row['alamat_pelanggan'],
        'nombor_hp' => $row['nombor_hp'],
        'akaun' => $row['akaun'],
        'produk' => $row['produk'],
        'penghantaran' => $row['penghantaran'],
        'jumlah_bayaran' => $row['jumlah_bayaran'],
        'nota_tambahan' => $row['nota_tambahan'],
        'sales' => $row['sales'],
        'jumProduk' => $row['jumProduk'],
        'resit' => $row['resit'],
        'pengesahan' => $row['pengesahan']
      );
    }
  
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  
      echo $result;
  
    }

    // get products///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getproduct'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM product_table ORDER BY prodID DESC LIMIT $postjson[start],$postjson[limit]");
  
    while($row = mysqli_fetch_array($query)){
      $data[] = array(
        'prodID' => $row['prodID'],
        'prodName' => $row['prodName'],
        'prodPrice' => $row['prodPrice'],
        'prodCode' => $row['prodCode'],
        'stock' => $row['stock']
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
    WHERE pengesahan = 'belum disahkan'");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }

  // get stock count///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // get total sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsum'){
    $data = array();
    $username =  $postjson['sales_username'];
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE sales = '$username'");

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
    WHERE pengesahan = 'sah'");

  	$countresult = mysqli_fetch_array($query); 
    $data[] = array(
      'sum' => $countresult['mycount']
    );
    
    if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }


  

  //get verified production///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getunverifyproduction'){
    $data = array();
  	$query = mysqli_query($mysqli, "SELECT COUNT(*) AS mycount
    FROM order_table
    WHERE pengesahan = 'sah'");

  	$countresult = mysqli_fetch_object($query); 
    $Cresult = $countresult->mycount;
    
    if($query) $result = json_encode(array('success'=>true, 'result'=>$Cresult));
      else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    echo $result;
  }


    //  QUERY // SEARCH///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    elseif($postjson['aksi']=='getquery'){
      $data = array();
      $query = mysqli_query($mysqli, "SELECT * FROM order_table ORDER BY order_id DESC LIMIT $postjson[start],$postjson[limit]");
    
      while($row = mysqli_fetch_array($query)){
        $data[] = array(
          'order_id' => $row['order_id'],
          'tarikh_order' => $row['tarikh_order'],
          'nama_pelanggan' => $row['nama_pelanggan'],
          'alamat_pelanggan' => $row['alamat_pelanggan'],
          'nombor_hp' => $row['nombor_hp'],
          'akaun' => $row['akaun'],
          'produk' => $row['produk'],
          'penghantaran' => $row['penghantaran'],
          'jumlah_bayaran' => $row['jumlah_bayaran'],
          'nota_tambahan' => $row['nota_tambahan'],
          'pengesahan' => $row['pengesahan']
        );
      }
    
      if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
        else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
    
        echo $result;
    
      }

  // UPDATE DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  elseif($postjson['aksi']=='update'){
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
      tarikh_order = '$postjson[tarikh_order]',
  		nama_pelanggan = '$postjson[nama_pelanggan]',
  		alamat_pelanggan = '$postjson[alamat_pelanggan]',
      nombor_hp = '$postjson[nombor_hp]',
      akaun = '$postjson[akaun]',
      produk = '$postjson[produk]',
      jumProduk = '$postjson[jumProduk]',
      jumlah_bayaran = '$postjson[jumlah_bayaran]',
      nota_tambahan = '$postjson[nota_tambahan]' WHERE order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

  // update verification///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='updateverify'){
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
    pengesahan = '$postjson[pengesahan]' WHERE order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

   // update tracking///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   elseif($postjson['aksi']=='updatetracking'){
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
    tracking = '$postjson[tracking]',
    pengesahan = '$postjson[pengesahan]' WHERE order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }
   // update penghantaran///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   elseif($postjson['aksi']=='updatedelivery'){
  	$query = mysqli_query($mysqli, "UPDATE order_table SET
    penghantaran = '$postjson[penghantaran]',
    pengesahan = '$postjson[pengesahan]' WHERE order_id='$postjson[order_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }

  //get sum sales///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsum'){
  	$query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) 
    FROM order_table
    ");

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

   //DELETE PRODUCT DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   elseif($postjson['aksi']=='deleteProd'){
  	$query = mysqli_query($mysqli, "DELETE FROM product_table WHERE prodID ='$postjson[prodID]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }


  // login admin///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=="loginadmin"){
    $password = md5($postjson['password']);
    $query = mysqli_query($mysqli, "SELECT * FROM user_table WHERE username='$postjson[username]' AND password='$password'");
    $check = mysqli_num_rows($query);

    if($check>0){
      $data = mysqli_fetch_array($query);
      $datauser = array(
        'user_id' => $data['user_id'],
        'username' => $data['username'],
        'password' => $data['password'],
        'role' => $data['role']
      );

      if($data['status']=='y'){
        $result = json_encode(array('success'=>true, 'result'=>$datauser));
      }else{
        $result = json_encode(array('success'=>false, 'msg'=>'Account Inactive')); 
      }

    }else{
      $result = json_encode(array('success'=>false, 'msg'=>'Unregister Account'));
    }

    echo $result;
  }

   // login accprod///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   elseif($postjson['aksi']=="loginaccprod"){
    $password = md5($postjson['accprod_password']);
    $query = mysqli_query($mysqli, "SELECT * FROM acc_prod_table WHERE accprod_username='$postjson[accprod_username]' AND accprod_password='$password'");
    $check = mysqli_num_rows($query);

    if($check>0){
      $data = mysqli_fetch_array($query);
      $datauser = array(
        'accprod_id' => $data['accprod_id'],
        'accprod_username' => $data['accprod_username'],
        'accprod_password' => $data['accprod_password'],
        'accprod_role' => $data['accprod_role']
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

  // login sales///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=="loginsales"){
    $password = md5($postjson['sales_password']);
    $query = mysqli_query($mysqli, "SELECT * FROM sales_table WHERE sales_username='$postjson[sales_username]' AND sales_password='$password'");
    $check = mysqli_num_rows($query);

    if($check>0){
      $data = mysqli_fetch_array($query);
      $datauser = array(
        'sales_id' => $data['sales_id'],
        'sales_username' => $data['sales_username'],
        'sales_password' => $data['sales_password'],
        'sales_role' => $data['sales_role'],
        'sales_team' => $data['sales_team']
      );

      if($data['status']=='y'){
        $result = json_encode(array('success'=>true, 'result'=>$datauser));
      }else{
        $result = json_encode(array('success'=>false, 'msg'=>'Account Inactive')); 
      }

    }else{
      $result = json_encode(array('success'=>false, 'msg'=>'Unregister Account'));
    }

    echo $result;
  }

//REGISTRATION ADMIN///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=="registeradmin"){
    $password = md5($postjson['password']);
    $query = mysqli_query($mysqli, "INSERT INTO user_table SET
      username = '$postjson[username]',
      role = '$postjson[role]',
      company = '$postjson[company]',
      password = '$password',
      created_at	  = '$today',
      status   = 'y'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

  //REGISTRATION ACCOUNT & PRODUCTION///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=="registeraccprod"){
    $password = md5($postjson['accprod_password']);
    $query = mysqli_query($mysqli, "INSERT INTO acc_prod_table SET
      accprod_username = '$postjson[accprod_username]',
      accprod_role = '$postjson[accprod_role]',
      accprod_hp = '$postjson[accprod_hp]',
      accprod_email = '$postjson[accprod_email]',
      accprod_password = '$password',
      status   = 'y'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }

  //REGISTER SALES///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=="registersales"){
    $password = md5($postjson['sales_password']);
    $query = mysqli_query($mysqli, "INSERT INTO sales_table SET
      sales_username = '$postjson[sales_username]',
      sales_role = '$postjson[sales_role]',
      sales_team = '$postjson[sales_company]',
      sales_hp = '$postjson[sales_hp]',
      sales_email = '$postjson[sales_email]',
      sales_password = '$password',
      status   = 'y'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }


  /////ADD PRODUCT/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=="addproduct"){
    $query = mysqli_query($mysqli, "INSERT INTO product_table SET
      prodName = '$postjson[prodName]',
      prodPrice = '$postjson[prodPrice]',
      prodCode = '$postjson[prodCode]',
      stock = '$postjson[prodStock]'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
  }
///////////GET PRODUCT PRODUCTION/////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getchoosenproductProd'){
  $data = array();
  $produk =  $postjson['produk'];
  $query = mysqli_query($mysqli, "SELECT SUM(jumProduk) AS mycount
  FROM order_table
  WHERE produk = '$produk' AND pengesahan = 'sah'");

  $countresult = mysqli_fetch_array($query); 
  $data[] = array(
    'sum' => $countresult['mycount']
  );
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  echo $result;
}

///////////GET PRODUCT PRODUCTION/////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getchoosenproductAcc'){
  $data = array();
  $produk =  $postjson['produk'];
  $query = mysqli_query($mysqli, "SELECT SUM(jumProduk) AS mycount
  FROM order_table
  WHERE produk = '$produk' AND pengesahan = 'belum disahkan'");

  $countresult = mysqli_fetch_array($query); 
  $data[] = array(
    'sum' => $countresult['mycount']
  );
  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));
  echo $result;
}



?>