

/* This is called with the results from from FB.getLoginStatus().
 *
 */
function statusChangeCallback(response){
    //console.log('statusChangeCallback');
    //console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
    
        // Logged into your app and Facebook.
        document.getElementById("alb").innerHTML = "";
        document.getElementById("status").innerHTML = "";
        
        getFbAlbums();
        document.getElementById('alb').style.display = 'block';
        document.getElementById("fb_button").style.visibility = "hidden";
        document.getElementById("status").innerHTML = "";
    }
    else 
        if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
        }
        else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
        }
}

/*  This function is called when someone finishes with the Login
 * Button.  See the onlogin handler attached to it in the sample
 * code below.
 *
 */
function checkLoginState(){
    document.location.reload();
    FB.getLoginStatus(function(response){
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function(){
    FB.init({
        appId: 1386458058305302,
        cookie: true, // enable cookies to allow the server to access 
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v2.0' // use version 2.0
    });
    
    /* Now that we've initialized the JavaScript SDK, we call 
     * FB.getLoginStatus().  This function gets the state of the
     * person visiting this page and can return one of three states to
     * the callback you provide.  They can be:
     *
     * 1. Logged into your app ('connected')
     * 2. Logged into Facebook, but not your app ('not_authorized')
     * 3. Not logged into Facebook and can't tell if they are logged into
     *    your app or not.
     *
     * These three cases are handled in the callback function.
     */
    FB.getLoginStatus(function(response){
        statusChangeCallback(response);
    });
    
};

/* Load the SDK asynchronously
 *
 */
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) 
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/* Here we run a very simple test of the Graph API after login is
 * successful.  See statusChangeCallback() for when this call is made.
 */
function testAPI(){
    //console.log('Welcome!  Fetching your information.... ');
    FB.api('/me/albums', {
        fields: 'id,name'
    }, function(response){
    
        //console.log("album called");
        //console.log("len = " + response.data.length);
        for (var i = 0; i < response.data.length; i++) {
            var album = response.data[i];
            //console.log('album, ' + album.id + '.');
            //console.log('album name, ' + album.name + '.');
            
            if (album.name != 'Profile Pictures') {
                getPhotosForAlbumId(album.id);
            }
        }
    });
    
}

/* Fetch user facebook albums information
 *
 */
function getFbAlbums(){
    //console.log('*** getFbAlbums() ***');
    FB.api('/me/albums', {
        fields: 'id,name,cover_photo,link'
    }, function(response){
    
        //console.log("getFbAlbums(): album called");
        //console.log("getFbAlbums(): len = " + response.data.length);
        for (var i = 0; i < response.data.length; i++) {
            var album = response.data[i];
            
            if (album.name != 'Profile Pictures') {
                //console.log('getFbAlbums(): album name, ' + album.name + '.');
                //console.log('getFbAlbums(): album Id, ' + album.id + '.');
                //console.log('getFbAlbums(): album cover_photo, ' + album.cover_photo + '.');
                
                getFbAlbumCoverPhoto(album);
            }
        }
        
    });
    
}

/* Fetch user facebook albums cover photo to display as thumbnails
 *
 */
function getFbAlbumCoverPhoto(album){
    FB.api('/' + album.cover_photo + "?type=large", function(photo){
        //console.log('getFbAlbums(): got photos for album ' + album.cover_photo);
        
        // photo.picture contain the link to picture
        //console.log('getFbAlbums(): photo.picture = ' + photo.picture + '.');
        
        var image = document.createElement('img');
        image.src = photo.picture;
        image.id = album.cover_photo
        
        //console.log('getFbAlbums(): image.id = ' + image.id + '.');
        image.onclick = function(){
            document.getElementById("alb").innerHTML = "";
            getPhotosForAlbumId(album.id)
        };
        document.getElementById('alb').appendChild(image);
        
    });
}

/* Fetch user photos from facebook album
 *
 */
function getPhotosForAlbumId(albumId){
    //document.getElementById("alb").innerHTML = "";
    //document.getElementById('alb').style.display = 'none';
    //console.log("*** getPhotosForAlbumId() ***");
    FB.api('/' + albumId + '/photos?type=album', function(photos){
        //console.log('getPhotosForAlbumId(): got photos for album ' + albumId);
        
        if (photos && photos.data && photos.data.length) {
            for (var j = 0; j < photos.data.length; j++) {
                var photo = photos.data[j];
                //console.log(photos.data[j].images[0].source);
                // photo.picture contain the link to picture
                
                //console.log('getPhotosForAlbumId(): photo.picture = ' + photo.picture + '.');
                var image = document.createElement('img');
                image.src = photo.source;
                
                document.getElementById('alb').appendChild(image);
            }
        }
        Galleria.loadTheme('/js/galleria/themes/classic/galleria.classic.min.js');
        Galleria.run('.galleria');
    });
}

/* Logout Facebook user
 *
 */
function fbLogout(){
    FB.getLoginStatus(function(response){
        if (response && response.status === 'connected') {
            FB.logout(function(response){
                document.location.reload();
            });
        }
    });
}
