jQuery( document ).ready( function(){
    // Connect right button with click event
    $("#btnGetSuccessContent").on("click", function (){
        _getRESTfulData( 'showAll' );
    });

    // Connect wrong button with click event
    $("#btnGetErrorContent").on("click", function (){
        _getRESTfulData( 'social_security_numbers' );
    });

});

// Function to get JSON data using RESTful API 
function _getRESTfulData( thisContentType ){
    

    //try to hit the service and get the data
    $.getJSON( "/api/db/" + thisContentType, function( data ){
        
        // Setup an array variable to hold the table rows
        var theseNodes = [];
        
        // Be sure we don't have an error
        if( data.result != 'error' ){
            
            // For each db row, format the results to display the table rows
            $.each( data.rows, function( index, objRow ){
                theseNodes.push( "<tr><td>" + objRow.ID + "</td><td>" + objRow.Title + "</td><td>" + objRow.Body + "</td></tr>" );
            });

        }else{
            // An error has occured. Display that instead!
            
            theseNodes.push( "<tr><td colspan='3'> An error has occured... " + data.err_type + ": " + data.err + "</td></tr>" );
        }
        // Now display the HTML results, whether an error or a rowset
        $("#nodes_results tbody").html( theseNodes );
    });
    
}