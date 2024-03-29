//imports

importScripts('js/sw-utils.js');


const STATIC_CACHE     = 'static-v2';
const DYNAMIC_CACHE    = 'dynamic-v1';
const INMUTABLE_CACHE  = 'inmutable-v1';


const APP_SEHLL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
]

const APP_SHELL_INMUTABLE = [
    'css/animate.css',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'js/libs/jquery.js'
]



self.addEventListener( 'install' , e => {
 
    const CacheStatic    = caches.open( STATIC_CACHE )
                               .then( cache => cache.addAll( APP_SEHLL ) )

    const CacheInmutable = caches.open( INMUTABLE_CACHE )
                               .then( cache => cache.addAll( APP_SHELL_INMUTABLE ) )

    e.waitUntil( Promise.all([CacheStatic, CacheInmutable]) );

} )


self.addEventListener( 'activate', e => {


    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

})


self.addEventListener( 'fetch' , e => {

   const respuesta = caches.match( e.request )
                            .then( res => {
                                        if( res ){
                                            return res;
                                        }else{
                                            return fetch( e.request ).then( newRes =>{ 
                                                  
                                                    return updateDynamicCache( DYNAMIC_CACHE , e.request, newRes ) 
                                                
                                            }).catch( console.log )
                                        }
                              })

    e.respondWith( respuesta );

})