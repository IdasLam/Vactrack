import * as firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/database'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig.json'

firebase.initializeApp(firebaseConfig)
firebase.analytics()
