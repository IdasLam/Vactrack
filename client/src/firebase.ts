import * as firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/database'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyBOuPwXoezhpGhnHBFyl9AouCzODbzMWQA',
    authDomain: 'vactrack-87132.firebaseapp.com',
    databaseURL: 'https://vactrack-87132.firebaseio.com',
    projectId: 'vactrack-87132',
    storageBucket: 'vactrack-87132.appspot.com',
    messagingSenderId: '91574914055',
    appId: '1:91574914055:web:ff382a849dce483795eea2',
    measurementId: 'G-RVBYD3F8WN',
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()
