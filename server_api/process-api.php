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
    $today = date('Y-m-d');
    $day = date('d');
    $month = date('m');
    $year = date('Y');
    $weeknow = date('W');
    echo $today ; 
  echo $weeknow ;
    echo $day ;
    echo $month ;
    echo $year ;
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
      company = '$postjson[company]',
      fail_lampiran = '$directory',
      resit = '$postjson[resit]',
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
      prodPrice = '$postjson[prodPrice]',
      prodCode = '$postjson[prodCode]',
      stock = '$postjson[prodStock]'
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
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='belum disahkan' ORDER BY order_id DESC ");

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
      'company' => $row['company'],
      'fail_lampiran' => $row['fail_lampiran'],
      'resit' => $row['resit'],
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

// DISPLAY DATA VERIFIED///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getdataverified'){
  $data = array();
  $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE pengesahan='sah'OR pengesahan='tracking' ORDER BY order_id DESC ");

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
      'day' => $row['day'],
      'month' => $row['month'],
      'year' => $row['year'],
      'company' => $row['company']
    );
  }

  if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

  	echo $result;

  }
  // DISPLAY DATA ALL///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataall'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table ORDER BY order_id DESC ");
  
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

     // DISPLAY DATA ALL///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getdataallrecord'){
    $username = $postjson['username'];
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM order_table WHERE sales='$username' ORDER BY order_id DESC ");
  
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


    // get products///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  elseif($postjson['aksi']=='getproduct'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM product_table ORDER BY prodID DESC ");
  
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

  // get all total sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsumall'){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table");

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
  // get today sale///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='getsumtoday'){
    $today = date('Y-m-d');
    $data = array();
    $username =  $postjson['sales_username'];
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE sales = '$username' AND tarikh_order ='$today'");

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
    $today = date('Y-m-d');
    $data = array();
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE tarikh_order ='$today'");

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
   
    $monthnow = date('m');
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE month ='$monthnow'");

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
    $query = mysqli_query($mysqli, "SELECT SUM(jumlah_bayaran) AS mycount
    FROM order_table
    WHERE month ='$monthnow' AND sales='$username'");

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

    $query = mysqli_query($mysqli, "SELECT jumlah_bayaran,month FROM order_table ORDER BY month ASC");
  
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
    $username =  $postjson['username'];
    $query = mysqli_query($mysqli, "SELECT jumlah_bayaran,month FROM order_table WHERE sales='$username' ORDER BY month ASC");
  
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
    $query = mysqli_query($mysqli, "SELECT jumlah_bayaran,month,produk FROM order_table ORDER BY produk ASC");
  
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
  $data = array();
  $username =  $postjson['username'];
  $query = mysqli_query($mysqli, "SELECT jumProduk,month FROM order_table WHERE sales='$username'ORDER BY month ASC");

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
// graph product sold SALES  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

elseif($postjson['aksi']=='getgraphproductsoldall'){
  $data = array();
  
  $query = mysqli_query($mysqli, "SELECT jumProduk,month FROM order_table ORDER BY month ASC");

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
    $query = mysqli_query($mysqli, "SELECT jumlah_bayaran,month,company FROM order_table ORDER BY company ASC");
  
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

  // update stock ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  elseif($postjson['aksi']=='updatestock'){
  	$query = mysqli_query($mysqli, "UPDATE product_table SET
    stock = '$postjson[stock]' WHERE prodID='$postjson[prodID]'");

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
  $query = mysqli_query($mysqli, "SELECT jumProduk,produk FROM order_table WHERE pengesahan = 'belum disahkan'");

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
  $data = array();
  $company=$postjson['company'];
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE company='$company' ORDER BY sales DESC ");

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
  $query = mysqli_query($mysqli, "SELECT company,jumlah_bayaran,jumProduk FROM order_table ORDER BY sales DESC ");

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
// get sales ranking by company daily ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
elseif($postjson['aksi']=='getrankingcompanydaily'){

  $month = date('m');
  $year = date('Y');
  $week = date('W');
  $datetoday = date('d');
  $data = array();
  $query = mysqli_query($mysqli, "SELECT company,jumlah_bayaran,jumProduk FROM order_table WHERE day='$datetoday' AND week='$week' AND month='$month' AND year='$year' ORDER BY sales DESC ");

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
  $query = mysqli_query($mysqli, "SELECT company,jumlah_bayaran,jumProduk FROM order_table WHERE week='$weeknow' AND month='$month' AND year='$year' ORDER BY sales DESC ");

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
  $query = mysqli_query($mysqli, "SELECT company,jumlah_bayaran,jumProduk FROM order_table WHERE month='$monthnow' AND year='$year' ORDER BY sales DESC ");

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
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE day='$day' AND week='$week' AND month='$month' AND year='$year' AND company='$company' ORDER BY sales DESC ");

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
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE week='$week' AND month='$month' AND year='$year' AND company='$company' ORDER BY sales DESC ");

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
  $query = mysqli_query($mysqli, "SELECT sales,jumlah_bayaran,jumProduk FROM order_table WHERE month='$month' AND year='$year' AND company='$company' ORDER BY sales DESC ");

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