// Setup core variables for the RESTful application and database connection

var node_port   = 3030;
var express     = require('express'); // This makes REST easy
var app         = express();
var db          = require('mysql'); //This sets up the MySQL connection
var db_pool     = db.createPool({
    host        : 'localhost',
    port        : '',
    database    : 'node_js_sample',
    user        : 'root',
    password    : ''
});

/* Setup static page delivery */
app.configure( function (){
    app.use( express.static( __dirname + '/public' ) ); // This is the client side!
    app.use( express.logger( 'dev' ) ); // Any request to the server will print out in the console bash shell
	app.use(express.bodyParser());
});

/**
 * All active list
 */

 app.get( '/api/db/list', function ( objRequest, objResponse ){
    // Set response type from text/html to application/json
    objResponse.setHeader( 'content-type', 'application/json' );

    // Get a connection to the database
    db_pool.getConnection( function ( objError, objConnection ){

        // check for any connection errors
        if( objError ){

            // There was an error, so send JSON with an error message and an HTTP status of 503 (Service Unavailable)
            sendError( objResponse, 503, 'error', 'connection', objError );

        }else{
           objConnection.query(
                'SELECT * FROM list',
                function ( objError, objRows, objFields ){
                    if( objError ){
                        sendError( objResponse, 500, 'error', 'query', objError );
                    
                    }else{
                    

                        objResponse.send({
                            result      : 'success',
                            //err         : '',
                            //err_type    : '',
                            //fields      : objFields,
                            rows        : objRows,
                            length      : objRows.length
                        });

                    }
                }
            );
            objConnection.release();
        }
    });
});

/**
 * All active list with ID
 */


app.get( '/api/db/list/id/:id', function ( objRequest, objResponse ){
    // Set response type from text/html to application/json
    var id = objRequest.params.id;
	objResponse.setHeader( 'content-type', 'application/json' );

    // Get a connection to the database
    db_pool.getConnection( function ( objError, objConnection ){

        // check for any connection errors
        if( objError ){

            // There was an error, so send JSON with an error message and an HTTP status of 503 (Service Unavailable)
            sendError( objResponse, 503, 'error', 'connection', objError );

        }else{

            objConnection.query(
                'SELECT * FROM list where id = '+id+'',
                function ( objError, objRows, objFields ){
                    if( objError ){
                        
                        // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                        sendError( objResponse, 500, 'error', 'query', objError );
                    
                    }else{
                    
                        // We have query results back, so lets put the results in JSON and return them
                        objResponse.send({
                            result      : 'success',
                            //err         : '',
                            //err_type    : '',
                            //fields      : objFields,
                            rows        : objRows,
                            length      : objRows.length
                        });

                    }
                }
            );
            objConnection.release();
        }
    });
});
 

/**
 * All active list with ID
 */
app.post( '/api/db/list/oneRecord', function ( objRequest, objResponse ){
    // Set response type from text/html to application/json
    //var id = objRequest.params.id;
	var id = objRequest.body.id;
	objResponse.setHeader( 'content-type', 'application/json' );

    // Get a connection to the database
    db_pool.getConnection( function ( objError, objConnection ){

        // check for any connection errors
        if( objError ){

            // There was an error, so send JSON with an error message and an HTTP status of 503 (Service Unavailable)
            sendError( objResponse, 503, 'error', 'connection', objError );

        }else{

            objConnection.query(
                'SELECT * FROM list where id = '+id+' ',
                function ( objError, objRows, objFields ){
                    if( objError ){
                        
                        // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                        sendError( objResponse, 500, 'error', 'query', objError );
                    
                    }else{
                    
                        // We have query results back, so lets put the results in JSON and return them
                        objResponse.send({
                            result      : 'success',
                            //err         : '',
                            //err_type    : '',
                            //fields      : objFields,
                            rows        : objRows,
                            length      : objRows.length
                        });

                    }
                }
            );
            objConnection.release();
        }
    });
});

/*
*	Inserting data in MySQL DB
*/

app.post( '/api/db/list/insertRecord', function ( objRequest, objResponse ){
    // Set response type from text/html to application/json
    //var id = objRequest.params.id;
	var name = objRequest.body.name;
	objResponse.setHeader( 'content-type', 'application/json' );

    // Get a connection to the database
    db_pool.getConnection( function ( objError, objConnection ){

        // check for any connection errors
        if( objError ){

            // There was an error, so send JSON with an error message and an HTTP status of 503 (Service Unavailable)
            sendError( objResponse, 503, 'error', 'connection', objError );

        }else{
			//console.log('INSERT INTO list ("name") VALUES ("'+name+'");');
            objConnection.query(
                'INSERT INTO list (id, name) VALUES (NULL,"'+name+'") ',
                function ( objError, objRows, objFields ){
                    if( objError ){
                        
                        // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                        sendError( objResponse, 500, 'error', 'query', objError );
                    
                    }else{
                    
                        // We have query results back, so lets put the results in JSON and return them
                        objResponse.send({
                            result      : 'success',
                            //err         : '',
                            //err_type    : '',
                            //fields      : objFields,
                            rows        : objRows,
                            length      : objRows.length
                        });

                    }
                }
            );
            objConnection.release();
        }
    });
});

/**
 * You can fire two queries as shown below.
 *	here i'm taking no_view as per 'id' from DB then updating that in DB
 */
app.post( '/api/db/list/views', function ( objRequest, objResponse ){
    // Set response type from text/html to application/json
    //var id = objRequest.params.id;
	var id = objRequest.body.id;
	objResponse.setHeader( 'content-type', 'application/json' );

    // Get a connection to the database
    db_pool.getConnection( function ( objError, objConnection ){

        // check for any connection errors
        if( objError ){

            // There was an error, so send JSON with an error message and an HTTP status of 503 (Service Unavailable)
            sendError( objResponse, 503, 'error', 'connection', objError );

        }else{

            objConnection.query(
                'SELECT * FROM list where id = '+id+'',
                function ( objError, objRows, objFields ){
                    if( objError ){
                        
                        // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                        sendError( objResponse, 500, 'error', 'query', objError );
                    
                    }
					else
					{
						//console.log(objRows);
						
						for (var i in objRows) {
							//console.log('Views : ', objRows[i].no_views);
							views = objRows[i].no_views;
						}
						views = views+1;
						//---------------------------------------------------------------------
						objConnection.query(
								"UPDATE `list` SET `no_views` = '"+views+"' WHERE `list`.`id` = "+id+";",
								function ( objError, objRows, objFields ){
									if( objError ){
										
										// Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
										sendError( objResponse, 500, 'error', 'query', objError );
									
									}
									else
									{
														
											// We have query results back, so lets put the results in JSON and return them
											objResponse.send({
												result      : 'success: update views ',
												views         : views,
												//err_type    : '',
												//fields      : objFields,
												//rows        : objRows,
												//length      : objRows.length
											});

									}
								}
							);
						//------------------------------------------------------------------------
							// We have query results back, so lets put the results in JSON and return them
						/*	objResponse.send({
								result      : 'success',
								//views         : views,
								//err_type    : '',
								//fields      : objFields,
								//rows        : objRows,
								//length      : objRows.length
							});*/

                    }
                }
            );
            objConnection.release();
        }
    });
});


/**
 * sendError is the JSON we use to send information about errors to the client-side.
 *     We need to check on the client-side for errors.
 */
function sendError( objResponse, iStatusCode, strResult,  strType, objError ){
    // I could throw errors at the HTTP response level, but I want to trap handled errors in my code instead
    //objResponse.statusCode = iStatusCode;
    objResponse.send({
        result  : strResult,
        err     : objError.code,
        err_type    : strType
    });
}

/* Start listening on port 3030 */
app.listen( node_port );
console.log( "App listening on port " + node_port );