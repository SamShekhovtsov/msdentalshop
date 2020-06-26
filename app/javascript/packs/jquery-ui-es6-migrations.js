import 'webpack-jquery-ui'

const Sine = (p) => {
  return 1 - Math.cos( p * Math.PI / 2 );
}

const Circ = (p) => {
  return 1 - Math.sqrt( 1 - p * p );
}

const Elastic = (p) => {
  return p === 0 || p === 1 ? p :
    -Math.pow( 2, 8 * ( p - 1 ) ) * Math.sin( ( ( p - 1 ) * 80 - 7.5 ) * Math.PI / 15 );
}

const Back = (p) => {
  return p * p * ( 3 * p - 2 );
}

const Bounce = (p) => {
  var pow2,
    bounce = 4;

  while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
  return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
}

export {Sine, Circ, Elastic, Back, Bounce}