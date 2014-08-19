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
 * All active category
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

            // We have a connection to the database server and db:
            //      Let's figure out which CONTENT_TYPE they want and build
            //      the correct QUERY to request from MySQL
            /*var strQuery = "";
            switch( objRequest.params.content_type ){
                case 'category':
                    strQuery  = "SELECT * FROM music_category where isactive = 1";
                    break;
                default :
                    // We don't know how to handle this kind of CONTENT_TYPE so
                    // we simply want to blow it up right now
                    sendError( objResponse, 503, 'error', 'content-type unkown', { code : 'CONTENT-TYPE MISMATCH' } );
				//---------------------------------------------------------------------------------------------------------
				
            }*/

            //Assuming we knew how to handle the CONTENT_TYPE above, we now send the query to MySQL
            objConnection.query(
                'SELECT * FROM list',
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
 * All active category with ID
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
 * All active category with ID
 */
app.post( '/api/db/list', function ( objRequest, objResponse ){
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

/* Start listening on port 3000 */
app.listen( node_port );
console.log( "App listening on port " + node_port );