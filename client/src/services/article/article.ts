import firebase from 'firebase/app'
import 'firebase/firestore'

// const auth = firebase.auth()
const firestore = firebase.firestore()

const getAllArticles = () => {
    const docRef = firestore.collection('articles')
}
